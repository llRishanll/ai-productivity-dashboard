from fastapi import APIRouter, Request, HTTPException
from schemas.task_schema import TaskIn, TaskOut
from crud.task_crud import create_task, get_all_tasks
from crud.task_crud import update_task, delete_task
from schemas.task_schema import TaskUpdate

router = APIRouter()

@router.post("/tasks", response_model=TaskOut)
async def add_task(task: TaskIn, request: Request):
    user = request.session.get("user")
    if not user:
        raise HTTPException(status_code=401, detail="User not authenticated")
    return await create_task(task, user_id=user["id"])

@router.get("/tasks", response_model=list[TaskOut])
async def read_tasks(request: Request):
    user = request.session.get("user")
    if not user:
        raise HTTPException(status_code=401, detail="User not authenticated")
    return await get_all_tasks(user_id=user["id"])

@router.patch("/tasks/{task_id}", response_model=TaskOut)
async def patch_task(task_id: int, task: TaskUpdate, request: Request):
    user = request.session.get("user")
    if not user:
        raise HTTPException(status_code=401, detail="User not authenticated")
    updated = await update_task(task_id, user["id"], task)
    if not updated:
        raise HTTPException(status_code=404, detail="Task not found or unauthorized")
    return updated

@router.delete("/tasks/{task_id}")
async def delete_task_route(task_id: int, request: Request):
    user = request.session.get("user")
    if not user:
        raise HTTPException(status_code=401, detail="Not logged in")
    deleted = await delete_task(task_id, user_id=user["id"])
    if not deleted:
        raise HTTPException(status_code=404, detail="Task not found or unauthorized")
    return {"detail": f"Task {task_id} deleted."}