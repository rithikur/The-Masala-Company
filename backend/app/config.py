import os
from datetime import timedelta

class BaseConfig:
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'dev-secret-key'
    JWT_SECRET_KEY = os.environ.get('JWT_SECRET_KEY') or 'jwt-secret-key'
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=24)
    JWT_REFRESH_TOKEN_EXPIRES = timedelta(days=30)
    JWT_TOKEN_LOCATION = ['headers']
    JWT_HEADER_NAME = 'Authorization'
    JWT_HEADER_TYPE = 'Bearer'
    SUPABASE_URL = os.environ.get('SUPABASE_URL') or os.environ.get('VITE_SUPABASE_URL')
    if SUPABASE_URL:
        SUPABASE_URL = SUPABASE_URL.rstrip('/')
        if SUPABASE_URL.endswith('/rest/v1'):
            SUPABASE_URL = SUPABASE_URL[:-8].rstrip('/')
    SUPABASE_SERVICE_KEY = os.environ.get('SUPABASE_SERVICE_KEY') or os.environ.get('SUPABASE_SERVICE_ROLE_KEY')
    SUPABASE_ANON_KEY = os.environ.get('SUPABASE_ANON_KEY') or os.environ.get('VITE_SUPABASE_ANON_KEY')
    SUPABASE_STORAGE_BUCKET_PRODUCTS = 'product-images'
    SUPABASE_STORAGE_BUCKET_CATEGORIES = 'category-images'
    MAX_CONTENT_LENGTH = 6 * 1024 * 1024  # 6 MB — covers 5 MB image + multipart overhead

class DevelopmentConfig(BaseConfig):
    DEBUG = True
    CORS_ORIGINS = '*'

class ProductionConfig(BaseConfig):
    DEBUG = False
    CORS_ORIGINS = [os.environ.get('FRONTEND_URL', 'https://themasalacompany.netlify.app')]

config = {
    'development': DevelopmentConfig,
    'production': ProductionConfig
}
