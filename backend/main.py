import os
from fastapi import FastAPI,Request
from fastapi.staticfiles import StaticFiles
from slowapi.errors import RateLimitExceeded
from slowapi.middleware import SlowAPIMiddleware
from starlette.responses import JSONResponse
from contextlib import asynccontextmanager
from starlette.middleware.sessions import SessionMiddleware
from fastapi.middleware.cors import CORSMiddleware
from database import engine, metadata, database
from utils.rate_limiter import limiter
from routes.auth_router import router as auth_router
from routes.tasks_router import router as tasks_router
from routes.ai_router import router as ai_router
from routes.admin_router import router as admin_router
from scheduler import start_scheduler
from logging_config import setup_logging, logger
setup_logging()


# Create tables
metadata.create_all(bind=engine)

# Define the new lifespan context
@asynccontextmanager
async def lifespan(app: FastAPI):
    await database.connect()
    start_scheduler()
    logger.info("TaskMaster AI backend is up and running")
    yield
    await database.disconnect()

# Pass lifespan to FastAPI
app = FastAPI(lifespan=lifespan)

#Rate Limiting Middleware
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

#Logging middleware
@app.middleware("http")
async def log_requests(request: Request, call_next):
    logger.info(
        "Incoming request",
        method=request.method,
        path=request.url.path,
        client=request.client.host
    )

    response = await call_next(request)

    logger.info(
        "Completed request",
        method=request.method,
        path=request.url.path,
        status_code=response.status_code
    )

    return response

# Mount static files
app.mount("/static", StaticFiles(directory="static"), name="static")

# Routes

app.include_router(auth_router, tags=["Auth"])
app.include_router(tasks_router, tags=["Tasks"])
app.include_router(ai_router, tags=["AI"])
app.include_router(admin_router, tags=["Admin"])




