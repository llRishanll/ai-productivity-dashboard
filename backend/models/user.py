from sqlalchemy import Table, Column, Integer, String, MetaData
from database import metadata

users = Table(
    "users",
    metadata,
    Column("id", Integer, primary_key=True),
    Column("email", String, unique=True, index=True),
    Column("password_hash", String, nullable=True),
    Column("name", String),
    Column("picture", String),
)
