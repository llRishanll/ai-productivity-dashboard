from sqlalchemy import Table, Column, Integer, String, Boolean,ForeignKey, Date
from database import metadata

tasks = Table(
    "tasks",
    metadata,
    Column("id", Integer, primary_key=True),
    Column("title", String(100), nullable=False),
    Column("description", String(255), nullable=True),
    Column("completed", Boolean, default=False),
    Column("user_id", Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False),
    Column("due_date", Date, nullable=True),  
    Column("priority", String(100), nullable=True),
    Column("recurring", String, default="none"), 
    Column("recurring_until", Date, nullable=True)
)