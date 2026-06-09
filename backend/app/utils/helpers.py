import uuid, re, math
from slugify import slugify as python_slugify
from datetime import datetime

def generate_order_number():
    """Generates order number: TMC-YYYYMMDD-XXXX"""
    date_part = datetime.now().strftime('%Y%m%d')
    unique_part = str(uuid.uuid4())[:4].upper()
    return f"TMC-{date_part}-{unique_part}"

def slugify(text):
    return python_slugify(text, max_length=80, word_boundary=True)

def validate_uuid(value):
    try:
        uuid.UUID(str(value))
        return True
    except ValueError:
        return False

def format_price(amount):
    return f"₹{amount:,.2f}"

def sanitize_string(s, max_length=500):
    if not s: return None
    return str(s).strip()[:max_length]
