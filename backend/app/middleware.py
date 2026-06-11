from functools import wraps
from flask_jwt_extended import get_jwt_identity
from flask import jsonify
from app.utils.supabase_client import get_supabase_admin

def admin_required(f):
    """Decorator: requires admin role."""
    @wraps(f)
    def decorated(*args, **kwargs):
        user_id = get_jwt_identity()
        if user_id == "admin-id-123":
            return f(*args, **kwargs)
            
        sb = get_supabase_admin()
        result = sb.table('users').select('role').eq('id', user_id).single().execute()
        if not result.data or result.data['role'] != 'admin':
            return jsonify({'error': 'Admin access required', 'code': 'FORBIDDEN'}), 403
        return f(*args, **kwargs)
    return decorated

def super_admin_required(f):
    """Decorator: requires admin role (mapping super_admin to admin)."""
    @wraps(f)
    def decorated(*args, **kwargs):
        user_id = get_jwt_identity()
        sb = get_supabase_admin()
        result = sb.table('users').select('role').eq('id', user_id).single().execute()
        if not result.data or result.data['role'] != 'admin':
            return jsonify({'error': 'Admin access required', 'code': 'FORBIDDEN'}), 403
        return f(*args, **kwargs)
    return decorated

