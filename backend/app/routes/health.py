from flask import Blueprint, jsonify
from datetime import datetime

health_bp = Blueprint('health', __name__)

@health_bp.route('/health', methods=['GET'])
def health_check():
    return jsonify({
        'status': 'healthy',
        'service': 'The Masala Company API',
        'version': '1.0.0',
        'timestamp': datetime.utcnow().isoformat(),
    }), 200
