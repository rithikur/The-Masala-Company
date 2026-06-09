from flask import Blueprint, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.utils.supabase_client import get_supabase_admin
from app.utils.response import success, error

wishlist_bp = Blueprint('wishlist', __name__)

# ---------------------------------------------------------------------------
# GET /api/wishlist
# ---------------------------------------------------------------------------
@wishlist_bp.route('', methods=['GET'])
@jwt_required()
def get_wishlist():
    """Fetch wishlist items for the logged-in user."""
    user_id = get_jwt_identity()
    sb_admin = get_supabase_admin()

    try:
        res = (
            sb_admin.table('wishlist')
            .select('*, products(*)')
            .eq('user_id', user_id)
            .execute()
        )
        
        # Enrich products with images and variants so they match catalog layout
        items = res.data or []
        for item in items:
            product = item.get('products')
            if product:
                pid = product['id']
                
                # Fetch variants
                v_res = sb_admin.table('product_variants').select('*').eq('product_id', pid).order('price').execute()
                product['variants'] = v_res.data or []
                
                # Fetch images
                img_res = sb_admin.table('product_images').select('*').eq('product_id', pid).order('is_primary', desc=True).execute()
                product['images'] = img_res.data or []

        return success(items, "Wishlist items fetched")

    except Exception as e:
        return error(f"Failed to fetch wishlist: {str(e)}", 500)


# ---------------------------------------------------------------------------
# POST /api/wishlist (Toggle product in wishlist)
# ---------------------------------------------------------------------------
@wishlist_bp.route('', methods=['POST'])
@jwt_required()
def toggle_wishlist():
    """Toggle a product's presence in the user's wishlist."""
    user_id = get_jwt_identity()
    data = request.get_json()

    if not data or 'product_id' not in data:
        return error("Product ID is required", 400)

    product_id = data['product_id']
    sb_admin = get_supabase_admin()

    try:
        # Check if already exists
        check_res = (
            sb_admin.table('wishlist')
            .select('*')
            .eq('user_id', user_id)
            .eq('product_id', product_id)
            .execute()
        )

        if check_res.data:
            # Exists -> Remove it (toggle off)
            sb_admin.table('wishlist').delete().eq('user_id', user_id).eq('product_id', product_id).execute()
            return success({"wishlisted": False}, "Removed from wishlist", 200)
        else:
            # Does not exist -> Add it (toggle on)
            insert_res = (
                sb_admin.table('wishlist')
                .insert({
                    "user_id": user_id,
                    "product_id": product_id
                })
                .execute()
            )
            return success({"wishlisted": True, "item": insert_res.data[0]}, "Added to wishlist", 201)

    except Exception as e:
        return error(f"Failed to update wishlist: {str(e)}", 500)
