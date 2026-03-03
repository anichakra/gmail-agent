# Frontend (Next.js)

This is the standalone frontend application for Gmail Agent.

## Quick Start

Run full stack without Docker (from repo root):

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env.local
make dev
```

Run full stack with Docker (from repo root):

```bash
cp backend/.env.example backend/.env
make up
```

## Stack

- Next.js 16
- React + TypeScript
- Tailwind CSS

## Prerequisites

- Node.js 18+
- npm

## Environment

Create local env file:

```bash
cp .env.example .env.local
```

Required variable:

- `NEXT_PUBLIC_API_URL` (default: `http://localhost:8000`)

## Local Development

```bash
npm install
npm run dev
```

App runs on `http://localhost:3000`.

## Run Full Stack Without Docker

From repo root, run backend + frontend together:

```bash
make dev
```

Equivalent manual commands in two terminals:

```bash
cd backend && uv run uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

```bash
cd frontend && npm run dev
```

## Production Build

```bash
npm run build
npm run start
```

## Docker

Build image:

```bash
docker build -t gmail-agent-frontend .
```

Run container:

```bash
docker run --rm -p 3000:3000 -e NEXT_PUBLIC_API_URL=http://localhost:8000 gmail-agent-frontend
```

## Run Full Stack With Docker

From repo root:

```bash
docker compose up --build
```

or:

```bash
make up
```
