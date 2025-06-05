import os
from dotenv import load_dotenv
from fastapi import FastAPI,Request
from slowapi.errors import RateLimitExceeded
from slowapi.middleware import SlowAPIMiddleware
from starlette.responses import JSONResponse
from contextlib import asynccontextmanager
from database import database, engine, metadata
from starlette.middleware.sessions import SessionMiddleware
from fastapi.middleware.cors import CORSMiddleware
load_dotenv()
from utils.rate_limiter import limiter
from routes.auth_router import router as auth_router
from routes.tasks_router import router as tasks_router
from routes.ai_router import router as ai_router

from scheduler import start_scheduler


# Create tables
metadata.create_all(bind=engine)

# Define the new lifespan context
@asynccontextmanager
async def lifespan(app: FastAPI):
    await database.connect()
    start_scheduler()
    yield
    await database.disconnect()

# Pass lifespan to FastAPI
app = FastAPI(lifespan=lifespan)

app.state.limiter = limiter
@app.exception_handler(RateLimitExceeded)
async def rate_limit_exceeded_handler(request:Request, exc:RateLimitExceeded):
    return JSONResponse(
        status_code=429,
        content={"detail": "Rate limit exceeded. Please try again later."},
    )

app.add_middleware(SlowAPIMiddleware)

app.add_middleware(SessionMiddleware, secret_key=os.getenv("SECRET_KEY"))

allowed_origins = os.getenv("FRONTEND_URL", "*").split(",") if os.getenv("FRONTEND_URL") else ["*"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routes

app.include_router(auth_router, tags=["Auth"])
app.include_router(tasks_router, tags=["Tasks"])
app.include_router(ai_router, tags=["AI"])


# @app.get("/test-email")
# def test_email():
#     fake_tasks = [
#         {"title": "Finish project", "description": "Due by 5pm"},
#         {"title": "Submit lab", "description": "Due at midnight"},
#     ]
#     send_email("desh2605@mylaurier.ca", fake_tasks)
#     return {"status": "Email sent"}

# @app.get("/send-test-reminders")
# async def trigger_reminders():
#     await send_daily_reminders()
#     return {"status": "Reminders sent"}

