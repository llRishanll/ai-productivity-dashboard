from fastapi import APIRouter, HTTPException, Body,Depends,Request
from utils.security import oauth2_scheme,get_current_user
from schemas.task_schema import TaskIn, TaskOut
from crud.task_crud import create_task, get_all_tasks
from utils.ai import generate_task_from_text, prioritize_tasks, generate_daily_plan, summarize_tasks,generate_week_plan
from datetime import date,timedelta
from models.task import tasks
from database import database
from sqlalchemy import or_
from main import limiter
from logging_config import logger

router = APIRouter()

@router.post("/tasks/ai-generate", response_model=TaskOut)
@limiter.limit("6/minute;30/hour")
async def ai_generate_task(request: Request, token: str = Depends(oauth2_scheme), prompt: str = Body(...)):
    user = await get_current_user(["user", "admin"], token=token)
    if not user:
        logger.warning("Unauthorized AI generate attempt", ip=request.client.host)
        raise HTTPException(status_code=401, detail="Not logged in")

    logger.info("AI task generation attempt", user_email=user["email"], prompt_preview=prompt[:50])
    
    task = generate_task_from_text(prompt)
    if not task.get("title"):
        logger.error("AI failed to generate task", user_email=user["email"], prompt=prompt)
        raise HTTPException(status_code=400, detail="AI could not extract task info")

    task_in = TaskIn(**task)
    created_task = await create_task(task_in, user_id=user["id"])

    logger.info("AI-generated task created", user_email=user["email"], task_title=created_task.get("title"))
    return created_task


@router.get("/tasks/ai-prioritize")
@limiter.limit("3/minute;10/hour")
async def ai_prioritize(request: Request, token: str = Depends(oauth2_scheme)):
    user = await get_current_user(["user", "admin"], token=token)
    if not user:
        logger.warning("Unauthorized AI prioritize attempt", ip=request.client.host)
        raise HTTPException(status_code=401, detail="Not logged in")

    logger.info("AI prioritize requested", user_email=user["email"])
    
    user_tasks = await get_all_tasks(user["id"])
    if not user_tasks:
        logger.info("No tasks found for prioritization", user_email=user["email"])
        return {"message": "You have no tasks yet."}

    ai_response = prioritize_tasks(user_tasks)

    for item in ai_response:
        query = tasks.update().where(tasks.c.id == item["id"]).values(priority=item["priority"])
        await database.execute(query)

    logger.info("AI prioritized tasks", user_email=user["email"], updated_count=len(ai_response))
    return {"Updated priorities": ai_response}


@router.get("/tasks/ai-daily-plan")
@limiter.limit("3/minute;10/hour")
async def ai_daily_plan(request: Request, token: str = Depends(oauth2_scheme)):
    user = await get_current_user(["user", "admin"], token=token)
    if not user:
        logger.warning("Unauthorized access to AI daily plan", ip=request.client.host)
        raise HTTPException(status_code=401, detail="Not logged in")

    today = date.today()
    logger.info("AI daily plan requested", user_email=user["email"], date=str(today))

    query = tasks.select().where(
        (tasks.c.user_id == user["id"]) & (tasks.c.due_date == today)
    )
    today_tasks = await database.fetch_all(query)

    if not today_tasks:
        logger.info("No tasks due today", user_email=user["email"])
        return {"message": "No tasks due today."}

    plan = generate_daily_plan(today_tasks)
    logger.info("Generated AI daily plan", user_email=user["email"], task_count=len(today_tasks))
    return {"plan": plan}


@router.get("/tasks/ai-summary")
@limiter.limit("5/minute;30/hour")
async def ai_summary(request: Request, token: str = Depends(oauth2_scheme)):
    user = await get_current_user(["user", "admin"], token=token)
    if not user:
        logger.warning("Unauthorized access to AI summary", ip=request.client.host)
        raise HTTPException(status_code=401, detail="Not logged in")

    logger.info("AI task summary requested", user_email=user["email"])

    query = tasks.select().where(
        (tasks.c.user_id == user["id"]) & (tasks.c.completed == False)
    )
    pending_tasks = await database.fetch_all(query)

    if not pending_tasks:
        logger.info("No pending tasks found", user_email=user["email"])
        return {"message": "You have no pending tasks. Great job!"}

    task_dicts = [dict(task) for task in pending_tasks]
    summary = summarize_tasks(task_dicts)

    logger.info("AI summary generated", user_email=user["email"], task_count=len(task_dicts))
    return {"summary": summary}


@router.get("/tasks/ai-week-plan")
@limiter.limit("2/minute;5/hour")
async def ai_week_plan(request: Request, token: str = Depends(oauth2_scheme)):
    user = await get_current_user(["user", "admin"], token=token)
    if not user:
        logger.warning("Unauthorized access to AI week plan", ip=request.client.host)
        raise HTTPException(status_code=401, detail="Not logged in")

    logger.info("AI weekly plan requested", user_email=user["email"])

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
        logger.info("No tasks for the upcoming week", user_email=user["email"])
        return {"message": "You have no tasks scheduled for this week."}

    week_plan = generate_week_plan(upcoming_tasks)
    logger.info("AI week plan generated", user_email=user["email"], task_count=len(upcoming_tasks))
    return {"week_plan": week_plan}
