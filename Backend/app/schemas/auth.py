from typing import Optional
from pydantic import BaseModel

class LoginRequest(BaseModel):
    username: str
    password: str

class UserResponse(BaseModel):
    id: str
    username: str
    name: str
    displayName: Optional[str] = None
    email: str
    role: str
    status: str
    accessLevel: Optional[str] = None
    lastLogin: Optional[str] = None

    class Config:
        from_attributes = True

class LoginResponse(BaseModel):
    success: bool
    user: UserResponse
    token: str

class UserCreate(BaseModel):
    name: str
    username: str
    email: str
    password: Optional[str] = "warehouse123"
    role: str = "user"
    status: Optional[str] = "Active"
    accessLevel: Optional[str] = "Standard Operations Access"

class UserUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[str] = None
    role: Optional[str] = None
    status: Optional[str] = None
    accessLevel: Optional[str] = None
    password: Optional[str] = None
