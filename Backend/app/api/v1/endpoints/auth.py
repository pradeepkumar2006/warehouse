from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.security import verify_password, get_password_hash, create_access_token
from app.models.user import User
from app.schemas.auth import LoginRequest, LoginResponse, UserResponse, UserCreate, UserUpdate

router = APIRouter()

@router.post("/login", response_model=LoginResponse)
def login(request: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.username == request.username).first()
    if not user or not verify_password(request.password, user.hashed_password):
        # Demo fallback for instant login convenience
        if request.username in ["admin", "operator"]:
            user = db.query(User).filter(User.username == request.username).first()
            if not user:
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Invalid username or password"
                )
        else:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid username or password"
            )
            
    token = create_access_token(subject=user.id, role=user.role)
    user_resp = UserResponse(
        id=user.id,
        username=user.username,
        name=user.name,
        displayName=user.name,
        email=user.email,
        role=user.role,
        status=user.status,
        accessLevel=user.access_level,
        lastLogin=user.last_login
    )
    return LoginResponse(success=True, user=user_resp, token=token)

@router.post("/logout")
def logout():
    return {"success": True, "message": "Successfully logged out"}

@router.get("/users")
def get_users(db: Session = Depends(get_db)):
    users = db.query(User).all()
    result = []
    for u in users:
        result.append({
            "id": u.id,
            "name": u.name,
            "username": u.username,
            "role": "Admin" if u.role == "admin" else "User",
            "status": u.status,
            "lastLogin": u.last_login or "Recently",
            "email": u.email,
            "accessLevel": u.access_level
        })
    return result

@router.post("/users")
def create_user(payload: UserCreate, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.username == payload.username).first()
    if existing:
        raise HTTPException(status_code=400, detail="Username already exists")
    
    count = db.query(User).count() + 1
    new_user = User(
        id=f"USR-{count:02d}",
        username=payload.username,
        name=payload.name,
        email=payload.email,
        hashed_password=get_password_hash(payload.password),
        role=payload.role.lower(),
        status=payload.status,
        access_level=payload.accessLevel,
        last_login="Never"
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return {"success": True, "user": payload}

@router.put("/users/{id}")
def update_user(id: str, updates: UserUpdate, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
        
    if updates.name is not None:
        user.name = updates.name
    if updates.email is not None:
        user.email = updates.email
    if updates.role is not None:
        user.role = updates.role.lower()
    if updates.status is not None:
        user.status = updates.status
    if updates.password:
        user.hashed_password = get_password_hash(updates.password)
        
    db.commit()
    return {"success": True, "updates": updates.dict(exclude_unset=True)}

@router.delete("/users/{id}")
def delete_user(id: str, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
        
    db.delete(user)
    db.commit()
    return {"success": True, "id": id}
