import os
from pathlib import Path
from dotenv import load_dotenv
import asyncpg
from typing import Optional, Union, Any
from sqlalchemy.sql import Executable, Select, Insert, Update, Delete
from sqlalchemy.dialects import postgresql

if os.getenv("RUNNING_IN_DOCKER") != "true":
    if os.getenv("PYTEST_CURRENT_TEST"):
        load_dotenv(dotenv_path=Path(__file__).parent.parent / ".env.test", override=True)
    else:
        load_dotenv(dotenv_path=Path(__file__).parent.parent / ".env", override=True)

POSTGRES_USER = os.getenv("POSTGRES_USER")
POSTGRES_PASSWORD = os.getenv("POSTGRES_PASSWORD")
POSTGRES_DB = os.getenv("POSTGRES_DB")
POSTGRES_HOST = os.getenv("POSTGRES_HOST")
POSTGRES_PORT = os.getenv("POSTGRES_PORT")

DATABASE_URL = (
    f"postgresql://{POSTGRES_USER}:{POSTGRES_PASSWORD}@{POSTGRES_HOST}:{POSTGRES_PORT}/{POSTGRES_DB}"
)

from databases import Database
from sqlalchemy import create_engine, MetaData

database = Database(DATABASE_URL)  
engine = create_engine(DATABASE_URL)
metadata = MetaData()



