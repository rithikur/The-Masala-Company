from flask import Blueprint, request
from app.utils.supabase_client import get_supabase_admin
from app.utils.response import success, error

categories_bp = Blueprint('categories', __name__)


# ---------------------------------------------------------------------------
# GET /api/categories
# ---------------------------------------------------------------------------

@categories_bp.route('', methods=['GET'])
def list_categories():
    """
    Return all active categories.
    Optionally include a product count per category via ?with_count=true.
    """
    with_count = request.args.get('with_count', 'false').lower() == 'true'
    sb_admin   = get_supabase_admin()

    try:
        result = (
            sb_admin.table('categories')
            .select('*')
            .order('name')
            .execute()
        )
        categories = result.data or []

        if with_count:
            for cat in categories:
                pc_res = (
                    sb_admin.table('product_categories')
                    .select('product_id', count='exact')
                    .eq('category_id', cat['id'])
                    .execute()
                )
                cat['product_count'] = pc_res.count or 0

        return success(categories, "Categories fetched")

    except Exception as e:
        return error(f"Failed to fetch categories: {str(e)}", 500)


# ---------------------------------------------------------------------------
# GET /api/categories/<slug>
# ---------------------------------------------------------------------------

@categories_bp.route('/<string:slug>', methods=['GET'])
def get_category(slug):
    """Return a single category by slug."""
    sb_admin = get_supabase_admin()

    try:
        result = (
            sb_admin.table('categories')
            .select('*')
            .eq('slug', slug)
            .single()
            .execute()
        )
    except Exception:
        return error("Category not found", 404)

    if not result.data:
        return error("Category not found", 404)

    return success(result.data, "Category fetched")
