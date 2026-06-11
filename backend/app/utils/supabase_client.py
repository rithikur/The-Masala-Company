from supabase import create_client, Client
from flask import current_app

_supabase: Client = None
_supabase_admin: Client = None

def get_supabase() -> Client:
    """Anon key client — respects RLS"""
    global _supabase
    if _supabase is None:
        _supabase = create_client(
            current_app.config['SUPABASE_URL'],
            current_app.config['SUPABASE_ANON_KEY']
        )
    return _supabase

def get_supabase_admin() -> Client:
    """Service role client — bypasses RLS, use only in admin routes"""
    global _supabase_admin
    if _supabase_admin is None:
        service_key = current_app.config.get('SUPABASE_SERVICE_KEY') or current_app.config.get('SUPABASE_ANON_KEY')
        _supabase_admin = create_client(
            current_app.config['SUPABASE_URL'],
            service_key
        )
    return _supabase_admin
