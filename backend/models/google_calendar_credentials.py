from sqlalchemy import Table, Column, Integer, String, ForeignKey, DateTime
from database import metadata

google_calendar_credentials = Table(
    "google_calendar_credentials",
    metadata,
    Column("id", Integer, primary_key=True),
    Column("user_id", Integer, ForeignKey("users.id", ondelete="CASCADE")),
    Column("access_token", String, nullable=False),
    Column("refresh_token", String, nullable=False),
    Column("expires_at", DateTime, nullable=False),
    Column("token_type", String, nullable=False),
    Column("scope", String, nullable=True)
)
