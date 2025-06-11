from fastapi import APIRouter, Request,HTTPException,Depends
from fastapi.security import OAuth2PasswordRequestForm
from fastapi.responses import RedirectResponse
from authlib.integrations.starlette_client import OAuth
from starlette.config import Config
from crud.user_crud import get_or_create_user
from schemas.user_schema import UserCreate, UserSignup
from utils.security import hash_password, verify_password, create_access_token, get_current_user, create_verification_token, decode_verification_token, oauth2_scheme
from utils.notifications import send_verification_email
from database import database
from models.user import users
from main import limiter
from logging_config import logger
from datetime import datetime, timezone
import os
from dotenv import load_dotenv
from pathlib import Path
load_dotenv(dotenv_path=Path(__file__).parent.parent / ".env")

router = APIRouter()

config_data = {
    "GOOGLE_CLIENT_ID": os.getenv("GOOGLE_CLIENT_ID"),
    "GOOGLE_CLIENT_SECRET": os.getenv("GOOGLE_CLIENT_SECRET"),
    "SECRET_KEY": os.getenv("SECRET_KEY"),
}
config = Config(environ=config_data)

oauth = OAuth(config)
oauth.register(
    name='google',
    client_id=os.getenv("GOOGLE_CLIENT_ID"),
    client_secret=os.getenv("GOOGLE_CLIENT_SECRET"),
    access_token_url='https://oauth2.googleapis.com/token',
    authorize_url='https://accounts.google.com/o/oauth2/auth',
    api_base_url='https://www.googleapis.com/oauth2/v1/',
    client_kwargs={
        'scope': 'email profile'
    }
)

@router.post("/auth/signup", status_code=201)
@limiter.limit("3/minute")  
async def signup(user: UserSignup, request: Request):
    logger.info("Signup attempt", email=user.email, ip=request.client.host)

    query = users.select().where(users.c.email == user.email)
    existing_user = await database.fetch_one(query)

    if existing_user:
        logger.warning("Signup failed - User already exists", email=user.email)
        raise HTTPException(status_code=400, detail="User already exists")

    hashed = hash_password(user.password)
    insert_query = users.insert().values(
        email=user.email,
        name=user.name,
        password_hash=hashed,
        is_verified=False,
        role="user",  
        picture=""
    )
    user_id = await database.execute(insert_query)

    token = create_verification_token(user.email)
    send_verification_email(user.email, token)

    logger.info("User signed up successfully", email=user.email, user_id=user_id)
    return {"message": "User created. Please verify your email."}


@router.get("/auth/verify-email/")
@limiter.limit("5/minute")
async def verify_email(token: str, request: Request):
    logger.info("Email verification attempt", token=token, ip=request.client.host)

    try:
        email = decode_verification_token(token)
    except Exception as e:
        logger.warning("Email verification failed - Invalid or expired token", token=token, error=str(e))
        raise HTTPException(status_code=400, detail="Invalid or expired token")

    query = users.select().where(users.c.email == email)
    user = await database.fetch_one(query)

    if not user:
        logger.warning("Email verification failed - User not found", email=email)
        raise HTTPException(status_code=404, detail="User not found")

    if user["is_verified"]:
        logger.info("Email already verified", email=email)
        return {"message": "Email already verified"}

    update_query = users.update().where(users.c.email == email).values(
        is_verified=True, updated_at=datetime.now(timezone.utc)
    )
    await database.execute(update_query)

    logger.info("Email verified successfully", email=email)
    return {"message": "Email verified successfully"}


@router.post("/resend-verification")
@limiter.limit("1/minute")
async def resend_verification(request: Request, email: str):
    logger.info("Resend verification attempt", email=email, ip=request.client.host)

    user = await database.fetch_one(users.select().where(users.c.email == email))
    if not user:
        logger.warning("Resend failed - User not found", email=email)
        raise HTTPException(status_code=404, detail="User not found. Sign up first.")
    
    if user["is_verified"]:
        logger.info("Resend skipped - User already verified", email=email)
        raise HTTPException(status_code=400, detail="User already verified")

    token = create_verification_token(user["id"])
    send_verification_email(user["email"], token)

    logger.info("Verification email resent", email=email)
    return {"message": "Verification email resent"}


@router.post("/auth/login")
@limiter.limit("5/minute")
async def login(request: Request, form_data: OAuth2PasswordRequestForm = Depends()):
    logger.info("Login attempt", email=form_data.username, ip=request.client.host)

    query = users.select().where(users.c.email == form_data.username)
    user = await database.fetch_one(query)

    if not user or not verify_password(form_data.password, user["password_hash"]):
        logger.warning("Login failed - invalid credentials", email=form_data.username, ip=request.client.host)
        raise HTTPException(status_code=401, detail="Invalid email or password")

    if not user["is_verified"]:
        logger.warning("Login blocked - email not verified", email=form_data.username, ip=request.client.host)
        raise HTTPException(status_code=403, detail="Email not verified")

    token = create_access_token(data={"sub": user["email"]})

    logger.info("Login successful", user_id=user["id"], email=user["email"], ip=request.client.host)
    return {"access_token": token, "token_type": "bearer"}


@router.get("/auth/google-login")
@limiter.limit("5/minute")
async def login(request: Request):
    logger.info("Google OAuth login initiated", ip=request.client.host)
    redirect_uri = request.url_for("auth_callback")
    return await oauth.google.authorize_redirect(request, redirect_uri)


@router.get("/auth/callback")
@limiter.limit("5/minute")
async def auth_callback(request: Request):
    try:
        token = await oauth.google.authorize_access_token(request)
        resp = await oauth.google.get("userinfo", token=token)
        user_info = resp.json()
        user_model = UserCreate(**user_info)

        logger.info("Google OAuth callback received", email=user_info.get("email"), ip=request.client.host)

        user = await get_or_create_user(user_model)
        access_token = create_access_token(data={"sub": user["email"]})

        logger.info("Google login successful", email=user["email"], user_id=user["id"])
        return RedirectResponse(url=f"{os.getenv('FRONTEND_URL')}/?token={access_token}")
    except Exception as e:
        logger.error("Google login failed", error=str(e), ip=request.client.host)
        return {"error": str(e)}
    

@router.get("/me")
@limiter.limit("10/minute")
async def get_current_user_data(request: Request, token: str = Depends(oauth2_scheme)):
    current_user = await get_current_user(["user", "admin"], token=token)
    logger.info("Fetched current user data", user_id=current_user["id"], email=current_user["email"], ip=request.client.host)
    return current_user
