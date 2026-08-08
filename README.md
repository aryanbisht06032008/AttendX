# 📍 AttendX — QR-Based Attendance Management System

A modern, full-stack attendance management system with **QR-code check-ins**.
Admins manage departments, programs, teachers, students and sections; teachers
start live QR attendance sessions; students scan the QR to mark their
attendance instantly.

![AttendX login screen](docs/screenshot.png)

## ✨ Features

- 🔐 **Role-based access** — separate portals for Admin, Teacher and Student
- 🎫 **QR attendance sessions** — teachers start a session, students scan to check in
- 📊 **Live attendance dashboard** — counts for departments, programs, teachers, students, sections and active sessions
- 👩‍🏫 **Manual attendance** — mark Present / Late / Absent for absentees
- 📋 **Attendance history** — students can review their records and attendance percentage
- 🔍 **Search & filter** — every admin table supports instant search
- 🎨 **Modern UI** — custom "Aurora" design system (Tailwind CSS v4), dark sidebar, animations

## 🧰 Tech Stack

| Layer      | Technology                                            |
| ---------- | ----------------------------------------------------- |
| Frontend   | React 19, Vite 8, Tailwind CSS v4, React Router 7, React Icons, html5-qrcode, react-toastify |
| Backend    | Node.js, Express 5, Prisma ORM, JWT, bcrypt, qrcode   |
| Database   | PostgreSQL                                            |

## 📁 Project Structure

```
attendX/
├── backend/                 # Express + Prisma API
│   ├── controllers/         # Route handlers
│   ├── middleware/          # Auth, role & error middleware
│   ├── prisma/
│   │   ├── schema.prisma    # Database schema
│   │   ├── migrations/      # SQL migrations
│   │   └── seed.js          # Seeds admin + demo data
│   ├── routes/              # API routes
│   ├── validations/         # Joi validation schemas
│   ├── .env                 # Environment variables (never commit!)
│   └── server.js            # Entry point (port 5000)
└── frontend/                # React + Vite SPA
    ├── src/
    │   ├── components/      # UI + layout components
    │   ├── context/         # Auth context
    │   ├── pages/           # Admin / Teacher / Student pages
    │   ├── routes/          # Router + protected routes
    │   └── services/        # API service modules
    └── index.html
```

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org) 18+ and npm
- [PostgreSQL](https://www.postgresql.org/) running locally (default port `5432`)

### 1. Clone & install

```bash
git clone https://github.com/aryanbisht06032008/AttendX.git
cd AttendX

# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 2. Configure the backend

Create `backend/.env` with the following variables:

```env
# Backend port (frontend expects this value)
PORT=5000

# PostgreSQL connection string
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/attendx"

# Secret used to sign JWTs — use a long random string
JWT_SECRET="replace-with-a-long-random-secret"

# Password for the seeded default admin account
DEFAULT_ADMIN_PASSWORD="change-me"
```

### 3. Set up the database

```bash
cd backend
npx prisma migrate deploy   # apply migrations
npx prisma db seed          # create default admin + demo data
```

### 4. Run the app

```bash
# Terminal 1 — backend API on http://localhost:5000
cd backend
npm start

# Terminal 2 — frontend on http://localhost:5173
cd frontend
npm run dev
```

Open **http://localhost:5173** in your browser.

## 🔑 Default Admin Credentials

| Field    | Value                 |
| -------- | --------------------- |
| Email    | `admin@attendx.com`   |
| Password | value of `DEFAULT_ADMIN_PASSWORD` in `backend/.env` |

> The admin password is defined by you in `backend/.env` before seeding — the
> seed script hashes it and creates the `admin@attendx.com` account. It is
> never hard-coded in the repository.

After logging in as admin you can create **Teachers** and **Students**, who
log in with the credentials you assign when creating them.

## 🧭 How It Works

1. **Admin** sets up departments → programs → semesters → subjects → sections, then adds teachers and students.
2. **Teacher** selects a subject & section and starts an **attendance session** — a QR code is generated.
3. **Student** opens the scanner, points their camera at the QR, and their attendance is recorded instantly.
4. **Teacher** can also mark attendance manually (Present / Late / Absent) and view live records.

## 🛠 Troubleshooting

- **Network error on login?** The frontend calls the API at
  `http://localhost:5000/api` (configurable via a `VITE_API_URL` variable in a
  `frontend/.env` file). Make sure the backend is running on the same port —
  `backend/server.js` loads `.env` with `override: true` so the `PORT` value in
  `backend/.env` always wins over stray OS-level `PORT` environment variables.
- **Seeding fails?** Double-check the `DATABASE_URL` and that PostgreSQL is
  running before running `npx prisma db seed`.

## 📄 License

This project is for educational/portfolio use. All rights reserved.
