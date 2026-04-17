# AmalGus — Glass Marketplace

## World's First B2B2C Glass & Allied Products Niche Marketplace

### Quick Start

```bash
# 1. Set up backend .env
cd backend
cp .env.example .env   # Add your MongoDB URI

# 2. Seed the database (40+ products, vendors, rates, partners)
npm run seed

# 3. Run both servers
cd ..
npm run dev
```

### Access
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000/api

### Demo Credentials
| Role | Email | Password |
|------|-------|----------|
| Homeowner | homeowner@demo.com | demo1234 |
| Architect | architect@demo.com | demo1234 |
| Builder | builder@demo.com | demo1234 |

### Features
- **Glass Product Catalog** — 15+ glass types with filters
- **AI Glass Finder** — Rule-based NLP matching
- **Daily Rate Ticker** — Live price display with 7-day chart
- **Multi-Vendor Comparison** — Side-by-side pricing
- **Estimate Generator** — mm-to-sqft conversion with GST
- **Service Partners** — Installers filterable by city
- **JWT Auth** — Register/login with role selection
- **Order History** — Past orders with status tracking

### Tech Stack
- **Frontend**: React 18 + Vite + React Router
- **Backend**: Node.js + Express
- **Database**: MongoDB + Mongoose
- **Charts**: Recharts
- **Auth**: JWT + bcrypt
