import pytest

@pytest.mark.asyncio
async def test_get_me(client, test_user):
    headers = {"Authorization": f"Bearer {test_user["token"]}"}
    res = await client.get("/me", headers=headers)
    assert res.status_code == 200
    assert res.json()["email"] == test_user["email"]