# Military Asset Management System

A full-stack foundation for a future military asset management application. This initial setup contains a React frontend and an Express API with a health-check endpoint only.

## Tech stack

- Frontend: React, Vite, TypeScript, Tailwind CSS, React Router, Axios, Lucide React
- Backend: Node.js, Express, TypeScript, CORS, Helmet, dotenv, Prisma ORM, PostgreSQL

## Environment setup

Copy each example file to `.env` and update placeholder values as needed:

```powershell
Copy-Item frontend/.env.example frontend/.env
Copy-Item backend/.env.example backend/.env
```

`PORT`, `DATABASE_URL`, and `FRONTEND_URL` are required configuration placeholders. `DATABASE_URL` must point to a PostgreSQL database.

## Frontend setup and run

```powershell
cd frontend
npm install
npm run dev
```

The Vite development server is available at `http://localhost:5173` by default.

## Backend setup and run

```powershell
cd backend
npm install
npm run dev
```

The API listens on `http://localhost:5000` by default.

## PostgreSQL and Prisma setup

PostgreSQL is required to run the backend health check successfully. Create an empty database with PostgreSQL, for example:

```sql
CREATE DATABASE military_asset_management;
```

Set `DATABASE_URL` in `backend/.env` using a PostgreSQL connection string:

```env
DATABASE_URL=postgresql://POSTGRES_USER:POSTGRES_PASSWORD@localhost:5432/military_asset_management?schema=public
```

From `backend/`, validate the Prisma schema and generate the Prisma client:

```powershell
npm run prisma:validate
npm run prisma:generate
```

When application models are introduced and PostgreSQL is available, create and apply a development migration with:

```powershell
npm run prisma:migrate -- --name describe-your-change
```

The current schema intentionally has no application models, so no migration is needed yet.

## Health check

```text
GET /api/health
```

Example: `http://localhost:5000/api/health`

```json
{
  "success": true,
  "message": "Military Asset Management API is running",
  "database": "connected"
}
```

If PostgreSQL is unavailable or `DATABASE_URL` is invalid, the endpoint returns HTTP `503` with `database: "disconnected"`.
