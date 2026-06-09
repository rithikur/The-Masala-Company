from backend.app import create_app

app = create_app('production')

def handler(request, context):
    """Vercel Serverless Function entry point for Flask app.
    The `request` argument is a Vercel request object. We adapt it to a
    WSGI environ and invoke the Flask application, returning the iterable
    response as expected by Vercel.
    """
    # Convert Vercel request to WSGI environ using Flask's built‑in
    # `request.environ` mapping. Vercel passes a dictionary‑like object.
    environ = request.environ

    def start_response(status, response_headers, exc_info=None):
        # Vercel expects the handler to return the raw iterable response.
        # We simply capture status and headers for potential debugging.
        return []

    return app(environ, start_response)
