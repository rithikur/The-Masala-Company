from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, create_refresh_token, jwt_required, get_jwt_identity
from app.utils.supabase_client import get_supabase, get_supabase_admin
from app.utils.response import success, error
import re

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    if not data:
        return error("No data provided", 400)
    
    email = data.get('email')
    password = data.get('password')
    first_name = data.get('first_name')
    last_name = data.get('last_name')
    
    if not email or not re.match(r"[^@]+@[^@]+\.[^@]+", email):
        return error("Invalid email format", 400)
    if not password or len(password) < 8:
        return error("Password must be at least 8 characters", 400)
    if not first_name or not first_name.strip():
        return error("First name is required", 400)
    if not last_name or not last_name.strip():
        return error("Last name is required", 400)
        
    sb_admin = get_supabase_admin()
    
    try:
        # Create user using Supabase Admin client
        response = sb_admin.auth.admin.create_user({
            "email": email,
            "password": password,
            "user_metadata": {
                "first_name": first_name,
                "last_name": last_name
            },
            "email_confirm": True # Auto confirm for this flow
        })
        
        user = response.user
        
        # We need the user profile that was auto-created by the trigger in public.users
        user_response = sb_admin.table('users').select('*').eq('id', user.id).single().execute()
        user_data = user_response.data
        
        access_token = create_access_token(identity=user.id)
        refresh_token = create_refresh_token(identity=user.id)
        
        return success({
            "user": user_data,
            "access_token": access_token,
            "refresh_token": refresh_token
        }, "Registration successful", 201)
    except Exception as e:
        return error(str(e), 400)


@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    if not data:
        return error("No data provided", 400)
        
    email = data.get('email')
    password = data.get('password')
    
    if not email or not password:
        return error("Email and password are required", 400)
        
    sb = get_supabase()
    
    try:
        response = sb.auth.sign_in_with_password({"email": email, "password": password})
        user = response.user
        
        sb_admin = get_supabase_admin()
        user_response = sb_admin.table('users').select('*').eq('id', user.id).single().execute()
        user_data = user_response.data
        
        access_token = create_access_token(identity=user.id)
        refresh_token = create_refresh_token(identity=user.id)
        
        return success({
            "user": user_data,
            "access_token": access_token,
            "refresh_token": refresh_token
        }, "Login successful", 200)
    except Exception as e:
        return error("Invalid email or password", 401)


@auth_bp.route('/google', methods=['POST'])
def google_auth():
    data = request.get_json()
    if not data or 'access_token' not in data:
        return error("Access token is required", 400)
        
    sb_admin = get_supabase_admin()
    try:
        auth_response = sb_admin.auth.get_user(data['access_token'])
        user = auth_response.user
        
        if not user:
            return error("Invalid token", 401)
            
        user_response = sb_admin.table('users').select('*').eq('id', user.id).single().execute()
        user_data = user_response.data
        
        access_token = create_access_token(identity=user.id)
        refresh_token = create_refresh_token(identity=user.id)
        
        return success({
            "user": user_data,
            "access_token": access_token,
            "refresh_token": refresh_token
        }, "Google login successful", 200)
    except Exception as e:
        return error(str(e), 400)


@auth_bp.route('/refresh', methods=['POST'])
@jwt_required(refresh=True)
def refresh():
    identity = get_jwt_identity()
    access_token = create_access_token(identity=identity)
    return success({
        "access_token": access_token
    }, "Token refreshed", 200)


@auth_bp.route('/logout', methods=['POST'])
@jwt_required()
def logout():
    # In JWT, logout is handled by client dropping token
    return success(message="Logout successful", status_code=200)


@auth_bp.route('/forgot-password', methods=['POST'])
def forgot_password():
    data = request.get_json()
    if not data or 'email' not in data:
        return error("Email is required", 400)
        
    email = data.get('email')
    sb_admin = get_supabase_admin()
    
    try:
        sb_admin.auth.admin.generate_link({
            "type": "recovery",
            "email": email
        })
    except Exception as e:
        # Ignore errors to prevent email enumeration
        pass
        
    return success(message="If the email exists, a reset link has been sent.", status_code=200)


@auth_bp.route('/me', methods=['GET'])
@jwt_required()
def me():
    identity = get_jwt_identity()
    sb_admin = get_supabase_admin()
    try:
        user_response = sb_admin.table('users').select('*').eq('id', identity).single().execute()
        return success(user_response.data, "User data fetched", 200)
    except Exception as e:
        return error("User not found", 404)


@auth_bp.route('/profile', methods=['PUT'])
@jwt_required()
def update_profile():
    identity = get_jwt_identity()
    data = request.get_json()
    
    allowed_fields = ['first_name', 'last_name']
    update_data = {k: v for k, v in data.items() if k in allowed_fields}
    
    if not update_data:
        return error("No valid fields to update", 400)
        
    sb_admin = get_supabase_admin()
    try:
        response = sb_admin.table('users').update(update_data).eq('id', identity).execute()
        if not response.data:
            return error("User not updated", 400)
        return success(response.data[0], "User profile updated", 200)
    except Exception as e:
        return error(str(e), 400)

