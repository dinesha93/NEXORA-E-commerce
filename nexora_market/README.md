# Nexora Market — Full Stack E-commerce

A modern, unique e-commerce starter built for VS Code.

## Stack
- Frontend: React + Vite
- Backend: Node.js + Express
- Database: MongoDB-ready with Mongoose
- Authentication: JWT-ready API
- Product catalog, search, filters, cart, checkout/order API
- Amazon / Flipkart integration layer: external product/affiliate links are supported without scraping either marketplace.

## Run in VS Code

### 1. Backend
```bash
cd backend
npm install
copy .env.example .env
npm run dev
```

### 2. Frontend
Open another terminal:
```bash
cd frontend
npm install
npm run dev
```

Frontend: http://localhost:5173
Backend: http://localhost:5000

### Demo mode
The frontend works with demo products even before MongoDB is connected.

### Amazon / Flipkart
Do not scrape or clone marketplace pages. Put approved Amazon Associates / Flipkart affiliate URLs in product records or configure an approved API/feed in the backend integration layer. The buttons open the marketplace listing in a new tab.
