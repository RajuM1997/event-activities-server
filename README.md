# JoinUp – Server (Backend API)

## 🌐 Live API URL

[https://api.joinup.com/api/v1](https://api.joinup.com/api/v1)

## 📌 Project Overview

This repository contains the **backend REST API** for **JoinUp**, an event management and booking platform. It handles authentication, event management, bookings, reviews, and role-based access control.

---

## ✨ Features

### 🔐 Authentication & Authorization

- JWT-based authentication
- Role-based access (USER, HOST, ADMIN)
- Secure middleware protection

### 📅 Event Management

- Create, update, delete events
- Join/Book events
- Capacity & status validation

### ⭐ Review System

- Add reviews after booking
- One review per user per event
- Average rating calculation

### 📊 Dashboard Analytics

- Monthly user count
- Total hosts & events
- Total bookings

### 🧱 Error Handling

- Global error handler
- Prisma error mapping (P2002, P2003, etc.)
- Meaningful API responses

---

## 🧰 Technology Stack

### Backend

- **Node.js**
- **Express.js**
- **TypeScript**
- **Prisma ORM**
- **PostgreSQL**

### Utilities

- **Zod** – Request validation
- **JWT** – Authentication
- **bcrypt** – Password hashing
- **dotenv** – Environment config

---

## ⚙️ Setup & Installation

### 1️⃣ Clone Repository

```bash
git clone https://github.com/RajuM1997/event-activities-server.git
cd joinup-server
```

### 2️⃣ Install Dependencies

```bash
npm install
```

### 3️⃣ Environment Variables

Create a `.env` file:

```env
PORT=8800
DATABASE_URL=postgresql://user:password@localhost:5432/joinup
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d
```

---

## 🗄️ Database Setup

### Prisma Generate

```bash
npx prisma generate
```

### Prisma Migrate

```bash
npx prisma migrate dev
```

### Prisma Studio (Optional)

```bash
npx prisma studio
```

---

## ▶️ Run Server

### Development

```bash
npm run dev
```

### Production

```bash
npm run build
npm start
```

Server will run at: `http://localhost:8800`

---

## 📂 Project Structure

```txt
backend/
├── prisma/
│   ├── schema.prisma
│   └── migrations/
│
├── src/
│   ├── app/
│   │   ├── errors/
│   │   │   ├── ApiError.ts
│   │   │   └── handleValidationError.ts
│   │   │
│   │   ├── interface/
│   │   │   └── index.ts
│   │   │
│   │   ├── middleware/
│   │   │   ├── auth.ts
│   │   │   ├── validateRequest.ts
│   │   │   └── globalErrorHandler.ts
│   │   │
│   │   ├── modules/
│   │   │   ├── auth/
│   │   │   ├── user/
│   │   │   ├── event/
│   │   │   ├── booking/
│   │   │   ├── review/
│   │   │   └── host/
│   │   │
│   │   └── routes/
│   │       └── index.ts
│   │
│   ├── config/
│   │   ├── env.ts
│   │   └── index.ts
│   │
│   ├── helpers/
│   │   ├── paginationHelper.ts
│   │   └── jwtHelper.ts
│   │
│   ├── types/
│   │   └── common.ts
│   │
│   ├── utils/
│   │   ├── catchAsync.ts
│   │   ├── pick.ts
│   │   └── sendResponse.ts
│   │
│   ├── app.ts
│   └── server.ts
│
├── .env
├── package.json
└── tsconfig.json

```

---

## 🧪 API Validation

- Zod schemas for request validation
- Centralized validation middleware

---

## 🚀 Deployment

- Deployed on VPS / Railway / Render
- PostgreSQL hosted on cloud

---

## 📞 Support

For issues or feature requests, please open an issue or contact the maintainer.

---

© 2026 JoinUp API. All rights reserved.
