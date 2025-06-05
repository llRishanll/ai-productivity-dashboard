import pytest, asyncio, datetime
from datetime import timedelta, date
from unittest.mock import patch, MagicMock
from tests.conftest import delete_all_tasks_for_user

def auth_headers(token: str):
    return {"Authorization": f"Bearer {token}"}


@pytest.mark.asyncio
@patch("utils.ai.client.chat.completions.create")
async def test_ai_generate_task(mock_openai, client, test_user):
    mock_openai.return_value.choices = [MagicMock(message=MagicMock(content='{"title": "Math", "description": "Finish test prep", "due_date": "2025-06-05"}'))]

    headers = auth_headers(test_user["token"])
    res = await client.post("/tasks/ai-generate", json="Finish math homework and revise for test", headers=headers)

    assert res.status_code == 200
    data = res.json()
    assert "id" in data
    assert "title" in data
    assert "description" in data
    assert "due_date" in data
    assert not data["completed"]
    await delete_all_tasks_for_user(test_user["token"])


@pytest.mark.asyncio
async def test_ai_generate_task_unauthenticated(client):
    res = await client.post("/tasks/ai-generate", json="Do laundry")
    assert res.status_code == 401


@pytest.mark.asyncio
@patch("utils.ai.client.chat.completions.create")
async def test_ai_prioritize(mock_openai, client, test_user):
    mock_openai.return_value.choices = [MagicMock(message=MagicMock(content='{"Finish homework: Math and Science assignments": "High", "Call mom: Weekly check-in call": "Low"}'))]

    headers = auth_headers(test_user["token"])
    await client.post("/tasks", json={"title": "Finish homework", "description": "Math and Science assignments"}, headers=headers)
    await client.post("/tasks", json={"title": "Call mom", "description": "Weekly check-in call"}, headers=headers)

    res = await client.get("/tasks/ai-prioritize", headers=headers)
    assert res.status_code == 200
    assert "Updated priorities" in res.json()


@pytest.mark.asyncio
async def test_ai_prioritize_unauthenticated(client):
    res = await client.get("/tasks/ai-prioritize")
    assert res.status_code == 401


@pytest.mark.asyncio
@patch("utils.ai.client.chat.completions.create")
async def test_ai_daily_plan_success(mock_openai, client, test_user):
    mock_openai.return_value.choices = [MagicMock(message=MagicMock(content="**High Priority**\n- Finish math homework\n\n**Schedule**\n- Morning: ..."))]

    headers = auth_headers(test_user["token"])
    today = str(datetime.date.today())

    await client.post("/tasks", json={"title": "Finish math homework", "description": "Chapter 7 and 8", "due_date": today}, headers=headers)
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


@pytest.mark.asyncio
@patch("utils.ai.client.chat.completions.create")
async def test_ai_summary_success(mock_openai, client, test_user):
    mock_openai.return_value.choices = [MagicMock(message=MagicMock(content="This week, you should focus on..."))]

    headers = auth_headers(test_user["token"])
    await client.post("/tasks", json={"title": "Submit assignment", "description": "AI course", "due_date": "2025-06-05"}, headers=headers)
    await client.post("/tasks", json={"title": "Pay bills", "description": "Internet, hydro", "due_date": "2025-06-04"}, headers=headers)

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
@patch("utils.ai.client.chat.completions.create")
async def test_ai_week_plan_success(mock_openai, client, test_user):
    mock_openai.return_value.choices = [MagicMock(message=MagicMock(content="**Week Plan**\n- Monday: Task 1\n- Tuesday: Task 2"))]

    headers = auth_headers(test_user["token"])
    today = date.today()

    for i in range(3):
        due = (today + timedelta(days=i)).isoformat()
        await client.post("/tasks", json={"title": f"Task {i+1}", "description": f"Desc {i+1}", "due_date": due}, headers=headers)

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
