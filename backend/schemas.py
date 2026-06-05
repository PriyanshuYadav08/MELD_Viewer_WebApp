from pydantic import BaseModel, EmailStr
from typing import List, Optional


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class RegisterRequest(BaseModel):
    email: EmailStr
    password: str
    full_name: Optional[str] = None


class AuthResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user_email: EmailStr
    message: str


class DashboardSummary(BaseModel):
    total_projects: int
    total_files: int
    active_users: int
    recent_activity: List[str]
    message: str


class DashboardStats(BaseModel):
    total_annotations: int
    merged_views: int
    active_sessions: int
