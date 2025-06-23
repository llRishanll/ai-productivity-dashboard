import pytest
import asyncio
from tests.conftest import auth_headers
from tests.conftest import delete_all_tasks_for_user

@pytest.mark.asyncio
async def test_create_task_full(client, test_user):
    headers = auth_headers(test_user["token"])

    task_data = {
        "title": "Test Task Full",
        "description": "Created via test",
        "due_date": "2025-05-30",
        "priority": "High",
        "recurring": "none",
        "recurring_until": "2999-01-01"
    }
    response = await client.post("/tasks", json=task_data, headers=headers)
    assert response.status_code == 200
    data = response.json()
    assert data["title"] == task_data["title"]
    assert data["description"] == task_data["description"]
    assert data["due_date"] == task_data["due_date"]
    assert data["priority"] == task_data["priority"]
    assert data["recurring"] == task_data["recurring"]
    assert data["recurring_until"] == task_data["recurring_until"]
    assert data["completed"] is False

@pytest.mark.asyncio
async def test_create_task_minimal(client, test_user):
    headers = auth_headers(test_user["token"])
    
    task_data = {
        "title": "Minimal Task"
    }
    response = await client.post("/tasks", json=task_data, headers=headers)
    assert response.status_code == 200
    data = response.json()
    assert data["title"] == task_data["title"]
    assert data["description"] is None
    assert data["priority"] is None
    assert data["recurring"] == "none"
    assert data["recurring_until"] == "2999-01-01"
    assert data["completed"] is False

@pytest.mark.asyncio
async def test_create_task_unauthenticated(client):
    task_data = {
        "title": "Unauthorized Task",
        "description": "This should fail"
    }
    response = await client.post("/tasks", json=task_data)
    assert response.status_code == 401

@pytest.mark.asyncio
async def test_get_tasks_basic(client, test_user):
    headers = auth_headers(test_user["token"])
    await client.post("/tasks", json={"title": "Task A"}, headers=headers)
    await client.post("/tasks", json={"title": "Task B"}, headers=headers)
    res = await client.get("/tasks", headers=headers)
    assert res.status_code == 200
    data = res.json()
    assert isinstance(data["tasks"], list)
    titles = [task["title"] for task in data["tasks"]]
    assert "Task A" in titles
    assert "Task B" in titles

@pytest.mark.asyncio
async def test_get_tasks_filtered_by_completed(client, test_user):
    headers = auth_headers(test_user["token"])

    await client.post("/tasks", json={"title": "Complete Me", "completed": True}, headers=headers)
    await client.post("/tasks", json={"title": "Incomplete Task"}, headers=headers)
    res = await client.get("/tasks?completed=false", headers=headers)
    assert res.status_code == 200
    for task in res.json()["tasks"]:
        assert task["completed"] is False

@pytest.mark.asyncio
async def test_get_tasks_filtered_by_priority(client, test_user):
    headers = auth_headers(test_user["token"])

    await client.post("/tasks", json={"title": "Urgent", "priority": "High"}, headers=headers)
    await client.post("/tasks", json={"title": "Chill", "priority": "Low"}, headers=headers)

    res = await client.get("/tasks?priority=High", headers=headers)
    assert res.status_code == 200
    for task in res.json()["tasks"]:
        assert task["priority"] == "High"

@pytest.mark.asyncio
async def test_get_tasks_search_by_title(client, test_user):
    headers = auth_headers(test_user["token"])

    await client.post("/tasks", json={"title": "Project Alpha"}, headers=headers)
    await client.post("/tasks", json={"title": "Project Beta"}, headers=headers)

    res = await client.get("/tasks?search=alpha", headers=headers)
    assert res.status_code == 200
    titles = [task["title"].lower() for task in res.json()["tasks"]]
    assert any("alpha" in title for title in titles)

@pytest.mark.asyncio
async def test_get_tasks_search_by_description(client, test_user):
    headers = auth_headers(test_user["token"])

    await client.post("/tasks", json={"title": "Alpha", "description": "Buy milk and eggs"}, headers=headers)
    await client.post("/tasks", json={"title": "Beta", "description": "Take out trash"}, headers=headers)
    await asyncio.sleep(0.2)
    res = await client.get("/tasks?search=egg", headers=headers)
    assert res.status_code == 200
    descriptions = [task["description"].lower() for task in res.json()["tasks"]]
    assert any("egg" in desc for desc in descriptions)

@pytest.mark.asyncio
async def test_get_tasks_sorted_by_due_date(client, test_user):
    headers = auth_headers(test_user["token"])

    await client.post("/tasks", json={"title": "Z", "priority": "High", "due_date": "2025-12-01"}, headers=headers)
    await client.post("/tasks", json={"title": "A", "priority": "High", "due_date": "2025-01-01"}, headers=headers)

    res = await client.get("/tasks?sort_by=due_date&order=asc", headers=headers)
    assert res.status_code == 200
    data = res.json()["tasks"]
    tasks_with_due_date = [task for task in data if task["due_date"] is not None]

    for i in range(len(tasks_with_due_date) - 1):
        assert tasks_with_due_date[i]["due_date"] <= tasks_with_due_date[i + 1]["due_date"]


