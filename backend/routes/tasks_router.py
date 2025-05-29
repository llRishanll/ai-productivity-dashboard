from fastapi import APIRouter, Query, HTTPException,Depends
from utils.security import oauth2_scheme,get_current_user
from schemas.task_schema import TaskIn, TaskOut
from crud.task_crud import create_task
from crud.task_crud import update_task, delete_task
from schemas.task_schema import TaskUpdate
from sqlalchemy import desc, asc
from models.task import tasks
from database import database

router = APIRouter()

@router.post("/tasks", response_model=TaskOut)
async def add_task(task: TaskIn, token: str = Depends(oauth2_scheme)):
    user = await get_current_user(token)
    if not user:
        raise HTTPException(status_code=401, detail="User not authenticated")
    return await create_task(task, user_id=user["id"])

@router.get("/tasks", response_model=list[TaskOut])
async def read_tasks(
    completed: bool | None = Query(None),
    priority: str | None = Query(None),
    sort_by: str | None = Query(None),
    order: str = Query("asc"),
    token: str = Depends(oauth2_scheme)
    ):
    user = await get_current_user(token)

    query = tasks.select().where(tasks.c.user_id == user["id"])

    if completed is not None:
        query = query.where(tasks.c.completed == completed)

    if priority:
        query = query.where(tasks.c.priority == priority)

    if sort_by:
        sort_column = tasks.c.due_date if sort_by == "due_date" else tasks.c.priority
        query = query.order_by(asc(sort_column) if order == "asc" else desc(sort_column))

    results = await database.fetch_all(query)
    return results

@router.patch("/tasks/{task_id}", response_model=TaskOut)
async def patch_task(task_id: int, task: TaskUpdate, token: str = Depends(oauth2_scheme)):
    user = await get_current_user(token)
    if not user:
        raise HTTPException(status_code=401, detail="User not authenticated")
    updated = await update_task(task_id, user["id"], task)
    if not updated:
        raise HTTPException(status_code=404, detail="Task not found or unauthorized")
    return updated

@router.delete("/tasks/{task_id}")
async def delete_task_route(task_id: int, token: str = Depends(oauth2_scheme)):
    user = await get_current_user(token)
    if not user:
        raise HTTPException(status_code=401, detail="Not logged in")
    deleted = await delete_task(task_id, user_id=user["id"])
    if not deleted:
        raise HTTPException(status_code=404, detail="Task not found or unauthorized")
    return {"detail": f"Task {task_id} deleted."}

@router.delete("/tasks/completed")
async def delete_completed_tasks(token: str = Depends(oauth2_scheme)):
    user = await get_current_user(token)
    if not user:
        raise HTTPException(status_code=401, detail="Not authenticated")
    
    query = tasks.delete().where(
        (tasks.c.user_id == user["id"]) &
        (tasks.c.completed == True)
    )
    await database.execute(query)
    return {"message": "All completed tasks deleted."}
