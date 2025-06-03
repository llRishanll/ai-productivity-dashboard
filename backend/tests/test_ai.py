import pytest,asyncio,datetime
from datetime import timedelta,date
from tests.conftest import delete_all_tasks_for_user

def auth_headers(token: str):
    return {"Authorization": f"Bearer {token}"}

@pytest.mark.asyncio
async def test_ai_generate_task(client, test_user):
    headers = auth_headers(test_user["token"])
    res = await client.post("/tasks/ai-generate", json="Finish math homework and revise for test", headers=headers)
    assert res.status_code == 200

    data = res.json()
    assert "id" in data
    assert "title" in data
    assert "description" in data
    assert "due_date" in data
    assert not data["completed"]
    assert data["title"] != ""
    assert data["description"] != ""
    await delete_all_tasks_for_user(test_user["token"])


@pytest.mark.asyncio
async def test_ai_generate_task_unauthenticated(client):
    res = await client.post("/tasks/ai-generate", json="Do laundry")
    assert res.status_code == 401

@pytest.mark.asyncio
async def test_ai_prioritize(client, test_user):
    headers = auth_headers(test_user["token"])

    await client.post("/tasks", json={
        "title": "Finish homework",
        "description": "Math and Science assignments"
    }, headers=headers)
    await client.post("/tasks", json={
        "title": "Call mom",
        "description": "Weekly check-in call"
    }, headers=headers)

    await asyncio.sleep(0.2)  
    res = await client.get("/tasks/ai-prioritize", headers=headers)

    assert res.status_code == 200
    data = res.json()
    assert "Updated priorities" in data
    assert isinstance(data["Updated priorities"], list)
    for item in data["Updated priorities"]:
        assert "id" in item
        assert item["priority"] in ["High", "Medium", "Low"]

@pytest.mark.asyncio
async def test_ai_prioritize_unauthenticated(client):
    res = await client.get("/tasks/ai-prioritize")  
    assert res.status_code == 401
    assert res.json()["detail"] == "Not authenticated"

@pytest.mark.asyncio
async def test_ai_daily_plan_success(client, test_user):
    headers = auth_headers(test_user["token"])
    today = str(datetime.date.today())

    await client.post("/tasks", json={
        "title": "Finish math homework",
        "description": "Chapter 7 and 8 problems",
        "due_date": today
    }, headers=headers)

    await asyncio.sleep(0.2)  
    res = await client.get("/tasks/ai-daily-plan", headers=headers)

    assert res.status_code == 200
    assert "plan" in res.json()
    await delete_all_tasks_for_user(test_user["token"])

@pytest.mark.asyncio
async def test_ai_daily_plan_no_tasks(client, test_user):
    headers = auth_headers(test_user["token"])
    res = await client.get("/tasks/ai-daily-plan", headers=headers)
    assert res.status_code == 200
    assert res.json()["message"] == "No tasks due today."

@pytest.mark.asyncio
async def test_ai_daily_plan_unauthenticated(client):
    res = await client.get("/tasks/ai-daily-plan")  
    assert res.status_code == 401
    assert res.json()["detail"] == "Not authenticated"

@pytest.mark.asyncio
async def test_ai_summary_success(client, test_user):
    headers = auth_headers(test_user["token"])

    await client.post("/tasks", json={"title": "Submit assignment", "description": "AI course", "due_date": "2025-06-05"}, headers=headers)
    await client.post("/tasks", json={"title": "Pay bills", "description": "Internet, hydro", "due_date": "2025-06-04"}, headers=headers)

    await asyncio.sleep(0.2)
    res = await client.get("/tasks/ai-summary", headers=headers)
    
    assert res.status_code == 200
    assert "summary" in res.json() 
    await delete_all_tasks_for_user(test_user["token"])

@pytest.mark.asyncio
async def test_ai_summary_no_tasks(client, test_user):
    headers = auth_headers(test_user["token"])
    await delete_all_tasks_for_user(test_user["token"])

    res = await client.get("/tasks/ai-summary", headers=headers)
    assert res.status_code == 200
    assert res.json()["message"] == "You have no pending tasks. Great job!"

@pytest.mark.asyncio
async def test_ai_summary_unauthenticated(client):
    res = await client.get("/tasks/ai-summary")
    assert res.status_code == 401

@pytest.mark.asyncio
async def test_ai_week_plan_success(client, test_user):
    headers = auth_headers(test_user["token"])

    today = date.today()
    for i in range(3):
        due = (today + timedelta(days=i)).isoformat()
        await client.post("/tasks", json={
            "title": f"Task {i+1}",
            "description": f"Week task {i+1}",
            "due_date": due
        }, headers=headers)

    await asyncio.sleep(0.2)
    res = await client.get("/tasks/ai-week-plan", headers=headers)
    assert res.status_code == 200
    assert "week_plan" in res.json()
    await delete_all_tasks_for_user(test_user["token"])


@pytest.mark.asyncio
async def test_ai_week_plan_no_tasks(client, test_user):
    headers = auth_headers(test_user["token"])
    await delete_all_tasks_for_user(test_user["token"])

    res = await client.get("/tasks/ai-week-plan", headers=headers)
    assert res.status_code == 200
    assert res.json()["message"] == "You have no tasks scheduled for this week."


@pytest.mark.asyncio
async def test_ai_week_plan_unauthenticated(client):
    res = await client.get("/tasks/ai-week-plan")
    assert res.status_code == 401