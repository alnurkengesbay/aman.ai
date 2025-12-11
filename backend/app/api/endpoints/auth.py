"""
Authentication endpoints
"""

from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel, EmailStr

router = APIRouter()


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class RegisterRequest(BaseModel):
    name: str
    email: EmailStr
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"


class UserResponse(BaseModel):
    id: str
    name: str
    email: str


@router.post("/login", response_model=TokenResponse)
async def login(data: LoginRequest):
    """
    Login with email and password.
    Returns JWT access token.
    """
    # TODO: Implement actual authentication with database
    # For now, return mock response
    return TokenResponse(
        access_token="mock_token_for_development",
        token_type="bearer",
    )


@router.post("/register", response_model=UserResponse)
async def register(data: RegisterRequest):
    """
    Register new user.
    """
    # TODO: Implement actual registration with database
    return UserResponse(
        id="mock_id",
        name=data.name,
        email=data.email,
    )


@router.post("/logout")
async def logout():
    """Logout current user"""
    return {"message": "Successfully logged out"}


@router.get("/me", response_model=UserResponse)
async def get_current_user():
    """Get current authenticated user"""
    # TODO: Implement JWT validation
    return UserResponse(
        id="mock_id",
        name="Test User",
        email="test@example.com",
    )


