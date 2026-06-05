# Meld Viewer Backend

Minimal FastAPI backend for the Meld Viewer app.

## Run locally

1. Create a virtual environment:
   ```powershell
   python -m venv .venv
   .\.venv\Scripts\Activate.ps1
   ```
2. Install dependencies:
   ```powershell
   pip install -r requirements.txt
   ```
3. Start the API server:
   ```powershell
   uvicorn app:app --reload --host 0.0.0.0 --port 8000
   ```

## Available routes

- `GET /` - health check
- `GET /health` - service status
- `POST /auth/login` - authenticate user
- `POST /auth/register` - register user
- `GET /dashboard/summary` - dashboard summary data
- `GET /dashboard/stats` - dashboard stats data