@pytest.mark.asyncio
async def test_get_tasks_sorted_by_priority(client, test_user):
    headers = auth_headers(test_user["token"])

    await client.post("/tasks", json={"title": "Low Priority", "priority": "Low", "due_date": "2025-05-28"}, headers=headers)
    await client.post("/tasks", json={"title": "High Priority", "priority": "High", "due_date": "2025-05-28"}, headers=headers)

    res = await client.get("/tasks?sort_by=priority&order=asc", headers=headers)
    assert res.status_code == 200
    data = res.json()["tasks"]
    tasks_with_priority = [t for t in data if t["priority"] is not None]

    for i in range(len(tasks_with_priority) - 1):
        assert tasks_with_priority[i]["priority"] <= tasks_with_priority[i + 1]["priority"]

@pytest.mark.asyncio
async def test_delete_completed_tasks(client, test_user):
    headers = auth_headers(test_user["token"])
    await delete_all_tasks_for_user(test_user["token"])

    res1 = await client.post("/tasks", json={"title": "Done Task"}, headers=headers)
    task1_id = res1.json()["id"]

    await client.patch(f"/tasks/{task1_id}", json={"completed": True}, headers=headers)

    res2 = await client.post("/tasks", json={"title": "Pending Task"}, headers=headers)
    task2_id = res2.json()["id"]

    delete_res = await client.delete("/tasks/delete-completed", headers=headers)
    assert delete_res.status_code == 200

    res = await client.get("/tasks", headers=headers)
    data = res.json()
    remaining_ids = [task["id"] for task in data["tasks"]]

    assert task1_id not in remaining_ids  
    assert task2_id in remaining_ids      


@pytest.mark.asyncio
async def test_partial_task_update(client, test_user):
    headers = auth_headers(test_user["token"])

    res = await client.post("/tasks", json={"title": "Patchable Task"}, headers=headers)
    task_id = res.json()["id"]

    patch_data = {"description": "Newly updated description"}
    res = await client.patch(f"/tasks/{task_id}", json=patch_data, headers=headers)
    assert res.status_code == 200
    updated = res.json()
    assert updated["description"] == "Newly updated description"
    assert updated["title"] == "Patchable Task" 

@pytest.mark.asyncio
async def test_patch_task_invalid_data(client, test_user):
    headers = auth_headers(test_user["token"])

    res = await client.post("/tasks", json={"title": "Invalid Patch"}, headers=headers)
    task_id = res.json()["id"]

    res = await client.patch(f"/tasks/{task_id}", json={"due_date": "not-a-date"}, headers=headers)
    assert res.status_code == 422

@pytest.mark.asyncio
async def test_delete_task_success(client, test_user):
    headers = auth_headers(test_user["token"])

    res = await client.post("/tasks", json={"title": "Delete Me"}, headers=headers)
    task_id = res.json()["id"]

    res = await client.delete(f"/tasks/{task_id}", headers=headers)
    assert res.status_code == 200
    assert res.json() == {"detail": f"Task {task_id} deleted."}

@pytest.mark.asyncio
async def test_delete_task_not_found(client, test_user):
    headers = auth_headers(test_user["token"])

    res = await client.delete("/tasks/999999", headers=headers)
    assert res.status_code == 404
    assert res.json()["detail"] == "Task not found or unauthorized"

@pytest.mark.asyncio
async def test_delete_task_unauthorized(client):
    res = await client.delete("/tasks/1")  
    assert res.status_code == 401

@pytest.mark.asyncio
async def test_get_task_analytics(client, test_user):
    headers = auth_headers(test_user["token"])

    res = await client.post("/tasks", json={"title": "Analytics Task 1"}, headers=headers)
    task_id = res.json()["id"]
    await client.patch(f"/tasks/{task_id}", json={"completed": True}, headers=headers)

    await client.post("/tasks", json={"title": "Analytics Task 2", "priority": "Medium"}, headers=headers)

    res = await client.get("/tasks/analytics", headers=headers)
    assert res.status_code == 200

    data = res.json()
    assert "total_tasks" in data
    assert "completed_tasks" in data
    assert "completion_rate" in data
    assert "high_priority" in data
    assert "medium_priority" in data
    assert "low_priority" in data

    assert data["total_tasks"] >= 2
    assert data["completed_tasks"] >= 1
    assert "%" in data["completion_rate"]


@pytest.mark.asyncio
async def test_get_task_analytics_unauthenticated(client):
    res = await client.get("/tasks/analytics")
    assert res.status_code == 401


