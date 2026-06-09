-- =============================================================================
-- THE MASALA COMPANY — Supabase PostgreSQL Schema (Phase 1)
-- =============================================================================

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();
DROP FUNCTION IF EXISTS public.is_admin();

-- Drop existing tables to ensure clean setup
DROP TABLE IF EXISTS public.product_categories CASCADE;
DROP TABLE IF EXISTS public.product_images CASCADE;
DROP TABLE IF EXISTS public.product_variants CASCADE;
DROP TABLE IF EXISTS public.products CASCADE;
DROP TABLE IF EXISTS public.categories CASCADE;
DROP TABLE IF EXISTS public.users CASCADE;

-- 1. users table
CREATE TABLE public.users (
  id               UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email            TEXT NOT NULL UNIQUE,
  role             TEXT NOT NULL DEFAULT 'customer' CHECK (role IN ('customer', 'admin')),
  created_at       TIMESTAMPTZ DEFAULT NOW(),
  first_name       TEXT,
  last_name        TEXT,
  phone            TEXT,
  shipping_address JSONB
);

-- 2. categories table
CREATE TABLE public.categories (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT NOT NULL,
  slug        TEXT NOT NULL UNIQUE,
  description TEXT,
  image_url   TEXT
);

-- 3. products table
CREATE TABLE public.products (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug        TEXT NOT NULL UNIQUE,
  name        TEXT NOT NULL,
  description TEXT,
  origin      TEXT,
  status      TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- 4. product_variants table
CREATE TABLE public.product_variants (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id      UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  weight          TEXT NOT NULL CHECK (weight IN ('50g', '100g', '250g', '500g', '1kg')),
  price           NUMERIC(10,2) NOT NULL,
  inventory_count INTEGER NOT NULL DEFAULT 0,
  sku             TEXT UNIQUE NOT NULL,
  UNIQUE(product_id, weight)
);

-- 5. product_images table
CREATE TABLE public.product_images (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id  UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  url         TEXT NOT NULL,
  alt_text    TEXT,
  is_primary  BOOLEAN DEFAULT FALSE
);

-- 6. product_categories join table
CREATE TABLE public.product_categories (
  product_id  UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  category_id UUID NOT NULL REFERENCES public.categories(id) ON DELETE CASCADE,
  PRIMARY KEY (product_id, category_id)
);

-- =============================================================================
-- Row Level Security (RLS) & Policies
-- =============================================================================

-- Enable RLS on every table
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_categories ENABLE ROW LEVEL SECURITY;

-- Helper function to check if the current user is an admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.users
    WHERE id = auth.uid()
    AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- users policies (authenticated access for profiles)
CREATE POLICY "users_select_own_or_admin"
  ON public.users FOR SELECT
  USING (auth.uid() = id OR public.is_admin());

CREATE POLICY "users_update_own_or_admin"
  ON public.users FOR UPDATE
  USING (auth.uid() = id OR public.is_admin());

-- categories policies (public read, admin write)
CREATE POLICY "categories_public_read"
  ON public.categories FOR SELECT
  USING (TRUE);

CREATE POLICY "categories_admin_all"
  ON public.categories FOR ALL
  USING (public.is_admin());

-- products policies (public read, admin write)
CREATE POLICY "products_public_read"
  ON public.products FOR SELECT
  USING (TRUE);

CREATE POLICY "products_admin_all"
  ON public.products FOR ALL
  USING (public.is_admin());

-- product_variants policies (public read, admin write)
CREATE POLICY "variants_public_read"
  ON public.product_variants FOR SELECT
  USING (TRUE);

CREATE POLICY "variants_admin_all"
  ON public.product_variants FOR ALL
  USING (public.is_admin());

-- product_images policies (public read, admin write)
CREATE POLICY "images_public_read"
  ON public.product_images FOR SELECT
  USING (TRUE);

CREATE POLICY "images_admin_all"
  ON public.product_images FOR ALL
  USING (public.is_admin());

-- product_categories policies (public read, admin write)
CREATE POLICY "product_categories_public_read"
  ON public.product_categories FOR SELECT
  USING (TRUE);

CREATE POLICY "product_categories_admin_all"
  ON public.product_categories FOR ALL
  USING (public.is_admin());

-- =============================================================================
-- Trigger: Automatically create a user entry in public.users on signup
-- =============================================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, first_name, last_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'first_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'last_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'role', 'customer')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =============================================================================
-- PHASE 2: Performance Indexes
-- =============================================================================

