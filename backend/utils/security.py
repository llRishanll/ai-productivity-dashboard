from fastapi import Depends,HTTPException,status
from jose import JWTError
from models.user import users
from database import database
from sqlalchemy import select
from fastapi.security import OAuth2PasswordBearer
from passlib.context import CryptContext
from dotenv import load_dotenv
from jose import jwt
from datetime import datetime, timedelta, timezone
import os
from pathlib import Path
load_dotenv(dotenv_path=Path(__file__).parent.parent / ".env")

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")
secret_key = os.getenv("SECRET_KEY", "dev-secret")
algorithm=os.getenv("ALGORITHM", "HS256")
expiry=int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", 60))

def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

def create_access_token(data: dict, expires_delta: timedelta = timedelta(minutes=expiry)):
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + expires_delta
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, secret_key, algorithm)

def create_verification_token(email: str) -> str:
    expire = datetime.now(timezone.utc) + timedelta(minutes=15)
    payload = {"sub": email, "exp": expire}
    return jwt.encode(payload, secret_key, algorithm)

def decode_verification_token(token: str) -> str:
    payload = jwt.decode(token, secret_key, algorithms=[algorithm])
    return payload.get("sub")

async def get_current_user(roles: list, token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Invalid credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, secret_key, algorithms=[algorithm])
        user_email = payload.get("sub")
        if user_email is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception

    query = select(users).where(users.c.email == user_email)
    user = await database.fetch_one(query)
    if user is None:
        raise credentials_exception
    if user["role"] not in roles:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Insufficient permissions."
        )
    if not user["is_verified"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Email not verified."
        )
    return user