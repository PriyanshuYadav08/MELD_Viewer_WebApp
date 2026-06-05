# MELD Viewer Web App

Minimal full-stack webapp for running a NeuroImage MELD pipeline gateway and lightweight viewer. This repository contains a FastAPI backend that accepts neuroimaging uploads and a React + TypeScript frontend (Vite) that provides authentication, upload and visualization of generated assets.

## Contents

- Backend API and processing utilities: [backend/](backend)
- Frontend React application: [frontend/](frontend)
- Sample upload assets: [backend/uploads/](backend/uploads)

## Features

- Authentication (token-based) with a demo user for development.
- Upload endpoint for DICOM / NIfTI / image files that queues processing.
- Simulated MELD processing pipeline (placeholder sleeps and mock outputs).
- Dashboard to view uploaded scans and inspect generated 2D/3D/4D assets in the viewer.

## Quickstart — Backend

1. Create and activate a virtual environment, install dependencies:

```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

2. Start the API server (development):

```powershell
# from backend/ directory
uvicorn main:app --reload --host 0.0.0.0 --port 8000
# or
python main.py
```

3. See backend README for routes and details: [backend/README.md](backend/README.md)

Notes:
- The backend stores data in an in-memory mock DB ([backend/database.py](backend/database.py)) and uses a simulated pipeline ([backend/processing.py](backend/processing.py)).
- Conversion utilities are available in [backend/converter.py](backend/converter.py) and call out to `dcm2niix` / `bidscoin` when adapted for production.

## Quickstart — Frontend

1. Install and run the frontend (requires Node.js + npm/yarn):

```bash
cd frontend
npm install
npm run dev
```

2. Open the app (Vite dev server) typically at `http://localhost:5173`.

Frontend source is in [frontend/src](frontend/src) and the main app is [frontend/src/App.tsx](frontend/src/App.tsx).

## Demo credentials (development)

- Email: `doctor@hospital.com`
- Password: `password123`

These are seeded in [backend/database.py](backend/database.py) for local testing. The login form posts to `POST /token` (OAuth2 password flow) and the frontend stores the returned bearer token in localStorage.

## Typical developer workflow

- Start the backend (see above).
- Start the frontend dev server.
- Login in the frontend using the demo credentials.
- Use the Dashboard to upload a DICOM/NIfTI/image file. The backend will create a scan record and run a simulated processing background task; poll status via `GET /scans`.
- When status becomes `Completed`, click "Inspect Analytics Workspace" to view generated mock images.

## Important implementation notes

- Authentication: simple JWT-based helper in [backend/auth.py](backend/auth.py). For production, rotate `SECRET_KEY`, strengthen password hashing and integrate a persistent user store.
- Processing: currently simulated (see [backend/processing.py](backend/processing.py)); intended hooks for `dcm2niix` and MELD script calls are included as comments and in [backend/converter.py](backend/converter.py).
- Persistence: in-memory dicts in [backend/database.py](backend/database.py). Replace with a database (Postgres, SQLite, etc.) for real deployments.

## Project structure (top-level)

- [backend/](backend) — FastAPI app and utilities (see [backend/README.md](backend/README.md)).
- [frontend/](frontend) — React + TypeScript UI powered by Vite.
- [package.json](package.json) — top level artifact (not the frontend app); use the `frontend/package.json` for frontend scripts.

## Where to look next

- Authentication flow: [backend/main.py](backend/main.py) and [backend/auth.py](backend/auth.py).
- Upload & background processing: [backend/main.py](backend/main.py) and [backend/processing.py](backend/processing.py).
- Frontend pages/components: [frontend/src/components/Dashboard.tsx](frontend/src/components/Dashboard.tsx), [frontend/src/components/Viewer.tsx](frontend/src/components/Viewer.tsx), [frontend/src/components/Login.tsx](frontend/src/components/Login.tsx).

If you'd like, I can: run the backend and frontend locally, add Dockerfiles for both services, or expand the README with deployment notes and environment variable guidance — which would you prefer next?