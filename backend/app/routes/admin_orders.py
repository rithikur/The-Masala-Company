from flask import Blueprint, request, Response
from flask_jwt_extended import jwt_required
from app.middleware import admin_required
from app.utils.supabase_client import get_supabase_admin
from app.utils.response import success, error
import csv
import io

admin_orders_bp = Blueprint('admin_orders', __name__)

@admin_orders_bp.route('', methods=['GET'])
@jwt_required()
@admin_required
def list_admin_orders():
    """Retrieve all customer orders for order management table."""
    sb_admin = get_supabase_admin()
    try:
        res = sb_admin.table('orders').select('*').order('created_at', desc=True).execute()
        orders = res.data or []
        
        # Enrich each order with items, variants, and products info
        for order in orders:
            items_res = (
                sb_admin.table('order_items')
                .select('*, product_variants(*, products(*))')
                .eq('order_id', order['id'])
                .execute()
            )
            order['items'] = items_res.data or []
            
            # Fetch user email / details
            user_res = sb_admin.table('users').select('email, first_name, last_name').eq('id', order['user_id']).execute()
            if user_res.data:
                order['user'] = user_res.data[0]
            else:
                order['user'] = {"email": "anonymous@example.com", "first_name": "Guest", "last_name": "Customer"}

        return success(orders, "Admin orders list fetched")
    except Exception as e:
        return error(str(e), 500)


@admin_orders_bp.route('/<string:order_id>/status', methods=['PUT'])
@jwt_required()
@admin_required
def update_order_status(order_id):
    """Update order status timeline (pending -> processing -> shipped -> delivered -> cancelled)."""
    data = request.get_json()
    if not data or 'status' not in data:
        return error("Status field is required", 400)
    
    new_status = data.get('status')
    valid_statuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled']
    if new_status not in valid_statuses:
        return error(f"Invalid status. Must be one of {valid_statuses}", 400)

    sb_admin = get_supabase_admin()
    try:
        res = sb_admin.table('orders').update({"status": new_status}).eq('id', order_id).execute()
        if not res.data:
            return error("Order not found or update failed", 404)
        
        updated_order = res.data[0]
        return success(updated_order, f"Order status updated to {new_status}")
    except Exception as e:
        return error(str(e), 500)


@admin_orders_bp.route('/customers', methods=['GET'])
@jwt_required()
@admin_required
def list_admin_customers():
    """Retrieve all users with role 'customer'."""
    sb_admin = get_supabase_admin()
    try:
        res = sb_admin.table('users').select('*').eq('role', 'customer').order('created_at', desc=True).execute()
        return success(res.data or [], "Admin customers list fetched")
    except Exception as e:
        return error(str(e), 500)


@admin_orders_bp.route('/exports/orders', methods=['GET'])
@jwt_required()
@admin_required
def export_orders_csv():
    """Generates and returns order registry details as a CSV download."""
    sb_admin = get_supabase_admin()
    try:
        res = sb_admin.table('orders').select('*').order('created_at', desc=True).execute()
        orders = res.data or []

        # Create memory stream
        si = io.StringIO()
        cw = csv.writer(si)
        
        # Write headers
        cw.writerow(['Order ID', 'User ID', 'Total Amount (INR)', 'Status', 'Shipping Address', 'Created At'])
        
        for o in orders:
            cw.writerow([
                o.get('id'),
                o.get('user_id'),
                o.get('total_amount'),
                o.get('status'),
                str(o.get('shipping_address')),
                o.get('created_at')
            ])
            
        output = si.getvalue()
        return Response(
            output,
            mimetype="text/csv",
            headers={"Content-disposition": "attachment; filename=orders_export.csv"}
        )
    except Exception as e:
        return error(str(e), 500)


@admin_orders_bp.route('/exports/customers', methods=['GET'])
@jwt_required()
@admin_required
def export_customers_csv():
    """Generates and returns customer profiles registry as a CSV download."""
    sb_admin = get_supabase_admin()
    try:
        res = sb_admin.table('users').select('*').order('created_at', desc=True).execute()
        users = res.data or []

        # Create memory string stream
        si = io.StringIO()
        cw = csv.writer(si)
        
        # Write headers
        cw.writerow(['User ID', 'Email', 'Role', 'First Name', 'Last Name', 'Created At'])
        
        for u in users:
            cw.writerow([
                u.get('id'),
                u.get('email'),
                u.get('role'),
                u.get('first_name'),
                u.get('last_name'),
                u.get('created_at')
            ])
            
        output = si.getvalue()
        return Response(
            output,
            mimetype="text/csv",
            headers={"Content-disposition": "attachment; filename=customers_export.csv"}
        )
    except Exception as e:
        return error(str(e), 500)
