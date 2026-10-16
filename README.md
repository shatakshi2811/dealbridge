# DealBridge — Product Discovery & Affiliate Commerce Platform

A full-stack MERN application that allows users to browse products, compare merchant offers, and be redirected to external e-commerce sites to purchase.

## 🚀 Live Demo

- **Frontend**: _Coming soon (deployed on Vercel)_
- **Backend API**: _Coming soon (deployed on Render)_

### Demo Credentials

| Role  | Email                    | Password   |
|-------|--------------------------|------------|
| Admin | admin@dealbridge.com     | Admin@123  |
| User  | user@dealbridge.com      | User@1234  |

---

## 📋 Features

- **Product Discovery** — Browse 20+ products across 6 categories with search, filter, sort & pagination
- **Merchant Offers** — Each product shows multiple merchant offers sorted by lowest price
- **External Redirect** — Click tracking + redirect to Amazon, Flipkart, Croma, etc.
- **User Auth** — Register, login, JWT-based sessions
- **Wishlist** — Save products to a personal wishlist (authenticated users)
- **Admin Dashboard** — CRUD products and offers, view analytics
- **Analytics** — Real-time click stats, top products, top merchants

---

## 🏗 Architecture

```
DealBridge/
├── server/          # Node.js + Express.js REST API
│   ├── src/
│   │   ├── models/         # Mongoose schemas
│   │   ├── routes/         # Express routers
│   │   ├── controllers/    # Business logic
│   │   └── middleware/     # Auth, adminOnly, errorHandler
│   ├── scripts/
│   │   └── seed.js         # Database seeder
│   └── server.js           # Entry point
│
└── client/          # React.js frontend (Day 2–3)
```

---

## ⚙️ Local Setup

### Prerequisites

- Node.js >= 18
- MongoDB Atlas account (free M0 cluster)

### Backend

```bash
cd server
cp .env.example .env
# Edit .env and add your MONGODB_URI and JWT_SECRET
npm install
npm run seed    # Populate demo data
npm run dev     # Starts on http://localhost:5000
```

### Frontend

```bash
cd client
npm install
npm run dev     # Starts on http://localhost:3000
```

---

## 🔌 API Endpoints

### Auth
| Method | Endpoint              | Auth     | Description          |
|--------|-----------------------|----------|----------------------|
| POST   | `/api/auth/register`  | None     | Register user        |
| POST   | `/api/auth/login`     | None     | Login                |
| GET    | `/api/auth/me`        | Required | Get current user     |

### Products
| Method | Endpoint                      | Auth     | Description              |
|--------|-------------------------------|----------|--------------------------|
| GET    | `/api/products`               | None     | List with filters        |
| GET    | `/api/products/:id`           | None     | Product + offers detail  |
| POST   | `/api/products`               | Admin    | Create product           |
| PUT    | `/api/products/:id`           | Admin    | Update product           |
| DELETE | `/api/products/:id`           | Admin    | Deactivate product       |
| GET    | `/api/products/categories`    | None     | Available categories     |
| GET    | `/api/products/brands`        | None     | Available brands         |

### Products — Query Parameters
| Param      | Example               | Description                        |
|------------|-----------------------|------------------------------------|
| `search`   | `?search=macbook`     | Full-text search                   |
| `category` | `?category=Laptops`   | Filter by category                 |
| `brand`    | `?brand=Apple`        | Filter by brand                    |
| `minPrice` | `?minPrice=10000`     | Minimum price filter               |
| `maxPrice` | `?maxPrice=50000`     | Maximum price filter               |
| `sort`     | `?sort=price-asc`     | `newest`, `oldest`, `price-asc`, `price-desc` |
| `page`     | `?page=2`             | Page number (default: 1)           |
| `limit`    | `?limit=12`           | Items per page (default: 12)       |

### Offers
| Method | Endpoint                         | Auth  | Description       |
|--------|----------------------------------|-------|-------------------|
| GET    | `/api/products/:id/offers`       | None  | Get product offers|
| POST   | `/api/products/:id/offers`       | Admin | Add offer         |
| PUT    | `/api/offers/:id`                | Admin | Update offer      |
| DELETE | `/api/offers/:id`                | Admin | Delete offer      |

### Other
| Method | Endpoint                   | Auth      | Description         |
|--------|----------------------------|-----------|---------------------|
| GET    | `/api/redirect/:offerId`   | Optional  | Track click + redirect |
| GET    | `/api/wishlist`            | Required  | Get wishlist        |
| POST   | `/api/wishlist/:productId` | Required  | Add to wishlist     |
| DELETE | `/api/wishlist/:productId` | Required  | Remove from wishlist|
| GET    | `/api/analytics`           | Admin     | Dashboard stats     |
| GET    | `/api/health`              | None      | Health check        |

---

## 🔐 Security

- Passwords hashed with **bcrypt** (12 salt rounds)
- **JWT** authentication (Bearer token)
- Admin routes protected on **backend** (not just frontend)
- Redirect URLs validated against **merchant domain allowlist** — users cannot inject arbitrary URLs
- **Rate limiting** on auth routes (10 req / 15 min) and all API routes (200 req / 15 min)
- Request body size limited to 10kb

---

## 🌱 Seed Data

Run `npm run seed` in the `server/` directory to populate:

- **20 products** across 6 categories (Watches, Smartphones, Laptops, Headphones, Fashion, Home Appliances)
- **50+ merchant offers** from Amazon, Flipkart, Croma, Myntra, Reliance Digital, Tata CLiQ, Ajio
- **2 demo accounts** (admin + regular user)

---

## 🏛 Design Decisions

1. **`lowestPrice` is cached on Product** — avoids JOIN-equivalent queries on every listing page load. Updated automatically via Mongoose post-save hooks on MerchantOffer.

2. **Redirect uses DB URL only** — `GET /api/redirect/:offerId` reads `destinationUrl` from the database and ignores any query parameters. This prevents open redirect vulnerabilities.

3. **Click tracking is async / non-blocking** — The click is recorded with `Click.create(...).catch(...)` before the redirect, so a database failure never delays the user.

4. **Soft delete for products** — `isActive: false` instead of hard delete, preserving historical click data and wishlist references.

5. **Text indexes** — MongoDB text index on `name`, `brand`, `model`, `description` enables efficient full-text search without a separate search service.

---

## 📦 Tech Stack

| Layer      | Technology                              |
|------------|------------------------------------------|
| Frontend   | React.js, React Router, Axios            |
| Backend    | Node.js, Express.js                      |
| Database   | MongoDB Atlas + Mongoose                 |
| Auth       | JWT (jsonwebtoken) + bcryptjs            |
| Validation | express-validator                        |
| Deployment | Vercel (frontend) + Render (backend)     |
