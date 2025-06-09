import pytest
from tests.conftest import auth_headers
from models.user import users
from database import database

@pytest.mark.asyncio
async def test_get_all_users(client, test_user):
    headers = auth_headers(test_user["token"])
    res = await client.get("/admin/users", headers=headers)
    assert res.status_code == 200
    data = res.json()
    assert "users" in data
    assert isinstance(data["users"], list)

@pytest.mark.asyncio
async def test_get_all_users_unauthorized(client):
    res = await client.get("/admin/users")  
    assert res.status_code == 401

@pytest.mark.asyncio
async def test_promote_user(client, test_user):
    new_user_data = {
        "name": "tempuser",
        "email": "tempuser@example.com",
        "password": "temppass123"
    }

    await database.execute(users.delete().where(users.c.email == new_user_data["email"]))
    await client.post("/auth/signup", json=new_user_data)
    await database.execute(users.update().where(users.c.email == new_user_data["email"]).values(is_verified=True, role="user"))

    query = users.select().where(users.c.email == new_user_data["email"])
    new_user = await database.fetch_one(query)
    new_user_id = new_user["id"]

    headers = auth_headers(test_user["token"])
    res = await client.post(f"/admin/promote/{new_user_id}", headers=headers)
    assert res.status_code == 200
    assert "promoted" in res.json()["detail"]

    await database.execute(users.delete().where(users.c.id == new_user_id))

@pytest.mark.asyncio
async def test_promote_nonexistent_user(client, test_user):
    headers = auth_headers(test_user["token"])
    res = await client.post("/admin/promote/999999", headers=headers)
    assert res.status_code == 404

@pytest.mark.asyncio
async def test_promote_already_admin(client, test_user):
    headers = auth_headers(test_user["token"])
    query = users.select().where(users.c.email == test_user["email"])
    user = await database.fetch_one(query)
    res = await client.post(f"/admin/promote/{user['id']}", headers=headers)
    assert res.status_code == 400
    assert "already an admin" in res.json()["detail"]

@pytest.mark.asyncio
async def test_delete_user_not_found(client, test_user):
    headers = auth_headers(test_user["token"])
    res = await client.delete("/admin/users/999999", headers=headers)
    assert res.status_code == 404

@pytest.mark.asyncio
async def test_get_stats(client, test_user):
    headers = auth_headers(test_user["token"])
    res = await client.get("/admin/stats", headers=headers)
    assert res.status_code == 200
    data = res.json()
    assert "total_users" in data
    assert "total_tasks" in data

