from fastapi import APIRouter, Request, HTTPException, Body
from schemas.task_schema import TaskIn, TaskOut
from crud.task_crud import create_task, get_all_tasks
from utils.ai import generate_task_from_text, prioritize_tasks, generate_daily_plan
from datetime import date
from models.task import tasks
from database import database
import asyncio

router = APIRouter()

@router.post("/tasks/ai-generate", response_model=TaskOut)
async def ai_generate_task(request: Request, prompt: str = Body(...)):
    user = request.session.get("user")
    if not user:
        raise HTTPException(status_code=401, detail="Not logged in")
    today = str(date.today())
    usage_data = request.session.get("ai_usage", {})
    if usage_data.get("date") == today:
        if usage_data.get("count", 0) >= 2:
            raise HTTPException(status_code=429, detail="AI usage limit reached for today.")
        usage_data["count"] += 1
    else:
        usage_data = {"date": today, "count": 1}
    request.session["ai_usage"] = usage_data

    task = generate_task_from_text(prompt)
    if not task.get("title"):
        raise HTTPException(status_code=400, detail="AI could not extract task info")
    task_in = TaskIn(**task)
    return await create_task(task_in, user_id=user["id"])

@router.get("/tasks/ai-prioritize")
def ai_prioritize(request: Request):
    user = request.session.get("user")
    if not user:
        raise HTTPException(status_code=401, detail="Not logged in")
    tasks = asyncio.run(get_all_tasks(user["id"]))
    if not tasks:
        return {"message": "You have no tasks yet."}
    ai_response = prioritize_tasks(tasks)
    return {"ai_plan": ai_response}

@router.get("/tasks/ai-daily-plan")
async def ai_daily_plan(request: Request):
    user = request.session.get("user")
    if not user:
        raise HTTPException(status_code=401, detail="Not logged in")
    today = date.today()
    query = tasks.select().where(
        (tasks.c.user_id == user["id"]) & (tasks.c.due_date == today)
    )
    today_tasks = await database.fetch_all(query)
    if not today_tasks:
        return {"message": "No tasks due today."}
    plan = generate_daily_plan(today_tasks)
    return {"plan": plan}