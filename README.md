# FinanceDash — Professional Finance Management Dashboard

A full-stack finance management dashboard built with Next.js, Express.js, and PostgreSQL. Features real-time financial tracking, analytics, user management, and role-based access control.

---

## Live Demo

| Service | URL |
|---|---|
| Frontend | https://finance-dash-lyart.vercel.app |
| Backend API | https://financedash-yfl6.onrender.com |
| API Health | https://financedash-yfl6.onrender.com/api/health |
| API Docs | https://financedash-yfl6.onrender.com/api/docs |

### Demo Credentials

| Role | Email | Password | Access |
|---|---|---|---|
| Admin | admin@financedash.com | password123 | Full Access |
| Analyst | analyst@financedash.com | password123 | Read + Write |
| Viewer | viewer@financedash.com | password123 | Read Only |

---

## Tech Stack

### Frontend

| Technology | Version | Purpose |
|---|---|---|
| Next.js | 15.2.4 | React framework |
| TypeScript | 5.7.x | Type safety |
| Tailwind CSS | 3.4.x | Styling |
| Framer Motion | 11.x | Animations |
| Chart.js | 4.4.x | Charts |
| Axios | 1.7.x | HTTP client |
| Zustand | 5.0.x | State management |
| React Hook Form | 7.x | Form handling |
| React Hot Toast | 2.4.x | Notifications |

### Backend

| Technology | Version | Purpose |
|---|---|---|
| Node.js | 20.x | Runtime |
| Express.js | 4.18.x | Web framework |
| TypeScript | 5.3.x | Type safety |
| PostgreSQL | 14+ | Database |
| node-postgres | 8.11.x | DB client |
| JWT | 9.0.x | Authentication |
| bcryptjs | 3.0.x | Password hashing |
| Winston | 3.11.x | Logging |
| Swagger UI | 5.0.x | API documentation |
| Helmet | 7.x | Security headers |

### Infrastructure

| Service | Purpose |
|---|---|
| Vercel | Frontend hosting |
| Render | Backend hosting |
| Supabase | PostgreSQL database |
| GitHub | Version control |

---

## Features

### Core Features

- JWT-based authentication with refresh handling
- Role-based access control — Admin, Analyst, Viewer
- Real-time financial dashboard with animated stats
- Monthly and weekly trend charts
- Category spending breakdown with donut chart
- Full transaction CRUD with filters, search, and pagination
- User management with role assignment — Admin only
- Detailed analytics page — Analyst and Admin only
- Notification center with unread indicators
- Collapsible sidebar navigation
- Settings — profile, security, appearance

### Security

- JWT token authentication
- Password hashing with bcryptjs
- Rate limiting on all API routes
- Stricter rate limiting on auth routes
- CORS protection
- Helmet security headers
- Soft deletes for data safety

### UI/UX

- Forest dark theme with sand accents
- Smooth animations with Framer Motion
- Shimmer loading skeletons
- Responsive layout for all screen sizes
- Real-time count-up animations on stats
- Toast notifications for all actions

---

## Roles and Permissions

| Feature | Viewer | Analyst | Admin |
|---|---|---|---|
| View Dashboard | ✅ | ✅ | ✅ |
| View Transactions | ✅ | ✅ | ✅ |
| Create Transactions | ❌ | ✅ | ✅ |
| Edit Transactions | ❌ | ✅ | ✅ |
| Delete Transactions | ❌ | ✅ | ✅ |
| View Analytics | ❌ | ✅ | ✅ |
| View Users | ❌ | ❌ | ✅ |
| Create Users | ❌ | ❌ | ✅ |
| Edit Users | ❌ | ❌ | ✅ |
| Delete Users | ❌ | ❌ | ✅ |
| Settings | ✅ | ✅ | ✅ |

---

