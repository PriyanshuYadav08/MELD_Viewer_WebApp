from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import List

from schemas import AuthResponse, DashboardStats, DashboardSummary, LoginRequest, RegisterRequest

app = FastAPI(
    title="Meld Viewer API",
    description="Minimal backend for Meld Viewer auth and dashboard endpoints.",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

_demo_users = [
    {"email": "demo@meldviewer.app", "password": "demo123", "full_name": "Demo User"}
]


@app.get("/", tags=["health"])
def root() -> dict:
    return {"message": "Meld Viewer API is running"}


@app.get("/health", tags=["health"])
def health() -> dict:
    return {"status": "ok"}


@app.post("/auth/login", response_model=AuthResponse, tags=["auth"])
def login(payload: LoginRequest) -> AuthResponse:
    user = next(
        (u for u in _demo_users if u["email"] == payload.email and u["password"] == payload.password),
        None,
    )
    if not user:
        raise HTTPException(status_code=401, detail="Invalid email or password")

    return AuthResponse(
        access_token="demo-access-token",
        user_email=user["email"],
        message="Login successful",
    )


@app.post("/auth/register", response_model=AuthResponse, tags=["auth"])
def register(payload: RegisterRequest) -> AuthResponse:
    if any(u["email"] == payload.email for u in _demo_users):
        raise HTTPException(status_code=400, detail="Email already exists")

    _demo_users.append(
        {"email": payload.email, "password": payload.password, "full_name": payload.full_name or "New User"}
    )

    return AuthResponse(
        access_token="demo-access-token",
        user_email=payload.email,
        message="Registration successful",
    )


@app.get("/dashboard/summary", response_model=DashboardSummary, tags=["dashboard"])
def dashboard_summary() -> DashboardSummary:
    return DashboardSummary(
        total_projects=5,
        total_files=22,
        active_users=12,
        recent_activity=[
            "Reviewed merge for sample data",
            "Uploaded new comparison file",
            "Updated dashboard summary",
        ],
        message="Dashboard summary loaded successfully",
    )


@app.get("/dashboard/stats", response_model=DashboardStats, tags=["dashboard"])
def dashboard_stats() -> DashboardStats:
    return DashboardStats(
        total_annotations=69,
        merged_views=18,
        active_sessions=3,
    )
