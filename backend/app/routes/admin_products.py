from flask import Blueprint, request
from flask_jwt_extended import jwt_required
from app.middleware import admin_required
from app.utils.supabase_client import get_supabase_admin
from app.utils.response import success, error

admin_products_bp = Blueprint('admin_products', __name__)

# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------
def _fetch_nested_product(sb_admin, product: dict) -> dict:
    pid = product['id']

    # Variants
    variants_res = (
        sb_admin.table('product_variants')
        .select('*')
        .eq('product_id', pid)
        .order('price')
        .execute()
    )
    product['variants'] = variants_res.data or []

    # Images
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
# GET /api/admin/products (List all products including drafts)
# ---------------------------------------------------------------------------
@admin_products_bp.route('', methods=['GET'])
@jwt_required()
@admin_required
def list_admin_products():
    """List all products (draft + published) for admin table."""
    sb_admin = get_supabase_admin()
    try:
        res = sb_admin.table('products').select('*').order('created_at', desc=True).execute()
        products = res.data or []
        for p in products:
            _fetch_nested_product(sb_admin, p)
        return success(products, "Admin products catalog fetched")
    except Exception as e:
        return error(str(e), 500)


# ---------------------------------------------------------------------------
# POST /api/admin/products (Create Product)
# ---------------------------------------------------------------------------
@admin_products_bp.route('', methods=['POST'])
@jwt_required()
@admin_required
def create_product():
    """Create a new product with its variants and images."""
    data = request.get_json()
    if not data:
        return error("No data provided", 400)

    name = data.get('name')
    slug = data.get('slug')
    description = data.get('description')
    origin = data.get('origin')
    status = data.get('status', 'draft')
    variants = data.get('variants', [])
    images = data.get('images', [])

    if not name or not slug:
        return error("Product Name and Slug are required", 400)

    sb_admin = get_supabase_admin()

    try:
        # 1. Insert product record
        prod_res = (
            sb_admin.table('products')
            .insert({
                "name": name,
                "slug": slug,
                "description": description,
                "origin": origin,
                "status": status
            })
            .execute()
        )

        if not prod_res.data:
            return error("Failed to create product record", 500)

        product = prod_res.data[0]
        product_id = product['id']

        # 2. Insert Variants
        inserted_variants = []
        for var in variants:
            v_res = (
                sb_admin.table('product_variants')
                .insert({
                    "product_id": product_id,
                    "weight": var.get('weight'),
                    "price": var.get('price'),
                    "inventory_count": var.get('inventory_count', 0),
                    "sku": var.get('sku')
                })
                .execute()
            )
            if v_res.data:
                inserted_variants.append(v_res.data[0])

        # 3. Insert Images
        inserted_images = []
        for img in images:
            i_res = (
                sb_admin.table('product_images')
                .insert({
                    "product_id": product_id,
                    "url": img.get('url'),
                    "alt_text": img.get('alt_text', ''),
                    "is_primary": img.get('is_primary', False)
                })
                .execute()
            )
            if i_res.data:
                inserted_images.append(i_res.data[0])

        product['variants'] = inserted_variants
        product['images'] = inserted_images

        return success(product, "Product created successfully", 201)

    except Exception as e:
        return error(f"Failed to create product: {str(e)}", 500)


# ---------------------------------------------------------------------------
# PUT /api/admin/products/:id (Update Product)
# ---------------------------------------------------------------------------
@admin_products_bp.route('/<string:product_id>', methods=['PUT'])
@jwt_required()
@admin_required
def update_product(product_id):
    """Update an existing product and its variants and images."""
    data = request.get_json()
    if not data:
        return error("No data provided", 400)

    sb_admin = get_supabase_admin()

    try:
        # Check if product exists
        check_res = sb_admin.table('products').select('*').eq('id', product_id).execute()
        if not check_res.data:
            return error("Product not found", 404)

        # 1. Update basic product info
        allowed_fields = ['name', 'slug', 'description', 'origin', 'status']
        update_data = {k: v for k, v in data.items() if k in allowed_fields}

        prod_res = sb_admin.table('products').update(update_data).eq('id', product_id).execute()
        product = prod_res.data[0]

        # 2. Update Variants (delete existing and rewrite to avoid synchronization mismatch)
        if 'variants' in data:
            sb_admin.table('product_variants').delete().eq('product_id', product_id).execute()
            inserted_variants = []
            for var in data['variants']:
                v_res = (
                    sb_admin.table('product_variants')
                    .insert({
                        "product_id": product_id,
                        "weight": var.get('weight'),
                        "price": var.get('price'),
                        "inventory_count": var.get('inventory_count', 0),
                        "sku": var.get('sku')
                    })
                    .execute()
                )
                if v_res.data:
                    inserted_variants.append(v_res.data[0])
            product['variants'] = inserted_variants
        else:
            product = _fetch_nested_product(sb_admin, product)

        # 3. Update Images (delete existing and rewrite)
        if 'images' in data:
            sb_admin.table('product_images').delete().eq('product_id', product_id).execute()
            inserted_images = []
            for img in data['images']:
                i_res = (
                    sb_admin.table('product_images')
                    .insert({
                        "product_id": product_id,
                        "url": img.get('url'),
                        "alt_text": img.get('alt_text', ''),
                        "is_primary": img.get('is_primary', False)
                    })
                    .execute()
                )
                if i_res.data:
                    inserted_images.append(i_res.data[0])
            product['images'] = inserted_images
        else:
            # If not in data, fetch current ones
            product = _fetch_nested_product(sb_admin, product)

        return success(product, "Product updated successfully")

    except Exception as e:
        return error(f"Failed to update product: {str(e)}", 500)


# ---------------------------------------------------------------------------
# DELETE /api/admin/products/:id (Delete Product)
# ---------------------------------------------------------------------------
@admin_products_bp.route('/<string:product_id>', methods=['DELETE'])
@jwt_required()
@admin_required
def delete_product(product_id):
    """Delete an existing product. Cascading delete handles variants/images."""
    sb_admin = get_supabase_admin()

    try:
        # Check if product exists
        check_res = sb_admin.table('products').select('*').eq('id', product_id).execute()
        if not check_res.data:
            return error("Product not found", 404)

        # Delete product
        sb_admin.table('products').delete().eq('id', product_id).execute()
        return success(None, "Product deleted successfully")

    except Exception as e:
        return error(f"Failed to delete product: {str(e)}", 500)
