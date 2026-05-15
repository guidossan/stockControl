# StockFlow

StockFlow is an MVP multi-tenant inventory management SaaS built with Next.js 16, React 19 and TypeScript.

## Stack

- Next.js 16 App Router
- React 19 + TypeScript (strict)
- TailwindCSS + shadcn/ui styled components
- MongoDB Atlas + Mongoose
- Zod + React Hook Form
- Sonner (toasts)
- Recharts (analytics chart)
- Nuqs (search query state)
- Biome (lint/format support)

## Setup

1. Copy environment file:

```bash
cp .env.example .env.local
```

2. Install dependencies and run app:

```bash
npm ci
npm run dev
```

3. Open `http://localhost:3000`.

## Multi-tenant model

All core entities include `workspaceId`:

- User
- Product
- Category
- Movement

Stock is derived from movement history (`IN` / `OUT`) and is never directly edited.

## Main routes

- `/login`, `/register`
- `/dashboard`
- `/products`
- `/categories`
- `/movements`

## Scripts

- `npm run dev`
- `npm run build`
- `npm run lint`
- `npm run lint:biome`
- `npm run format:biome`
