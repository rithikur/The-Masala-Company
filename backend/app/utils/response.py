from flask import jsonify
import math

def success(data=None, message=None, status_code=200, meta=None):
    """Returns standard success JSON response."""
    payload = {'success': True}
    if message: payload['message'] = message
    if data is not None: payload['data'] = data
    if meta: payload['meta'] = meta
    return jsonify(payload), status_code

def error(message, status_code=400, errors=None, code=None):
    """Returns standard error JSON response."""
    payload = {'success': False, 'error': message}
    if errors: payload['errors'] = errors
    if code: payload['code'] = code
    return jsonify(payload), status_code

def paginated(data, total, page, per_page, status_code=200):
    """Returns paginated response with meta."""
    return success(
        data=data,
        meta={
            'total': total,
            'page': page,
            'per_page': per_page,
            'pages': math.ceil(total / per_page) if per_page > 0 else 1,
            'has_next': (page * per_page) < total,
            'has_prev': page > 1,
        },
        status_code=status_code
    )
