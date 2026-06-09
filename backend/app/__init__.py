from flask import Flask, jsonify
from app.config import config
from app.extensions import jwt, cors

def create_app(config_name='development'):
    app = Flask(__name__)
    app.config.from_object(config[config_name])

    # Init extensions
    jwt.init_app(app)
    cors.init_app(app, resources={r"/api/*": {"origins": app.config['CORS_ORIGINS']}})

    # Register blueprints
    from app.routes.health import health_bp
    from app.routes.auth import auth_bp
    from app.routes.products import products_bp
    from app.routes.categories import categories_bp
    from app.routes.storage import storage_bp
    from app.routes.orders import orders_bp
    from app.routes.wishlist import wishlist_bp
    from app.routes.users import users_bp
    from app.routes.admin_products import admin_products_bp
    from app.routes.admin_analytics import admin_analytics_bp
    from app.routes.admin_orders import admin_orders_bp
    from app.routes.admin_reviews import admin_reviews_bp

    app.register_blueprint(health_bp,    url_prefix='/api')
    app.register_blueprint(auth_bp,      url_prefix='/api/auth')
    app.register_blueprint(products_bp,  url_prefix='/api/products')
    app.register_blueprint(categories_bp, url_prefix='/api/categories')
    app.register_blueprint(storage_bp,   url_prefix='/api/storage')
    app.register_blueprint(orders_bp,    url_prefix='/api/orders')
    app.register_blueprint(wishlist_bp,  url_prefix='/api/wishlist')
    app.register_blueprint(users_bp,     url_prefix='/api/users')
    app.register_blueprint(admin_products_bp, url_prefix='/api/admin/products')
    app.register_blueprint(admin_analytics_bp, url_prefix='/api/admin/analytics')
    app.register_blueprint(admin_orders_bp, url_prefix='/api/admin/orders')
    app.register_blueprint(admin_reviews_bp, url_prefix='/api/admin/reviews')

    # JWT error handlers (return JSON, not HTML)
    @jwt.expired_token_loader
    def expired_token_callback(jwt_header, jwt_payload):
        return jsonify({'error': 'Token has expired', 'code': 'TOKEN_EXPIRED'}), 401

    @jwt.invalid_token_loader
    def invalid_token_callback(error):
        return jsonify({'error': 'Invalid token', 'code': 'INVALID_TOKEN'}), 401

    @jwt.unauthorized_loader
    def missing_token_callback(error):
        return jsonify({'error': 'Authorization required', 'code': 'UNAUTHORIZED'}), 401

    # Global error handlers
    @app.errorhandler(404)
    def not_found(e):
        return jsonify({'error': 'Resource not found'}), 404

    @app.errorhandler(422)
    def unprocessable(e):
        return jsonify({'error': 'Invalid input'}), 422

    @app.errorhandler(500)
    def server_error(e):
        return jsonify({'error': 'Internal server error'}), 500

    return app
