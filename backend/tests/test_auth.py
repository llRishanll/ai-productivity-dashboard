import pytest
import pytest
from crud import user_crud
from schemas.user_schema import UserCreate
from database import database

@pytest.mark.asyncio
async def test_get_me(client, test_user):
    headers = {"Authorization": f"Bearer {test_user["token"]}"}
    res = await client.get("/me", headers=headers)
    assert res.status_code == 200
    assert res.json()["email"] == test_user["email"]

#user_crud functions Tests:

test_user_data = UserCreate(
    email="crudtest@example.com",
    name="CRUD Tester",
    picture="https://example.com/avatar.png"
)

@pytest.mark.asyncio
async def test_create_user():
    await database.execute("DELETE FROM users WHERE email = :email", {"email": test_user_data.email})

    user = await user_crud.create_user(test_user_data)
    assert user["email"] == test_user_data.email
    assert user["name"] == test_user_data.name
    assert user["picture"] == test_user_data.picture
    assert "id" in user

@pytest.mark.asyncio
async def test_get_user_by_email_found():
    user = await user_crud.get_user_by_email(test_user_data.email)
    assert user is not None
    assert user["email"] == test_user_data.email

@pytest.mark.asyncio
async def test_get_user_by_email_not_found():
    user = await user_crud.get_user_by_email("nonexistent@example.com")
    assert user is None

@pytest.mark.asyncio
async def test_get_or_create_user_existing():
    user = await user_crud.get_or_create_user(test_user_data)
    assert user["email"] == test_user_data.email

@pytest.mark.asyncio
async def test_get_or_create_user_new():
    temp_user = UserCreate(
        email="newuser@example.com",
        name="New User",
        picture="https://example.com/new.png"
    )
    await database.execute("DELETE FROM users WHERE email = :email", {"email": temp_user.email})
    user = await user_crud.get_or_create_user(temp_user)
    assert user["email"] == temp_user.email
