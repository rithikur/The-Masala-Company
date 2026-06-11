import os
import glob
import time
import mimetypes
from dotenv import load_dotenv
load_dotenv()
from app import create_app
from app.utils.supabase_client import get_supabase_admin

app = create_app()

def upload_image(sb_admin, bucket, filepath, object_name):
    with open(filepath, 'rb') as f:
        file_bytes = f.read()
    
    mime_type, _ = mimetypes.guess_type(filepath)
    if not mime_type:
        mime_type = 'application/octet-stream'
        
    try:
        try:
            sb_admin.storage.from_(bucket).remove([object_name])
        except Exception:
            pass
            
        res = sb_admin.storage.from_(bucket).upload(
            file=file_bytes,
            path=object_name,
            file_options={"content-type": mime_type}
        )
        url = sb_admin.storage.from_(bucket).get_public_url(object_name)
        return url
    except Exception as e:
        print(f"Failed to upload {object_name}: {e}")
        return None

def seed_db():
    with app.app_context():
        sb_admin = get_supabase_admin()
        
        # 1. Clear existing data
        sb_admin.table('product_categories').delete().neq('product_id', '00000000-0000-0000-0000-000000000000').execute()
        sb_admin.table('product_images').delete().neq('id', '00000000-0000-0000-0000-000000000000').execute()
        sb_admin.table('product_variants').delete().neq('id', '00000000-0000-0000-0000-000000000000').execute()
        sb_admin.table('products').delete().neq('id', '00000000-0000-0000-0000-000000000000').execute()
        sb_admin.table('categories').delete().neq('id', '00000000-0000-0000-0000-000000000000').execute()
        
        # Find images
        brain_dir = r"C:\Users\Admin\.gemini\antigravity-ide\brain\538746b9-a8b8-4b0d-a035-67d773aaa176"
        
        cat_images = {
            'Whole Spices': glob.glob(os.path.join(brain_dir, 'category_whole_spices_*.png')),
            'Ground Spices': glob.glob(os.path.join(brain_dir, 'category_ground_spices_*.png')),
            'Spice Blends': glob.glob(os.path.join(brain_dir, 'category_spice_blends_*.png')),
            'Seeds & Pods': glob.glob(os.path.join(brain_dir, 'category_seeds_pods_*.png')),
            'Exotic & Rare': glob.glob(os.path.join(brain_dir, 'category_exotic_rare_*.png')),
            'Gift Sets': glob.glob(os.path.join(brain_dir, 'category_gift_sets_*.png'))
        }
        
        # Insert categories
        categories = []
        for name, imgs in cat_images.items():
            slug = name.lower().replace(' & ', '-and-').replace(' ', '-')
            url = ''
            if imgs:
                img_path = imgs[0]
                url = upload_image(sb_admin, 'category-images', img_path, f"{slug}.png")
                
            res = sb_admin.table('categories').insert({
                'name': name,
                'slug': slug,
                'description': f"Premium {name} sourced from the best farms.",
                'image_url': url
            }).execute()
            categories.append(res.data[0])
            print(f"Inserted Category: {name}")

        # Products
        products_data = [
            # Whole Spices
            {'name': 'Premium Tellicherry Black Peppercorns', 'slug': 'tellicherry-pepper', 'description': 'Aromatic and spicy black peppercorns from the Malabar coast.', 'origin': 'Malabar, Kerala', 'cat_slug': 'whole-spices', 'img_glob': 'product_whole_pepper_*.png', 'price': 350.00},
            {'name': 'Aromatic Star Anise', 'slug': 'star-anise', 'description': 'Beautiful star anise pods with a deep licorice flavor.', 'origin': 'Arunachal Pradesh', 'cat_slug': 'whole-spices', 'img_glob': 'product_whole_staranise_*.png', 'price': 420.00},
            {'name': 'Whole Cloves', 'slug': 'whole-cloves', 'description': 'Intensely aromatic and warm whole cloves.', 'origin': 'Kanyakumari', 'cat_slug': 'whole-spices', 'img_glob': 'product_whole_cloves_*.png', 'price': 380.00},
            
            # Ground Spices
            {'name': 'Erode Single-Origin Turmeric', 'slug': 'erode-turmeric', 'description': 'Vibrant golden turmeric with high curcumin content.', 'origin': 'Erode, Tamil Nadu', 'cat_slug': 'ground-spices', 'img_glob': 'product_ground_turmeric_*.png', 'price': 280.00},
            {'name': 'Kashmiri Lal Mirch Powder', 'slug': 'kashmiri-chilli', 'description': 'Vibrant deep red chilli powder with mild, sweet heat.', 'origin': 'Pampore, Kashmir', 'cat_slug': 'ground-spices', 'img_glob': 'product_ground_kashmiri_*.png', 'price': 320.00},
            {'name': 'Roasted Coriander Powder', 'slug': 'coriander-powder', 'description': 'Earthy, citrusy roasted coriander powder.', 'origin': 'Rajasthan', 'cat_slug': 'ground-spices', 'img_glob': 'product_ground_coriander_*.png', 'price': 190.00},
            
            # Spice Blends
            {'name': 'Royal Garam Masala', 'slug': 'royal-garam-masala', 'description': 'Our signature blend of 12 roasted premium spices.', 'origin': 'House Blend', 'cat_slug': 'spice-blends', 'img_glob': 'product_blend_garammasala_*.png', 'price': 450.00},
            {'name': 'Traditional Chai Masala', 'slug': 'chai-masala', 'description': 'Warming blend for the perfect cup of Indian tea.', 'origin': 'House Blend', 'cat_slug': 'spice-blends', 'img_glob': 'product_blend_chaimasala_*.png', 'price': 310.00},
            {'name': 'Madras Curry Powder', 'slug': 'madras-curry', 'description': 'Vibrant and spicy South Indian curry blend.', 'origin': 'Chennai, Tamil Nadu', 'cat_slug': 'spice-blends', 'img_glob': 'product_blend_madrascurry_*.png', 'price': 290.00},
            
            # Seeds & Pods
            {'name': 'Green Cardamom Pods', 'slug': 'green-cardamom', 'description': 'Plump, intensely aromatic green cardamom pods.', 'origin': 'Idukki, Kerala', 'cat_slug': 'seeds-and-pods', 'img_glob': 'product_seeds_cardamom_*.png', 'price': 850.00},
            {'name': 'Roasted Cumin Seeds (Jeera)', 'slug': 'roasted-cumin', 'description': 'Earthy, nutty roasted cumin seeds.', 'origin': 'Gujarat', 'cat_slug': 'seeds-and-pods', 'img_glob': 'product_seeds_cumin_*.png', 'price': 240.00},
            {'name': 'Sweet Fennel Seeds', 'slug': 'fennel-seeds', 'description': 'Sweet and aromatic fennel seeds, perfect as a digestive.', 'origin': 'Rajasthan', 'cat_slug': 'seeds-and-pods', 'img_glob': 'product_seeds_fennel_*.png', 'price': 180.00},
            
            # Exotic & Rare
            {'name': 'Kashmir Saffron Threads', 'slug': 'kashmir-saffron', 'description': 'Premium grade Mongra saffron from the valleys of Kashmir.', 'origin': 'Pampore, Kashmir', 'cat_slug': 'exotic-and-rare', 'img_glob': 'product_exotic_saffron_*.png', 'price': 2500.00},
            {'name': 'Ceylon Cinnamon Quills', 'slug': 'ceylon-cinnamon', 'description': 'True cinnamon, delicate and naturally sweet.', 'origin': 'Sri Lanka', 'cat_slug': 'exotic-and-rare', 'img_glob': 'product_exotic_cinnamon_*.png', 'price': 650.00},
            {'name': 'Whole Nutmeg & Mace', 'slug': 'nutmeg-mace', 'description': 'Whole nutmeg with its vibrant red mace covering.', 'origin': 'Kerala', 'cat_slug': 'exotic-and-rare', 'img_glob': 'product_exotic_nutmeg_*.png', 'price': 720.00},
            
            # Gift Sets
            {'name': 'The Essential Starter Kit', 'slug': 'starter-kit', 'description': 'A curated collection of 3 essential Indian spices.', 'origin': 'Assorted', 'cat_slug': 'gift-sets', 'img_glob': 'product_gift_starter_*.png', 'price': 999.00},
            {'name': 'The Chef\'s Master Collection', 'slug': 'chef-collection', 'description': 'A luxury box of rare and exotic spices for the culinary artist.', 'origin': 'Assorted', 'cat_slug': 'gift-sets', 'img_glob': 'product_gift_chef_*.png', 'price': 3499.00},
            {'name': 'Ultimate Chai Lover\'s Set', 'slug': 'chai-lover-set', 'description': 'Everything needed for the perfect cup of spiced tea.', 'origin': 'Assorted', 'cat_slug': 'gift-sets', 'img_glob': 'product_gift_starter_*.png', 'price': 1299.00},
        ]
        
        for p in products_data:
            # Create product
            res = sb_admin.table('products').insert({
                'name': p['name'],
                'slug': p['slug'],
                'description': p['description'],
                'origin': p['origin'],
                'status': 'published'
            }).execute()
            prod = res.data[0]
            pid = prod['id']
            print(f"Inserted Product: {p['name']}")
            
            # Map category
            cat_id = next(c['id'] for c in categories if c['slug'] == p['cat_slug'])
            sb_admin.table('product_categories').insert({
                'product_id': pid,
                'category_id': cat_id
            }).execute()
            
            # Add variant
            sb_admin.table('product_variants').insert({
                'product_id': pid,
                'weight': '100g',
                'price': p['price'],
                'inventory_count': 50,
                'sku': f"SKU-{p['slug'].upper()}-100G"
            }).execute()
            
            # Upload image
            imgs = glob.glob(os.path.join(brain_dir, p['img_glob']))
            if imgs:
                img_path = imgs[-1] # Take the latest generated
                url = upload_image(sb_admin, 'product-images', img_path, f"{p['slug']}.png")
                if url:
                    sb_admin.table('product_images').insert({
                        'product_id': pid,
                        'url': url,
                        'alt_text': p['name'],
                        'is_primary': True
                    }).execute()
                    print(f"Uploaded Image for: {p['name']}")
            else:
                print(f"Warning: No image found for {p['name']} matching glob {p['img_glob']}")

if __name__ == '__main__':
    seed_db()
