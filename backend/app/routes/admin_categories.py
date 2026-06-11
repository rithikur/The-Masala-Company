from flask import Blueprint, request
from flask_jwt_extended import jwt_required
from app.middleware import admin_required
from app.utils.supabase_client import get_supabase_admin
from app.utils.response import success, error

admin_categories_bp = Blueprint('admin_categories', __name__)

@admin_categories_bp.route('', methods=['POST'])
@jwt_required()
@admin_required
def create_category():
    data = request.get_json()
    if not data:
        return error("No data provided", 400)
    
    name = data.get('name')
    slug = data.get('slug')
    description = data.get('description', '')

    if not name or not slug:
        return error("Category Name and Slug are required", 400)

    sb_admin = get_supabase_admin()
    
    try:
        res = sb_admin.table('categories').insert({
            "name": name,
            "slug": slug,
            "description": description
        }).execute()
        
        if not res.data:
            return error("Failed to create category", 500)
            
        return success(res.data[0], "Category created successfully", 201)
    except Exception as e:
        return error(str(e), 500)


@admin_categories_bp.route('/<string:category_id>', methods=['PUT'])
@jwt_required()
@admin_required
def update_category(category_id):
    data = request.get_json()
    if not data:
        return error("No data provided", 400)
        
    sb_admin = get_supabase_admin()
    
    try:
        res = sb_admin.table('categories').update({
            "name": data.get('name'),
            "slug": data.get('slug'),
            "description": data.get('description')
        }).eq('id', category_id).execute()
        
        if not res.data:
            return error("Category not found or update failed", 404)
            
        return success(res.data[0], "Category updated successfully")
    except Exception as e:
        return error(str(e), 500)


@admin_categories_bp.route('/<string:category_id>', methods=['DELETE'])
@jwt_required()
@admin_required
def delete_category(category_id):
    sb_admin = get_supabase_admin()
    try:
        sb_admin.table('categories').delete().eq('id', category_id).execute()
        return success(None, "Category deleted successfully")
    except Exception as e:
        return error(str(e), 500)
