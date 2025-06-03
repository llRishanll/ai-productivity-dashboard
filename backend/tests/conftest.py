import os
os.environ["LIMITER"] = "False"
import pytest_asyncio
from httpx import AsyncClient,ASGITransport
from main import app
from database import database
from models.user import users
from models.task import tasks
from utils.security import get_current_user


test_user_data = {
    "name": "testuser",
    "email": "testuser@gmail.com",
    "password": "testpassword123"
}

@pytest_asyncio.fixture(scope="module")
async def client():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        yield ac

@pytest_asyncio.fixture(scope="module")
async def test_user(client):
    if not database.is_connected:
        await database.connect()
    await client.post("/auth/signup", json=test_user_data)

    form_data = {
        "username": test_user_data["email"],
        "password": test_user_data["password"]
    }
    login_resp = await client.post("/auth/login", data=form_data)
    
    assert login_resp.status_code == 200
    token = login_resp.json().get("access_token")
    assert token is not None
    yield{"token":token, "email":test_user_data["email"]}
    await database.execute(users.delete().where(users.c.email == test_user_data["email"]))

async def delete_all_tasks_for_user(token: str):
    user = await get_current_user(token)
    query = tasks.delete().where(tasks.c.user_id == user["id"])
    await database.execute(query)