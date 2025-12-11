"""
User management endpoints
"""

from typing import List
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, EmailStr

router = APIRouter()


class UserResponse(BaseModel):
    id: str
    name: str
    email: str
    role: str = "user"


class UserUpdate(BaseModel):
    name: str | None = None
    email: EmailStr | None = None


@router.get("", response_model=List[UserResponse])
async def get_users():
    """Get all users (admin only)"""
    # TODO: Implement with database
    return []


@router.get("/{user_id}", response_model=UserResponse)
async def get_user(user_id: str):
    """Get user by ID"""
    # TODO: Implement with database
    raise HTTPException(status_code=404, detail="User not found")


@router.patch("/{user_id}", response_model=UserResponse)
async def update_user(user_id: str, data: UserUpdate):
    """Update user"""
    # TODO: Implement with database
    raise HTTPException(status_code=404, detail="User not found")


@router.delete("/{user_id}")
async def delete_user(user_id: str):
    """Delete user"""
    # TODO: Implement with database
    return {"message": "User deleted"}


