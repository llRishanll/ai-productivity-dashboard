from fastapi import APIRouter, Query, HTTPException,Depends, Request
from utils.security import oauth2_scheme,get_current_user
from schemas.task_schema import TaskIn, TaskOut
from crud.task_crud import update_task, delete_task, create_task, get_task_analytics
from schemas.task_schema import TaskUpdate
from sqlalchemy import desc, asc, or_ 
from models.task import tasks
from database import database
from main import limiter

router = APIRouter()

@router.post("/tasks", response_model=TaskOut)
@limiter.limit("10/minute")
async def add_task(request: Request, task: TaskIn, token: str = Depends(oauth2_scheme)):
    user = await get_current_user(token)
    if not user:
        raise HTTPException(status_code=401, detail="User not authenticated")
    return await create_task(task, user_id=user["id"])

@router.delete("/tasks/delete-completed")
@limiter.limit("5/minute")
async def delete_completed_tasks(request: Request, token: str = Depends(oauth2_scheme)):
    user = await get_current_user(token)
    if not user:
        raise HTTPException(status_code=401, detail="Not authenticated")
    
    query = tasks.delete().where(
        (tasks.c.user_id == user["id"]) &
        (tasks.c.completed == True)
    )
    await database.execute(query)
    return {"message": "All completed tasks deleted."}

@router.get("/tasks", response_model=list[TaskOut])
@limiter.limit("20/minute")
async def read_tasks(
    request: Request,
    completed: bool | None = Query(None),
    priority: str | None = Query(None),
    sort_by: str | None = Query(None),
    order: str = Query("asc"),
    search: str | None = Query(None),
    token: str = Depends(oauth2_scheme)
    ):
    user = await get_current_user(token)

    query = tasks.select().where(tasks.c.user_id == user["id"])

    if completed is not None:
        query = query.where(tasks.c.completed == completed)

    if priority:
        query = query.where(tasks.c.priority == priority)

    if search:
        query = query.where(
            or_(
                tasks.c.title.ilike(f"%{search}%"),
                tasks.c.description.ilike(f"%{search}%")
            )
        )

    if sort_by:
        sort_column = tasks.c.due_date if sort_by == "due_date" else tasks.c.priority
        query = query.order_by(asc(sort_column) if order == "asc" else desc(sort_column))

    results = await database.fetch_all(query)
    return results

@router.patch("/tasks/{task_id}", response_model=TaskOut)
@limiter.limit("10/minute")
async def patch_task(request: Request, task_id: int, task: TaskUpdate, token: str = Depends(oauth2_scheme)):
    user = await get_current_user(token)
    if not user:
        raise HTTPException(status_code=401, detail="User not authenticated")
    updated = await update_task(task_id, user["id"], task)
    if not updated:
        raise HTTPException(status_code=404, detail="Task not found or unauthorized")
    return updated

@router.delete("/tasks/{task_id}")
@limiter.limit("10/minute")
async def delete_task_route(request: Request, task_id: int, token: str = Depends(oauth2_scheme)):
    user = await get_current_user(token)
    if not user:
        raise HTTPException(status_code=401, detail="Not logged in")
    deleted = await delete_task(task_id, user_id=user["id"])
    if not deleted:
        raise HTTPException(status_code=404, detail="Task not found or unauthorized")
    return {"detail": f"Task {task_id} deleted."}

@router.get("/tasks/analytics")
@limiter.limit("10/minute")
async def task_analytics(request: Request, token:str = Depends(oauth2_scheme)):
    user = await get_current_user(token)
    if not user:
        raise HTTPException(status_code=401, detail="Not logged in")
    
    analytics = await get_task_analytics(user_id=user["id"])
    if not analytics:
        raise HTTPException(status_code=404, detail="Failed to retrieve analytics for this user")
    return analytics