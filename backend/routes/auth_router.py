from fastapi import APIRouter, Request,HTTPException,Depends
from fastapi.security import OAuth2PasswordRequestForm
from fastapi.responses import RedirectResponse
from authlib.integrations.starlette_client import OAuth
from starlette.config import Config
from crud.user_crud import get_or_create_user
from schemas.user_schema import UserCreate, UserSignup
from utils.security import hash_password, verify_password, create_access_token, get_current_user
from database import database
from models.user import users
import os
from dotenv import load_dotenv
load_dotenv()

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
async def signup(user: UserSignup):
    query = users.select().where(users.c.email == user.email)
    existing_user = await database.fetch_one(query)

    if existing_user:
        raise HTTPException(status_code=400, detail="User already exists")

    hashed = hash_password(user.password)
    insert_query = users.insert().values(
        email=user.email,
        name=user.name,
        password_hash=hashed,
        picture=""
    )
    await database.execute(insert_query)

    return {"message": "User created successfully"}

@router.post("/auth/login")
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    query = users.select().where(users.c.email == form_data.username)
    user = await database.fetch_one(query)

    if not user or not verify_password(form_data.password, user["password_hash"]):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    token = create_access_token(data={"sub": user["email"]})
    return {"access_token": token, "token_type": "bearer"}

@router.get("/auth/google-login")
async def login(request: Request):
    redirect_uri = request.url_for("auth_callback")
    return await oauth.google.authorize_redirect(request, redirect_uri)

@router.get("/auth/callback")
async def auth_callback(request: Request):
    try:
        token = await oauth.google.authorize_access_token(request)
        resp = await oauth.google.get("userinfo", token=token)
        user_info = resp.json()
        user_model = UserCreate(**user_info)

        user = await get_or_create_user(user_model)
        access_token = create_access_token(data={"sub": user["email"]})

        return RedirectResponse(url=f"{os.getenv('FRONTEND_URL')}/?token={access_token}")
    except Exception as e:
        print("OAUTH CALLBACK ERROR:", e)
        return {"error": str(e)}

@router.get("/me")
async def get_current_user_data(current_user: dict = Depends(get_current_user)):
    return current_user