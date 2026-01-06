# Biser Prirode Shop

A full-stack e-commerce web app for **Biser Prirode** (natural products), including a customer-facing shop and an admin dashboard for managing products and orders.

---

## Features

### Customer (Shop)
- Browse landing pages / product catalog
- Product details page
- Cart (add/remove items, view cart)
- Checkout / order details flow

### Admin Dashboard
- Admin login
- Manage products (list, create, edit)
- View/manage orders

---

## Tech Stack
- **Frontend:** React (folder: `frontend/`)
- **Backend:** Node.js + Express (folder: `backend/`)
- **Database / ORM:** PostgreSQL + Prisma
- **Other:** Docker (optional via `docker-compose.yml`)

---

## Project Structure
- `frontend/` — client app (UI)
- `backend/` — API/server
- `screenshots/` — UI preview images
- `docker-compose.yml` — optional container setup

---

## Run Locally

### 1) Backend
```bash
cd backend
npm install
cp .env.example .env
npx prisma migrate dev
npm run dev

Frontend
cd frontend
npm install
cp .env.example .env.local
npm run dev
```
Screenshots
<p>
  <img src="screenshots/LandingPage1.png" width="48%" />
  <img src="screenshots/LandingPage2.png" width="48%" />
</p>
<p>
  <img src="screenshots/ProductDetails.png" width="48%" />
  <img src="screenshots/CartDetails.png" width="48%" />
</p>
<p>
  <img src="screenshots/OrderingDetails.png" width="48%" />
  <img src="screenshots/AdminLogin.png" width="48%" />
</p>
<p>
  <img src="screenshots/AdminProducts.png" width="48%" />
  <img src="screenshots/NewProduct.png" width="48%" />
</p>
<p>
  <img src="screenshots/EditProduct.png" width="48%" />
  <img src="screenshots/AdminOrders.png" width="48%" />
</p>



