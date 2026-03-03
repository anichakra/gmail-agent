# Gmail Agent Monorepo

This repository is split into two independent sub-projects:

- `frontend/`: Next.js UI
- `backend/`: FastAPI + Composio + LangGraph API

Each project can be developed, built, and deployed independently. From the repo root, you can still build and run both together with Docker Compose or Make commands.

## Purpose

Gmail Agent is an AI-powered assistant for Gmail that lets users authenticate their inbox and manage email through natural language.  
The project provides:

- a web interface to chat with an email assistant
- a backend API that connects to Gmail via Composio tools
- end-to-end support for common inbox tasks like search, summarization, drafting, and replies

## Quick Start

Without Docker:

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env.local
make dev
```

With Docker:

```bash
cp backend/.env.example backend/.env
make up
```

## Repository Layout

```text
gmail-agent/
├── frontend/
│   ├── Dockerfile
│   └── README.md
├── backend/
│   ├── Dockerfile
│   └── README.md
├── docker-compose.yml
├── Makefile
└── README.md
```

## One-Command Build + Run (Root)

Prerequisites:

- Docker + Docker Compose
- `backend/.env` present (copy from `backend/.env.example`)

Run both services:

```bash
make up
```

or directly:

```bash
docker compose up --build
```

Endpoints:

- Frontend: `http://localhost:3000`
- Backend: `http://localhost:8000`
- Backend docs: `http://localhost:8000/docs`

## Run Without Docker (Both Services)

Prerequisites:

- Node.js 18+ and npm
- Python 3.12+ and `uv`
- `backend/.env` configured

Setup:

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env.local
cd frontend && npm install && cd ..
cd backend && uv sync && cd ..
```

Run both together from root:

```bash
make dev
```

Or run separately in two terminals:

```bash
cd backend && uv run uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

```bash
cd frontend && npm run dev
```

## Run With Docker (Both Services)

Prerequisites:

- Docker + Docker Compose
- `backend/.env` configured

Run:

```bash
make up
```

or:

```bash
docker compose up --build
```

Stop:

```bash
make down
```

## Root Commands

```bash
make build   # build both images
make up      # build and start both containers
make down    # stop containers
make logs    # tail logs
make dev     # run backend + frontend locally without Docker
```

## Environment Setup

1. Backend:

```bash
cp backend/.env.example backend/.env
```

2. Frontend (optional for local dev override):

```bash
cp frontend/.env.example frontend/.env.local
```

## Independence Guarantees

- Frontend dependency graph, scripts, and Docker image are isolated in `frontend/`.
- Backend dependency graph, env, scripts, and Docker image are isolated in `backend/`.
- Root only orchestrates both apps; it does not host app-specific runtime code.
