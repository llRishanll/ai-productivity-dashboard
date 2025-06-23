import os
os.environ["LIMITER"] = "False"

import pytest_asyncio
from httpx import AsyncClient, ASGITransport

from database import database
from models.user import users
from models.task import tasks
from utils.security import get_current_user
from utils.notifications import send_verification_email
from main import app

test_user_data = {
    "name": "testuser",
    "email": "testuser@gmail.com",
    "password": "testpassword123"
}

@pytest_asyncio.fixture(scope="function", autouse=True)
async def setup_and_teardown():
    if not database.is_connected:
        await database.connect()
    yield
    await database.disconnect()

@pytest_asyncio.fixture(scope="function")
async def client():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        yield ac

@pytest_asyncio.fixture(scope="function")
async def test_user(client):
    await database.execute(users.delete().where(users.c.email == test_user_data["email"]))

    def fake_send_verification_email(to_email, token):
        print(f"Mocked verification sent to {to_email} with token {token}")
    send_verification_email.__code__ = fake_send_verification_email.__code__

    # Sign up user
    await client.post("/auth/signup", json=test_user_data)

    # Force verify user and make admin
    query = users.update().where(users.c.email == test_user_data["email"]).values(is_verified=True, role="admin")
    await database.execute(query)

    # Log in and get token
    form_data = {
        "username": test_user_data["email"],
        "password": test_user_data["password"]
    }
    login_resp = await client.post("/auth/login", data=form_data)

    assert login_resp.status_code == 200
    token = login_resp.json().get("access_token")
    assert token is not None

    yield {"token": token, "email": test_user_data["email"]}

    await database.execute(users.delete().where(users.c.email == test_user_data["email"]))

# Helper: Delete all tasks for a user
async def delete_all_tasks_for_user(token: str):
    user = await get_current_user(["admin"], token=token)
    query = tasks.delete().where(tasks.c.user_id == user["id"])
    await database.execute(query)

# Helper: Auth headers for API requests
def auth_headers(token: str):
    return {"Authorization": f"Bearer {token}"}
