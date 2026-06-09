from flask import Blueprint, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.utils.supabase_client import get_supabase_admin
from app.utils.response import success, error

users_bp = Blueprint('users', __name__)

# ---------------------------------------------------------------------------
# GET /api/users/profile
# ---------------------------------------------------------------------------
@users_bp.route('/profile', methods=['GET'])
@jwt_required()
def get_profile():
    """Get profile details for the authenticated user."""
    identity = get_jwt_identity()
    sb_admin = get_supabase_admin()
    
    try:
        user_res = sb_admin.table('users').select('*').eq('id', identity).single().execute()
        if not user_res.data:
            return error("User profile not found", 404)
        return success(user_res.data, "User profile retrieved")
    except Exception as e:
        return error(str(e), 500)


# ---------------------------------------------------------------------------
# PUT /api/users/profile
# ---------------------------------------------------------------------------
@users_bp.route('/profile', methods=['PUT'])
@jwt_required()
def update_profile():
    """Update profile details (first_name, last_name, shipping_address, phone, etc.)."""
    identity = get_jwt_identity()
    data = request.get_json()
    
    if not data:
        return error("No data provided", 400)
        
    allowed_fields = ['first_name', 'last_name', 'shipping_address', 'phone']
    update_data = {k: v for k, v in data.items() if k in allowed_fields}
    
    if not update_data:
        return error("No valid profile fields to update", 400)
        
    sb_admin = get_supabase_admin()
    try:
        # Check if shipping_address or phone column exists, if not they can be stored dynamically or we update public.users
        response = sb_admin.table('users').update(update_data).eq('id', identity).execute()
        if not response.data:
            return error("Profile update failed", 400)
        return success(response.data[0], "Profile updated successfully")
    except Exception as e:
        # If schema doesn't have shipping_address column in users, we can alter table or handle gracefully
        # Let's try altering database schema or falling back to metadata. But database schema update is cleaner.
        return error(str(e), 400)
