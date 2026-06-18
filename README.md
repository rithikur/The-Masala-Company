# 🍛 The Masala Company

An elegant, premium e-commerce platform dedicated to single-origin, stone-ground, and ethically sourced heirloom Indian spices. Built as a full-stack modern web application, it combines a sensory shopping experience with a comprehensive administrative console.

---

## ✨ Features

### 🛍️ Client Experience
* **Cinematic Product Catalog**: Explore single-origin spices and handcrafted blends with interactive galleries and smooth zoom effects.
* **Smart Wishlist & Bag**: Add products to your wishlist and shopping bag seamlessly.
* **Authentication Safeguards**: Interactive authentication prompts (`AuthModal`) protect wishlist and checkout pages for guest visitors.
* **Responsive Luxury Design**: Curated warm HSL palettes (spice brown, gold turmeric, ivory cream), bespoke typography, and micro-interactions powered by Framer Motion and GSAP.

### 💼 Admin Console
* **Interactive Dashboard**: Track sales activity, active catalogs, and order volumes.
* **Orders Registry**: Fully interactive tables for reviewing order invoices, customer shipping details, grand totals, and managing order status.
* **Fulfillment Status Timeline**: Step-by-step order lifecycle tracker (Pending ➔ Processing ➔ Shipped ➔ Delivered) using high-contrast status keys.
* **Customers Directory**: Manage verified buyers, guest profiles, and real-time registered user databases.
* **Inventory Control**: Real-time warnings for low-stock spice quantities.
* **Search History Insights**: Track trending user searches to adapt sourcing strategies.
* **Role-Based Access Control**: Multi-tier admin settings (`Admin`, `Editor`, `Viewer`) to protect access privileges.
* **Live Refresh Data**: One-click topbar refresh button to pull immediate database updates from the client-facing website without reloading the browser manually.
* **CSV Export utilities**: Download complete records of customer directories and order registries locally.

---

## 🛠️ Tech Stack

### Frontend (Client)
* **Core**: React 18+ (Vite)
* **Animations**: GSAP, Framer Motion
* **Styling**: TailwindCSS & Vanilla CSS variables
* **Notifications**: React Hot Toast (customized with dismiss triggers)
* **Icons**: React Icons (Hi, Md)

### Backend (API & DB)
* **Framework**: Python 3.10+ (Flask)
* **Database & Auth**: Supabase (PostgreSQL, OAuth, JWT, Schema-managed)
* **Session Management**: Flask-JWT-Extended

---

## 🚀 Getting Started

### 1. Clone & Setup Workspace
```bash
git clone https://github.com/rithikur/The-Masala-Company.git
cd The-Masala-Company
```

### 2. Frontend Development
Configure your environment variables in `.env` or `.env.local` using the keys outlined in `.env.example`:
* `VITE_SUPABASE_URL`
* `VITE_SUPABASE_ANON_KEY`
* `VITE_EMAILJS_SERVICE_ID`
* `VITE_EMAILJS_PUBLIC_KEY`

```bash
# Install dependencies
npm install

# Start Vite HMR server
npm run dev

# Build for production
npm run build
```

The frontend will run at `http://localhost:5173`.

### 3. Backend Development
Configure your database configuration in `backend/.env` using the keys outlined in `backend/.env.example`:
* `FLASK_APP`
* `SUPABASE_URL`
* `SUPABASE_SERVICE_ROLE_KEY`
* `JWT_SECRET_KEY`

```bash
cd backend

# Create & activate a virtual environment
python -m venv venv
source venv/bin/activate # On Windows: .\venv\Scripts\activate

# Install package dependencies
pip install -r requirements.txt

# Run server
python run.py
```

The backend server will run at `http://localhost:5000`.

---

## 📁 Project Structure

```
The-Masala-Company/
├── backend/            # Flask API, routing, and Supabase integration
│   ├── app/
│   │   ├── routes/     # Orders, customers, products, and categories endpoints
│   │   └── utils/
│   └── run.py
├── supabase/           # Database schema definition files
├── src/                # Frontend codebase
│   ├── components/     # UI components (AuthModal, PageWrapper, Toasters)
│   ├── context/        # Auth, Cart, and Wishlist contexts
│   ├── layouts/        # AdminLayout with Topbar headers & Collapsible Sidebars
│   ├── pages/          # Catalog, Checkout, and Admin Panel pages
│   └── main.jsx
├── public/             # Static luxury spice asset images
└── README.md
```

---

## 📄 License
This project is open-source and available under the [MIT License](LICENSE).

## 👤 Author
**Rithik Urs**
