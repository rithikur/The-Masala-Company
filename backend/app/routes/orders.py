from flask import Blueprint, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.utils.supabase_client import get_supabase_admin
from app.utils.response import success, error

orders_bp = Blueprint('orders', __name__)

# ---------------------------------------------------------------------------
# POST /api/orders (Create order)
# ---------------------------------------------------------------------------
@orders_bp.route('', methods=['POST'])
@jwt_required()
def create_order():
    """
    Create a new order for the authenticated user.
    Body:
    {
        "total_amount": float,
        "shipping_address": { "first_name": "...", "address_line": "...", "city": "...", "postal_code": "..." },
        "items": [
            { "variant_id": "...", "quantity": int, "price_at_time": float }
        ]
    }
    """
    user_id = get_jwt_identity()
    data = request.get_json()

    if not data:
        return error("No order data provided", 400)

    total_amount = data.get('total_amount')
    shipping_address = data.get('shipping_address')
    items = data.get('items')

    if not total_amount or not shipping_address or not items:
        return error("Missing required order fields", 400)

    sb_admin = get_supabase_admin()

    try:
        # 1. Insert order record
        order_res = (
            sb_admin.table('orders')
            .insert({
                "user_id": user_id,
                "total_amount": total_amount,
                "shipping_address": shipping_address,
                "status": "pending"
            })
            .execute()
        )

        if not order_res.data:
            return error("Failed to initialize order", 500)

        order = order_res.data[0]
        order_id = order['id']

        # 2. Insert order items & Update inventory
        inserted_items = []
        for item in items:
            var_id = item.get('variant_id')
            qty = item.get('quantity')
            price = item.get('price_at_time')

            if not var_id or not qty or not price:
                continue

            # Check inventory & decrement
            variant_res = sb_admin.table('product_variants').select('*').eq('id', var_id).single().execute()
            if variant_res.data:
                current_stock = variant_res.data.get('inventory_count', 0)
                new_stock = max(0, current_stock - qty)
                sb_admin.table('product_variants').update({"inventory_count": new_stock}).eq('id', var_id).execute()

            item_res = (
                sb_admin.table('order_items')
                .insert({
                    "order_id": order_id,
                    "variant_id": var_id,
                    "quantity": qty,
                    "price_at_time": price
                })
                .execute()
            )
            if item_res.data:
                inserted_items.append(item_res.data[0])

        order['items'] = inserted_items
        return success(order, "Order placed successfully", 201)

    except Exception as e:
        return error(f"Failed to place order: {str(e)}", 500)


# ---------------------------------------------------------------------------
# GET /api/orders/me (Authenticated user order history)
# ---------------------------------------------------------------------------
@orders_bp.route('/me', methods=['GET'])
@jwt_required()
def get_my_orders():
    """Fetch order history for the logged-in user."""
    user_id = get_jwt_identity()
    sb_admin = get_supabase_admin()

    try:
        # Get orders
        orders_res = (
            sb_admin.table('orders')
            .select('*')
            .eq('user_id', user_id)
            .order('created_at', desc=True)
            .execute()
        )
        orders = orders_res.data or []

        # Enrich orders with their items and corresponding products
        for order in orders:
            items_res = (
                sb_admin.table('order_items')
                .select('*, product_variants(*, products(*))')
                .eq('order_id', order['id'])
                .execute()
            )
            order['items'] = items_res.data or []

        return success(orders, "Orders history retrieved successfully")

    except Exception as e:
        return error(f"Failed to fetch order history: {str(e)}", 500)