## Project Structure
```
Finance-Dashboard-Analysis/
├── README.md
├── .gitignore
├── FinanceDash.postman_collection.json
│
├── frontend/
│ ├── next.config.js
│ ├── tailwind.config.js
│ ├── postcss.config.js
│ ├── tsconfig.json
│ ├── package.json
│ ├── .env.example
│ └── src/
│ ├── components/
│ │ ├── dashboard/
│ │ │ ├── StatsCard.tsx
│ │ │ ├── TransactionChart.tsx
│ │ │ ├── CategoryChart.tsx
│ │ │ └── RecentTransactions.tsx
│ │ ├── layout/
│ │ │ ├── Layout.tsx
│ │ │ ├── Header.tsx
│ │ │ └── Sidebar.tsx
│ │ ├── transactions/
│ │ │ ├── TransactionTable.tsx
│ │ │ ├── TransactionForm.tsx
│ │ │ └── TransactionFilters.tsx
│ │ ├── users/
│ │ │ ├── UserTable.tsx
│ │ │ └── UserForm.tsx
│ │ └── ui/
│ │ ├── Badge.tsx
│ │ ├── Button.tsx
│ │ ├── Input.tsx
│ │ ├── Modal.tsx
│ │ └── LoadingSpinner.tsx
│ ├── contexts/
│ │ ├── AuthContext.tsx
│ │ └── ToastContext.tsx
│ ├── hooks/
│ │ ├── useAuth.ts
│ │ ├── useDashboard.ts
│ │ └── useTransactions.ts
│ ├── pages/
│ │ ├── _app.tsx
│ │ ├── _document.tsx
│ │ ├── index.tsx
│ │ ├── login.tsx
│ │ ├── dashboard.tsx
│ │ ├── transactions.tsx
│ │ ├── analytics.tsx
│ │ ├── users.tsx
│ │ └── settings.tsx
│ ├── services/
│ │ └── api.ts
│ ├── styles/
│ │ └── globals.css
│ ├── types/
│ │ └── index.ts
│ └── utils/
│ └── warmup.ts
│
└── backend/
├── tsconfig.json
├── package.json
├── .env.example
├── nixpacks.toml
└── src/
├── config/
│ ├── database.ts
│ └── swagger.ts
├── controllers/
│ ├── authController.ts
│ ├── dashboardController.ts
│ ├── transactionController.ts
│ └── userController.ts
├── middleware/
│ ├── auth.ts
│ └── errorHandler.ts
├── models/
│ ├── User.ts
│ └── Transaction.ts
├── routes/
│ ├── authRoutes.ts
│ ├── dashboardRoutes.ts
│ ├── transactionRoutes.ts
│ └── userRoutes.ts
├── scripts/
│ ├── runMigration.ts
│ └── seedDatabase.ts
├── services/
│ ├── authService.ts
│ ├── transactionService.ts
│ └── userService.ts
├── types/
│ └── index.ts
├── utils/
│ ├── logger.ts
│ └── pagination.ts
└── app.ts
```

---

## Quick Start

```bash
git clone https://github.com/Electron910/FinanceDash.git
cd FinanceDash

# Backend
cd backend
cp .env.example .env
# Edit .env with your database credentials
npm install
npm run migrate
npm run seed
npm run dev

# Frontend — open a new terminal
cd frontend
cp .env.example .env.local
npm install
npm run dev
```

Open http://localhost:3000 and login with admin@financedash.com / password123

API docs available at http://localhost:5000/api/docs

## Getting Started
# Prerequisites
- Node.js 18+
- PostgreSQL 14+
- npm

## 1. Clone the Repository
```
git clone https://github.com/Electron910/FinanceDash.git
cd FinanceDash
```
## 2. Backend Setup
```
cd backend
npm install
```
Create .env in the backend folder:
```
DATABASE_URL=postgresql://postgres:yourpassword@localhost:5432/financedash
JWT_SECRET=your_minimum_32_character_secret_key_here
JWT_EXPIRES_IN=7d
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
LOG_LEVEL=debug
```
Run migration and seed:
```
npm run migrate
npm run seed
```
# Start the backend:
```
npm run dev
```
Backend runs on http://localhost:5000

## 3. Frontend Setup
```
cd frontend
npm install
```
Create .env.local in the frontend folder:
```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```
Start the frontend:
```
npm run dev
```
Frontend runs on http://localhost:3000

## API Reference
# Base URL: https://financedash-yfl6.onrender.com/api

All protected routes require:
```
Authorization: Bearer <token>
```
# 📊 API Documentation

## 🔐 Auth Endpoints

| Method | Endpoint        | Description                     | Auth Required |
|--------|---------------|---------------------------------|---------------|
| POST   | /auth/login   | Login with email and password   | No            |
| GET    | /auth/me      | Get current authenticated user  | Yes           |
| POST   | /auth/logout  | Logout current session          | Yes           |
| POST   | /auth/register| Register new user               | No            |

---

## 📈 Dashboard Endpoints

| Method | Endpoint                         | Description                     | Auth Required |
|--------|----------------------------------|---------------------------------|---------------|
| GET    | /dashboard                      | Get full dashboard data         | Yes           |
| GET    | /dashboard/summary              | Get financial summary           | Yes           |
| GET    | /dashboard/trends/monthly       | Monthly income vs expenses      | Yes           |
| GET    | /dashboard/trends/weekly        | Weekly income vs expenses       | Yes           |
| GET    | /dashboard/categories           | Category totals                 | Yes           |
| GET    | /dashboard/recent              | Recent transactions             | Yes           |

---

## 💳 Transaction Endpoints

| Method | Endpoint               | Description                 | Auth Required |
|--------|----------------------|-----------------------------|---------------|
| GET    | /transactions        | Get all transactions        | Yes           |
| GET    | /transactions/:id    | Get transaction by ID       | Yes           |
| POST   | /transactions        | Create transaction          | Yes           |
| PUT    | /transactions/:id    | Update transaction          | Yes           |
| DELETE | /transactions/:id    | Soft delete transaction     | Yes           |

---

## 🔍 Query Parameters for GET /transactions

