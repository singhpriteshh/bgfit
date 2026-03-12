#BGFIT – Fit. Style. Performance.

**BGFIT** is a modern, full-stack e-commerce platform for premium streetwear and fitness clothing. Built with a **React + TypeScript** frontend and a **FastAPI + PostgreSQL** backend, fully containerized with **Docker Compose**.

🌐 **Live:** [https://bgfit.in](https://bgfit.in)

---

## ✨ Features

- **Product Catalog** – Browse men's, women's, and unisex collections with filtering by category, price range, and color
- **Shopping Cart & Checkout** – Seamless cart experience with Razorpay payment integration
- **User Accounts** – Registration, login, profile management, and profile photo upload
- **Admin Dashboard** – Product management, order tracking, and site settings
- **Real-time Notifications** – WebSocket-based live updates
- **SEO Optimized** – Per-page meta tags, Open Graph, Twitter Cards, `robots.txt`, and `sitemap.xml`
- **Responsive Design** – Mobile-first layout with modern UI (Tailwind CSS)
- **Lazy Loading** – Code-split pages with React Suspense for fast initial loads

---

## 🛠️ Tech Stack

| Layer      | Technology                                             |
| ---------- | ------------------------------------------------------ |
| Frontend   | React 19, TypeScript, Vite, Tailwind CSS 4, Redux Toolkit |
| Backend    | FastAPI, SQLAlchemy, Alembic, Pydantic                 |
| Database   | PostgreSQL 15                                          |
| Payments   | Razorpay                                               |
| Storage    | Cloudinary (product images, profile photos)            |
| Infra      | Docker, Docker Compose, Nginx                          |

---

## 📁 Project Structure

```
bigfit/
├── frontend/                  # React + Vite application
│   ├── public/                # Static assets (logos, images, robots.txt, sitemap.xml)
│   ├── src/
│   │   ├── api/               # Axios API client
│   │   ├── assets/            # Static imports
│   │   ├── components/        # Shared components (Navbar, Footer, SEO, etc.)
│   │   ├── features/          # Feature modules (auth, cart, checkout, shop)
│   │   ├── layout/            # Layout wrappers (MainLayout, AdminLayout)
│   │   ├── pages/             # Page components (Home, Shop, About, etc.)
│   │   ├── store/             # Redux store, slices, hooks
│   │   ├── types/             # TypeScript type definitions
│   │   ├── App.tsx            # Route definitions
│   │   └── main.tsx           # Entry point
│   ├── index.html             # HTML template with SEO meta tags
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.ts
├── backend/                   # FastAPI application
│   ├── app/                   # Application source code
│   ├── alembic/               # Database migrations
│   ├── requirements.txt
│   └── Dockerfile
├── docker-compose.yml         # Full-stack orchestration
└── .env                       # Environment variables (not committed)
```

---

## 🚀 Getting Started

### Prerequisites

- **Docker** & **Docker Compose** (recommended)
- Or: **Node.js ≥ 18** and **Python ≥ 3.11** for local development

### Quick Start with Docker Compose

```bash
# 1. Clone the repository
git clone https://github.com/singhpriteshh/bgfit.git
cd bigfit

# 2. Create your .env file (see Environment Variables below)
cp .env.example .env

# 3. Build and start all services
docker-compose up --build
```

The app will be available at:
- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:8000
- **PostgreSQL:** localhost:5432

### Local Development (without Docker)

#### Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
alembic upgrade head
uvicorn app.main:app --reload --port 8000
```

#### Frontend

```bash
cd frontend
npm install
npm run dev
```

---

## 🔐 Environment Variables

Create a `.env` file in the project root with:

```env
# Database
POSTGRES_USER=your_db_user
POSTGRES_PASSWORD=your_db_password
POSTGRES_DB=your_db_name

# Razorpay
RAZORPAY_KEY_ID=your_razorpay_key
RAZORPAY_KEY_SECRET=your_razorpay_secret

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_SECRET_KEY=your_secret_key
```

---

## 📦 Available Scripts

| Script              | Description                      |
| ------------------- | -------------------------------- |
| `npm run dev`       | Start Vite dev server            |
| `npm run build`     | TypeScript check + production build |
| `npm run preview`   | Preview production build         |
| `npm run lint`      | Run ESLint                       |

---

## 📄 License

This project is proprietary. All rights reserved by **BgFit.in**.
