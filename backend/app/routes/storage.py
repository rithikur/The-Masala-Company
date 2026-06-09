import os
import uuid
import mimetypes
from flask import Blueprint, request
from flask_jwt_extended import jwt_required
from app.middleware import admin_required
from app.utils.supabase_client import get_supabase_admin
from app.utils.response import success, error

storage_bp = Blueprint('storage', __name__)

# Allowed MIME types for product images
ALLOWED_MIME_TYPES = {
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/webp',
    'image/gif',
    'image/svg+xml',
}

# Max file size: 5 MB
MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024


def _validate_image(file) -> str | None:
    """
    Validate file object against allowed MIME types and size.
    Returns an error message string on failure, None on success.
    """
    if not file or file.filename == '':
        return "No file provided"

    # Check MIME type by guessing from filename (fast path)
    mime_type, _ = mimetypes.guess_type(file.filename)
    if mime_type not in ALLOWED_MIME_TYPES:
        # Also check content_type header as fallback
        if file.content_type not in ALLOWED_MIME_TYPES:
            return f"File type '{file.content_type}' not allowed. Use JPEG, PNG, WebP, GIF or SVG."

    # Read content to check size, then seek back
    file.seek(0, 2)  # Seek to end
    size = file.tell()
    file.seek(0)     # Seek back to start

    if size > MAX_FILE_SIZE_BYTES:
        return f"File size exceeds 5 MB limit ({size // 1024} KB uploaded)"

    return None


# ---------------------------------------------------------------------------
# POST /api/storage/upload
# ---------------------------------------------------------------------------

@storage_bp.route('/upload', methods=['POST'])
@jwt_required()
@admin_required
def upload_image():
    """
    Upload an image to Supabase Storage `product-images` bucket.

    Form fields:
      - file        (required) — the image file
      - folder      (optional) — sub-folder path, e.g. "product-slug" (default: "general")

    Returns:
      - public_url  the publicly accessible CDN URL
      - path        the storage path within the bucket
    """
    file   = request.files.get('file')
    folder = request.form.get('folder', 'general').strip().strip('/')

    # Validate
    validation_error = _validate_image(file)
    if validation_error:
        return error(validation_error, 400)

    # Build a unique filename to avoid collisions
    ext      = os.path.splitext(file.filename)[1].lower() or '.jpg'
    unique   = f"{folder}/{uuid.uuid4().hex}{ext}"
    content  = file.read()
    mime     = file.content_type or 'image/jpeg'

    sb_admin = get_supabase_admin()

    try:
        # Upload to the product-images bucket
        sb_admin.storage.from_('product-images').upload(
            path=unique,
            file=content,
            file_options={"content-type": mime, "upsert": "false"},
        )

        # Build the public URL
        public_url_res = sb_admin.storage.from_('product-images').get_public_url(unique)
        public_url     = public_url_res if isinstance(public_url_res, str) else public_url_res.get('publicUrl', '')

        return success(
            {
                "public_url": public_url,
                "path":       unique,
                "bucket":     "product-images",
                "size_bytes": len(content),
                "mime_type":  mime,
            },
            "Image uploaded successfully",
            201,
        )

    except Exception as e:
        return error(f"Upload failed: {str(e)}", 500)


# ---------------------------------------------------------------------------
# DELETE /api/storage/delete
# ---------------------------------------------------------------------------

@storage_bp.route('/delete', methods=['DELETE'])
@jwt_required()
@admin_required
def delete_image():
    """
    Delete an image from Supabase Storage.

    JSON body:
      - path  (required) — the storage path returned by upload, e.g. "product-slug/abc123.jpg"
    """
    data = request.get_json()
    if not data or not data.get('path'):
        return error("Storage path is required", 400)

    path     = data['path'].strip().strip('/')
    sb_admin = get_supabase_admin()

    try:
        sb_admin.storage.from_('product-images').remove([path])
        return success({"path": path}, "Image deleted successfully")

    except Exception as e:
        return error(f"Delete failed: {str(e)}", 500)