| Parameter   | Type   | Description                         | Example        |
|------------|--------|-------------------------------------|---------------|
| page       | number | Page number                         | 1             |
| limit      | number | Results per page                    | 15            |
| type       | string | Filter by type                      | income / expense |
| category   | string | Filter by category                  | Salary        |
| search     | string | Search notes and description        | grocery       |
| startDate  | string | Filter from date                    | 2026-01-01    |
| endDate    | string | Filter to date                      | 2026-04-04    |
| minAmount  | number | Minimum amount                      | 100           |
| maxAmount  | number | Maximum amount                      | 5000          |

---

## ⚙️ Environment Variables

### 🖥️ Backend

| Variable        | Description                             | Example                                      |
|----------------|-----------------------------------------|----------------------------------------------|
| DATABASE_URL   | PostgreSQL connection string            | postgresql://user:pass@host:5432/db          |
| JWT_SECRET     | JWT signing secret (min 32 chars)       | supersecretkey12345678901234567890           |
| JWT_EXPIRES_IN | Token expiry duration                   | 7d                                           |
| PORT           | Server port                             | 5000                                         |
| NODE_ENV       | Environment                             | development / production                     |
| FRONTEND_URL   | Allowed frontend origin for CORS        | http://localhost:3000                        |
| LOG_LEVEL      | Winston log level                       | debug / info                                 |

---

### 🌐 Frontend

| Variable             | Description              | Example                     |
|----------------------|--------------------------|-----------------------------|
| NEXT_PUBLIC_API_URL  | Backend API base URL     | http://localhost:5000/api   |

---
## 🛠️ Scripts

### 🖥️ Backend

| Script           | Description                              |
|------------------|------------------------------------------|
| npm run dev      | Start dev server with hot reload         |
| npm run build    | Compile TypeScript to JavaScript         |
| npm run start    | Start production server                  |
| npm run migrate  | Run database migrations                  |
| npm run seed     | Seed database with sample data           |

---

### 🌐 Frontend

| Script        | Description                     |
|---------------|---------------------------------|
| npm run dev   | Start development server        |
| npm run build | Build for production            |
| npm run start | Start production server         |
| npm run lint  | Run ESLint                      |

---

## 🚀 Deployment

### ☁️ Vercel + Render + Supabase

| Service   | Platform  | Purpose                |
|-----------|----------|------------------------|
| Frontend  | Vercel   | Next.js hosting        |
| Backend   | Render   | Express API hosting    |
| Database  | Supabase | PostgreSQL database    |

**Total Cost:** Free

---

## 📦 Deploy Steps

1. Push code to GitHub  
2. Create PostgreSQL project on Supabase  
3. Run migration SQL in Supabase SQL Editor  
4. Deploy backend on Render — set root directory to `backend`  
5. Add all environment variables on Render  
6. Deploy frontend on Vercel — set root directory to `frontend`  
7. Set `NEXT_PUBLIC_API_URL` on Vercel pointing to your Render URL  
8. Set `FRONTEND_URL` on Render pointing to your Vercel URL  
9. Seed database via Supabase SQL Editor  

---
## 🚀 Deployment

### ☁️ Vercel + Render + Supabase

| Service   | Platform  | Purpose                |
|-----------|----------|------------------------|
| Frontend  | Vercel   | Next.js hosting        |
| Backend   | Render   | Express API hosting    |
| Database  | Supabase | PostgreSQL database    |

**Total Cost:** Free

---

## 📦 Deploy Steps

1. Push code to GitHub  
2. Create PostgreSQL project on Supabase  
3. Run migration SQL in Supabase SQL Editor  
4. Deploy backend on Render — set root directory to `backend`  
5. Add all environment variables on Render  
6. Deploy frontend on Vercel — set root directory to `frontend`  
7. Set `NEXT_PUBLIC_API_URL` on Vercel pointing to your Render URL  
8. Set `FRONTEND_URL` on Render pointing to your Vercel URL  
9. Seed database via Supabase SQL Editor  

---

## Render Environment Variables
```
DATABASE_URL  = postgresql://postgres.PROJECT:PASSWORD@aws-0-REGION.pooler.supabase.com:5432/postgres
JWT_SECRET    = your_minimum_32_character_secret_key_here
JWT_EXPIRES_IN = 7d
PORT          = 10000
NODE_ENV      = production
FRONTEND_URL  = https://your-app.vercel.app
LOG_LEVEL     = info
```
## API Health Check
```
curl https://financedash-yfl6.onrender.com/api/health
```
Expected response:
```
{
  "success": true,
  "message": "FinanceDash API is running",
  "timestamp": "2026-04-05T10:00:00.000Z",
  "version": "1.0.0",
  "environment": "production"
}
```

## Acknowledgements
- Next.js — React framework
- Tailwind CSS — Utility-first CSS
- Chart.js — Charts and data visualization
- Framer Motion — Animations
- Express.js — Node.js web framework
- PostgreSQL — Relational database
- Supabase — Hosted PostgreSQL
- Vercel — Frontend hosting
- Render — Backend hosting
