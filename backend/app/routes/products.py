from flask import Blueprint, request
from app.utils.supabase_client import get_supabase, get_supabase_admin
from app.utils.response import success, error, paginated

products_bp = Blueprint('products', __name__)

# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def _fetch_nested_product(sb_admin, product: dict) -> dict:
    """Attach variants and images to a product dict in-place and return it."""
    pid = product['id']

    # Variants — ordered by price ascending so frontend can show smallest first
    variants_res = (
        sb_admin.table('product_variants')
        .select('*')
        .eq('product_id', pid)
        .order('price')
        .execute()
    )
    product['variants'] = variants_res.data or []

    # Images — primary image first
    images_res = (
        sb_admin.table('product_images')
        .select('*')
        .eq('product_id', pid)
        .order('is_primary', desc=True)
        .execute()
    )
    product['images'] = images_res.data or []

    return product


# ---------------------------------------------------------------------------
# GET /api/products
# ---------------------------------------------------------------------------

@products_bp.route('', methods=['GET'])
def list_products():
    """
    List published products.

    Query params:
      - page        int   (default 1)
      - per_page    int   (default 12, max 48)
      - category    str   category slug
      - search      str   full-text / ILIKE search on name/description
      - sort        str   price_asc | price_desc | newest (default newest)
    """
    try:
        page     = max(1, int(request.args.get('page', 1)))
        per_page = min(48, max(1, int(request.args.get('per_page', 12))))
    except (ValueError, TypeError):
        return error("Invalid pagination parameters", 400)

    category_slug = request.args.get('category', '').strip()
    search_query  = request.args.get('search', '').strip()
    sort_param    = request.args.get('sort', 'newest').strip().lower()

    sb_admin = get_supabase_admin()

    try:
        # ── Resolve category slug → id ──────────────────────────────────────
        category_id = None
        if category_slug:
            cat_res = (
                sb_admin.table('categories')
                .select('id')
                .eq('slug', category_slug)
                .single()
                .execute()
            )
            if cat_res.data:
                category_id = cat_res.data['id']
            else:
                # Unknown category → return empty result instead of error
                return paginated([], 0, page, per_page)

        # ── Build base query ────────────────────────────────────────────────
        # If category filter is active we join via product_categories
        if category_id:
            # Get matching product_ids first
            pc_res = (
                sb_admin.table('product_categories')
                .select('product_id')
                .eq('category_id', category_id)
                .execute()
            )
            product_ids = [r['product_id'] for r in (pc_res.data or [])]
            if not product_ids:
                return paginated([], 0, page, per_page)

            base_q = (
                sb_admin.table('products')
                .select('*', count='exact')
                .eq('status', 'published')
                .in_('id', product_ids)
            )
        else:
            base_q = (
                sb_admin.table('products')
                .select('*', count='exact')
                .eq('status', 'published')
            )

        # ── Search ──────────────────────────────────────────────────────────
        if search_query:
            # Supabase PostgREST ILIKE via .ilike() — search across name field
            # For broader coverage we use or_
            base_q = base_q.or_(
                f"name.ilike.%{search_query}%,description.ilike.%{search_query}%,origin.ilike.%{search_query}%"
            )

        # ── Sort ────────────────────────────────────────────────────────────
        if sort_param == 'price_asc':
            # Price lives on variants; we sort after fetching. For now sort by
            # created_at then re-order in Python after variant enrichment.
            base_q = base_q.order('created_at', desc=False)
        elif sort_param == 'price_desc':
            base_q = base_q.order('created_at', desc=True)
        else:  # newest (default)
            base_q = base_q.order('created_at', desc=True)

        # ── Pagination ──────────────────────────────────────────────────────
        offset = (page - 1) * per_page
        result = base_q.range(offset, offset + per_page - 1).execute()

        products = result.data or []
        total    = result.count or 0

        # ── Enrich with variants & images ───────────────────────────────────
        enriched = [_fetch_nested_product(sb_admin, p) for p in products]

        # ── Price sort (client-side on the enriched set) ────────────────────
        if sort_param in ('price_asc', 'price_desc'):
            def _min_price(p):
                prices = [v['price'] for v in p.get('variants', []) if v.get('price') is not None]
                return min(prices) if prices else float('inf')

            enriched.sort(key=_min_price, reverse=(sort_param == 'price_desc'))

        return paginated(enriched, total, page, per_page)

    except Exception as e:
        return error(f"Failed to fetch products: {str(e)}", 500)


# ---------------------------------------------------------------------------
# GET /api/products/<slug>
# ---------------------------------------------------------------------------

@products_bp.route('/<string:slug>', methods=['GET'])
def get_product(slug):
    """
    Fetch a single published product by slug.
    Response nests all weight variants and images.
    """
    sb_admin = get_supabase_admin()

    try:
        product_res = (
            sb_admin.table('products')
            .select('*')
            .eq('slug', slug)
            .eq('status', 'published')
            .single()
            .execute()
        )
    except Exception:
        return error("Product not found", 404)

    if not product_res.data:
        return error("Product not found", 404)

    try:
        product = _fetch_nested_product(sb_admin, product_res.data)

        # Also fetch categories this product belongs to
        pc_res = (
            sb_admin.table('product_categories')
            .select('category_id, categories(id, name, slug)')
            .eq('product_id', product['id'])
            .execute()
        )
        product['categories'] = [
            row['categories']
            for row in (pc_res.data or [])
            if row.get('categories')
        ]

        return success(product, "Product fetched")

    except Exception as e:
        return error(f"Failed to fetch product: {str(e)}", 500)