-- Core lookup indexes
CREATE INDEX IF NOT EXISTS idx_products_slug         ON public.products(slug);
CREATE INDEX IF NOT EXISTS idx_products_status       ON public.products(status);
CREATE INDEX IF NOT EXISTS idx_products_created_at   ON public.products(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_categories_slug       ON public.categories(slug);
CREATE INDEX IF NOT EXISTS idx_variants_product_id   ON public.product_variants(product_id);
CREATE INDEX IF NOT EXISTS idx_variants_price        ON public.product_variants(price);
CREATE INDEX IF NOT EXISTS idx_images_product_id     ON public.product_images(product_id);
CREATE INDEX IF NOT EXISTS idx_product_categories_cat ON public.product_categories(category_id);

-- Full-text search index on products name + description
CREATE INDEX IF NOT EXISTS idx_products_name_desc_fts
  ON public.products USING GIN (to_tsvector('english', coalesce(name, '') || ' ' || coalesce(description, '')));

-- =============================================================================
-- PHASE 2: Supabase Storage Buckets
-- (Run these in Supabase SQL Editor, or create buckets manually in the dashboard)
-- =============================================================================

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'product-images',
  'product-images',
  TRUE,
  5242880,
  ARRAY['image/jpeg','image/jpg','image/png','image/webp','image/gif','image/svg+xml']
) ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'category-images',
  'category-images',
  TRUE,
  2097152,
  ARRAY['image/jpeg','image/jpg','image/png','image/webp','image/gif','image/svg+xml']
) ON CONFLICT (id) DO NOTHING;

-- =============================================================================
-- PHASE 2: Storage RLS Policies
-- =============================================================================

-- product-images: public read, admin write
CREATE POLICY "product_images_public_read"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'product-images');

CREATE POLICY "product_images_admin_insert"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'product-images' AND public.is_admin());

CREATE POLICY "product_images_admin_update"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'product-images' AND public.is_admin());

CREATE POLICY "product_images_admin_delete"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'product-images' AND public.is_admin());

-- category-images: public read, admin write
CREATE POLICY "category_images_public_read"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'category-images');

CREATE POLICY "category_images_admin_insert"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'category-images' AND public.is_admin());

CREATE POLICY "category_images_admin_update"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'category-images' AND public.is_admin());

CREATE POLICY "category_images_admin_delete"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'category-images' AND public.is_admin());

-- =============================================================================
-- END OF PHASE 2 MIGRATION
-- =============================================================================

-- =============================================================================
-- PHASE 5: Shopping Cart, Checkout, and Profile Schema Updates
-- =============================================================================

-- 7. orders table
CREATE TABLE IF NOT EXISTS public.orders (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id          UUID REFERENCES public.users(id) ON DELETE SET NULL,
  status           TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'shipped', 'delivered', 'cancelled')),
  total_amount     NUMERIC(10,2) NOT NULL,
  shipping_address JSONB NOT NULL,
  created_at       TIMESTAMPTZ DEFAULT NOW()
);

-- 8. order_items table
CREATE TABLE IF NOT EXISTS public.order_items (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id      UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  variant_id    UUID REFERENCES public.product_variants(id) ON DELETE SET NULL,
  quantity      INTEGER NOT NULL CHECK (quantity > 0),
  price_at_time NUMERIC(10,2) NOT NULL
);

-- 9. wishlist table
CREATE TABLE IF NOT EXISTS public.wishlist (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  UNIQUE(user_id, product_id)
);

-- Enable RLS
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wishlist ENABLE ROW LEVEL SECURITY;

-- Orders policies
CREATE POLICY "orders_select_own_or_admin"
  ON public.orders FOR SELECT
  USING (auth.uid() = user_id OR public.is_admin());

CREATE POLICY "orders_insert_own_or_admin"
  ON public.orders FOR INSERT
  WITH CHECK (auth.uid() = user_id OR public.is_admin());

CREATE POLICY "orders_admin_all"
  ON public.orders FOR ALL
  USING (public.is_admin());

-- Order Items policies
CREATE POLICY "order_items_select_own_or_admin"
  ON public.order_items FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.orders 
    WHERE id = order_items.order_id AND (user_id = auth.uid() OR public.is_admin())
  ));

CREATE POLICY "order_items_insert_own_or_admin"
  ON public.order_items FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.orders 
    WHERE id = order_items.order_id AND (user_id = auth.uid() OR public.is_admin())
  ));

CREATE POLICY "order_items_admin_all"
  ON public.order_items FOR ALL
  USING (public.is_admin());

-- Wishlist policies
CREATE POLICY "wishlist_select_own_or_admin"
  ON public.wishlist FOR SELECT
  USING (auth.uid() = user_id OR public.is_admin());

CREATE POLICY "wishlist_insert_own"
  ON public.wishlist FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "wishlist_delete_own"
  ON public.wishlist FOR DELETE
  USING (auth.uid() = user_id);

-- Performance Indexes for Phase 5
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON public.orders(user_id);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON public.order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_wishlist_user_id ON public.wishlist(user_id);


