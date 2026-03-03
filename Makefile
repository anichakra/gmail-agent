.PHONY: build up down logs dev frontend-dev backend-dev

build:
	docker compose build

up:
	docker compose up --build

down:
	docker compose down

logs:
	docker compose logs -f

frontend-dev:
	cd frontend && npm run dev

backend-dev:
	cd backend && uv run uvicorn main:app --reload --host 0.0.0.0 --port 8000

dev:
	@trap 'kill 0' EXIT; \
	(cd backend && uv run uvicorn main:app --reload --host 0.0.0.0 --port 8000) & \
	(cd frontend && npm run dev) & \
	wait
