from models.user import users
from database import database
from schemas.user_schema import UserCreate

async def get_user_by_email(email: str):
    query = users.select().where(users.c.email == email)
    return await database.fetch_one(query)

async def create_user(user: UserCreate):
    query = users.insert().values(
        email=user.email,
        name=user.name,
        picture=user.picture
    )
    user_id = await database.execute(query)
    return {**user.model_dump(), "id": user_id}

async def get_or_create_user(user: UserCreate):
    existing_user = await get_user_by_email(user.email)
    if existing_user:
        return existing_user
    else:
        return await create_user(user)