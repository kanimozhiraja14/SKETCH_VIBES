# Sketch Vibes 23 🎨

A full-stack luxury art portfolio and custom order platform for **Sketch Vibes 23** — a premium handcrafted artwork studio.

---

## 🚀 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19 + TypeScript + Vite |
| Styling | TailwindCSS v4 + Framer Motion |
| State / Data | TanStack React Query |
| Forms | React Hook Form + Zod |
| Backend | Node.js + Express 5 |
| Database | MongoDB + Mongoose |
| Storage | Cloudinary (images) |
| Auth | JWT |

---

## 📁 Project Structure

```
website/
├── frontend/          # React + Vite frontend
│   ├── src/
│   │   ├── components/   # Reusable UI components
│   │   ├── pages/        # Route-level pages
│   │   ├── lib/          # API client helpers
│   │   └── types/        # TypeScript interfaces
│   ├── public/
│   ├── index.html
│   └── package.json
│
└── backend/           # Node.js + Express API
    ├── src/
    │   ├── config/       # DB, Cloudinary config
    │   ├── controllers/  # Route controllers
    │   ├── models/       # Mongoose models
    │   ├── routes/       # Express routers
    │   └── middleware/   # Auth, error handlers
    ├── server.js
    └── package.json
```

---

## ⚙️ Local Development Setup

### Prerequisites
- Node.js v18+
- MongoDB (local or Atlas)
- Cloudinary account

### 1. Clone the repo

```bash
git clone https://github.com/kanimozhiraja14/SKETCH_VIBES23.git
cd SKETCH_VIBES23
```

### 2. Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# Fill in your values in .env
npm run dev
```

### 3. Frontend Setup

```bash
cd frontend
npm install
cp .env.example .env
# Set VITE_API_URL=http://localhost:5000/api
npm run dev
```

---

## 🌐 Environment Variables

### Backend (`backend/.env`)

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/sketchvibes23
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRE=30d
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
FRONTEND_URL=http://localhost:5173
```

### Frontend (`frontend/.env`)

```env
VITE_API_URL=http://localhost:5000/api
```

---

## 🚢 Deployment on Render

### Backend Web Service
- **Build command:** `npm install`
- **Start command:** `node server.js`
- **Environment:** Add all variables from `.env.example`

### Frontend Static Site
- **Build command:** `npm install && npm run build`
- **Publish directory:** `dist`
- **Environment:** `VITE_API_URL=https://your-backend.onrender.com/api`

---

## 📌 Features

- 🎨 **Gallery** — Browse complete handcrafted art collection with category filters & lightbox
- 🛒 **Custom Order** — 5-step multi-step order wizard with file upload
- 🖼️ **Frames** — Premium photo frame catalogue with size/style filters
- 💼 **Services** — Full service listing with pricing and delivery estimates
- 📞 **Contact** — Direct WhatsApp, Instagram, Email contact
- 🔐 **Admin Panel** — Protected dashboard for order and gallery management

---

## 📄 License

Private — All artwork and designs © Sketch Vibes 23. All rights reserved.
