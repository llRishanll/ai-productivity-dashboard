from fastapi import APIRouter, HTTPException, Body,Depends
from utils.security import oauth2_scheme,get_current_user
from schemas.task_schema import TaskIn, TaskOut
from crud.task_crud import create_task, get_all_tasks
from utils.ai import generate_task_from_text, prioritize_tasks, generate_daily_plan,summarize_tasks,generate_week_plan
from datetime import date,timedelta
from models.task import tasks
from database import database
from sqlalchemy import or_

router = APIRouter()

@router.post("/tasks/ai-generate", response_model=TaskOut)
async def ai_generate_task(token: str = Depends(oauth2_scheme), prompt: str = Body(...)):
    user = await get_current_user(token)
    if not user:
        raise HTTPException(status_code=401, detail="Not logged in")
    task = generate_task_from_text(prompt)
    if not task.get("title"):
        raise HTTPException(status_code=400, detail="AI could not extract task info")
    task_in = TaskIn(**task)
    return await create_task(task_in, user_id=user["id"])

@router.get("/tasks/ai-prioritize")
async def ai_prioritize(token: str = Depends(oauth2_scheme)):
    user = await get_current_user(token)
    if not user:
        raise HTTPException(status_code=401, detail="Not logged in")
    user_tasks = await get_all_tasks(user["id"])
    if not user_tasks:
        return {"message": "You have no tasks yet."}
    ai_response = prioritize_tasks(user_tasks)

    for item in ai_response:
        query = tasks.update().where(tasks.c.id == item["id"]).values(priority=item["priority"])
        await database.execute(query)

    return {"ai_plan": ai_response}

@router.get("/tasks/ai-daily-plan")
async def ai_daily_plan(token: str = Depends(oauth2_scheme)):
    user = await get_current_user(token)
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

@router.get("/tasks/ai-summary")
async def ai_summary(token: str = Depends(oauth2_scheme)):
    user = await get_current_user(token)
    if not user:
        raise HTTPException(status_code=401, detail="Not logged in")

    query = tasks.select().where(
        (tasks.c.user_id == user["id"]) & (tasks.c.completed == False)
    )
    pending_tasks = await database.fetch_all(query)
    if not pending_tasks:
        return {"summary": "You have no pending tasks. Great job!"}
    
    task_dicts = [dict(task) for task in pending_tasks]
    summary = summarize_tasks(task_dicts)
    return {"summary": summary}

@router.get("/tasks/ai-week-plan")
async def ai_week_plan(token: str = Depends(oauth2_scheme)):
    user = await get_current_user(token)
    if not user:
        raise HTTPException(status_code=401, detail="Not logged in")

    today = date.today()
    end_date = today + timedelta(days=7)

    query = tasks.select().where(
    (tasks.c.user_id == user["id"]) &
    (
        or_(
            (tasks.c.due_date >= today) & (tasks.c.due_date <= end_date),
            tasks.c.due_date.is_(None)
        )
    ) &
    (tasks.c.completed == False)
    )
    upcoming_tasks = await database.fetch_all(query)

    if not upcoming_tasks:
        return {"message": "You have no tasks scheduled for this week."}

    week_plan = generate_week_plan(upcoming_tasks)
    return {"week_plan": week_plan}