from sqlalchemy import Table, Column, Integer, String, Boolean, DateTime, func
from database import metadata

users = Table(
    "users",
    metadata,
    Column("id", Integer, primary_key=True),
    Column("email", String, unique=True, index=True),
    Column("password_hash", String, nullable=True),
    Column("is_verified", Boolean, default=False),
    Column("role", String, default="user"),  
    Column("name", String),
    Column("picture", String),
    Column("created_at", DateTime(timezone=True), server_default=func.now()),
    Column("updated_at", DateTime(timezone=True), onupdate=func.now(), server_default=func.now())
)
