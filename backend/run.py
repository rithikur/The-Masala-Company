from dotenv import load_dotenv
import os
load_dotenv()
print("VITE_SUPABASE_URL in run.py:", os.environ.get('VITE_SUPABASE_URL'))
from app import create_app
app = create_app('development')
if __name__ == '__main__':
    app.run(debug=True, port=5000)
