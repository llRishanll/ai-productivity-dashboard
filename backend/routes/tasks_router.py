from fastapi import APIRouter, Query, HTTPException,Depends, Request
from utils.security import oauth2_scheme,get_current_user
from schemas.task_schema import TaskIn, TaskOut
from crud.task_crud import update_task, delete_task, create_task, get_task_analytics
from schemas.task_schema import TaskUpdate
from sqlalchemy import desc, asc, or_ ,select, func, case, literal_column
from models.task import tasks
from database import database
from main import limiter
from logging_config import logger

router = APIRouter()

@router.post("/tasks", response_model=TaskOut)
@limiter.limit("10/minute;50/hour")
async def add_task(request: Request, task: TaskIn, token: str = Depends(oauth2_scheme)):
    user = await get_current_user(["user", "admin"], token=token)
    if not user:
        logger.warning("Unauthorized task creation attempt", ip=request.client.host)
        raise HTTPException(status_code=401, detail="User not authenticated")
    
    logger.info("Task creation initiated", user_id=user["id"], title=task.title)
    created_task = await create_task(task, user_id=user["id"])
    logger.info("Task created successfully", user_id=user["id"], task_id=created_task["id"])
    
    return created_task


@router.delete("/tasks/delete-completed")
@limiter.limit("5/minute;20/hour")
async def delete_completed_tasks(request: Request, token: str = Depends(oauth2_scheme)):
    user = await get_current_user(["user", "admin"], token=token)
    
    if not user:
        logger.warning("Unauthorized attempt to delete completed tasks", ip=request.client.host)
        raise HTTPException(status_code=401, detail="Not authenticated")
    
    logger.info("Delete completed tasks request received", user_id=user["id"])

    query = tasks.delete().where(
        (tasks.c.user_id == user["id"]) &
        (tasks.c.completed == True)
    )
    await database.execute(query)
    logger.info("Completed tasks deleted", user_id=user["id"])
    return {"message": "All completed tasks deleted."}


@router.get("/tasks", response_model=dict)
@limiter.limit("60/minute;300/hour")
async def read_tasks(
    request: Request,
    completed: bool | None = Query(None),
    priority: str | None = Query(None),
    sort_by: str | None = Query(None),
    order: str = Query("asc"),
    search: str | None = Query(None),
    limit: int = Query(10, ge=1),
    offset: int = Query(0, ge=0),
    token: str = Depends(oauth2_scheme),
):
    user = await get_current_user(["user", "admin"], token=token)

    logger.info("Fetching tasks", user_id=user["id"], filters={
        "completed": completed,
        "priority": priority,
        "search": search,
        "sort_by": sort_by,
        "order": order,
        "limit": limit,
        "offset": offset
    })

    user_id = user["id"]
    
    # Build the base WHERE clause and parameters
    where_parts = ["user_id = :user_id"]
    params = {"user_id": user_id}
    
    if completed is not None:
        where_parts.append("completed = :completed")
        params["completed"] = completed
        
    if priority:
        where_parts.append("priority = :priority")
        params["priority"] = priority
        
    if search:
        where_parts.append("(title ILIKE :search OR description ILIKE :search)")
        params["search"] = f"%{search}%"

    where_clause = " AND ".join(where_parts)
    
    # Build ORDER BY
    if sort_by == "priority":
        order_clause = f"""ORDER BY CASE 
            WHEN priority = 'High' THEN 1
            WHEN priority = 'Medium' THEN 2
            WHEN priority = 'Low' THEN 3
            ELSE 4
        END {order.upper()}"""
    else:
        column = "created_at"
        if sort_by in ["due_date", "created_at"]:
            column = sort_by
        order_clause = f"ORDER BY {column} {order.upper()}"

    # Execute count query
    count_sql = f"SELECT COUNT(*) FROM tasks WHERE {where_clause}"
    total_count = await database.fetch_val(count_sql, params)
    
    # Execute data query
    data_sql = f"""
        SELECT id, title, description, completed, user_id, due_date, priority, 
               recurring, recurring_until, calendar_event_id, created_at, updated_at
        FROM tasks 
        WHERE {where_clause}
        {order_clause}
        LIMIT :limit OFFSET :offset
    """
    
    params.update({"limit": limit, "offset": offset})
    results = await database.fetch_all(data_sql, params)
    task_list = [dict(r) for r in results]

    logger.info("Tasks fetched", user_id=user["id"], total=total_count, returned=len(task_list))

    return {
        "total_tasks": total_count,
        "limit": limit,
        "offset": offset,
        "tasks": task_list
    }


@router.patch("/tasks/{task_id}", response_model=TaskOut)
@limiter.limit("10/minute;50/hour")
async def patch_task(request: Request, task_id: int, task: TaskUpdate, token: str = Depends(oauth2_scheme)):
    user = await get_current_user(["user", "admin"], token=token)
    if not user:
        logger.warning("Unauthorized patch attempt", task_id=task_id, ip=request.client.host)
        raise HTTPException(status_code=401, detail="User not authenticated")

    logger.info("Patch request received", task_id=task_id, user_id=user["id"], update_data=task.model_dump())

    updated = await update_task(task_id, user["id"], task)

    if not updated:
        logger.warning("Patch failed - Task not found or unauthorized", task_id=task_id, user_id=user["id"])
        raise HTTPException(status_code=404, detail="Task not found or unauthorized")

    if updated["recurring"] and updated["completed"] is True:
        logger.info("Recurring task triggered", task_id=task_id, user_id=user["id"], recurring=updated["recurring"])

    logger.info("Task patched successfully", task_id=task_id, user_id=user["id"])
    return updated


@router.delete("/tasks/{task_id}")
@limiter.limit("10/minute;50/hour")
async def delete_task_route(request: Request, task_id: int, token: str = Depends(oauth2_scheme)):
    user = await get_current_user(["user", "admin"], token=token)
    if not user:
        logger.warning("Unauthorized task deletion attempt", ip=request.client.host, task_id=task_id)
        raise HTTPException(status_code=401, detail="Not logged in")

    deleted = await delete_task(task_id, user_id=user["id"])

    if not deleted:
        logger.warning("Task deletion failed - Not found or unauthorized", user_email=user["email"], task_id=task_id)
        raise HTTPException(status_code=404, detail="Task not found or unauthorized")

    logger.info("Task deleted successfully", user_email=user["email"], task_id=task_id, ip=request.client.host)
    return {"detail": f"Task {task_id} deleted."}


@router.get("/tasks/analytics")
@limiter.limit("10/minute;60/hour")
async def task_analytics(request: Request, token: str = Depends(oauth2_scheme)):
    user = await get_current_user(["user", "admin"], token=token)
    if not user:
        logger.warning("Unauthorized access to task analytics", ip=request.client.host)
        raise HTTPException(status_code=401, detail="Not logged in")
    
    analytics = await get_task_analytics(user_id=user["id"])
    if not analytics:
        logger.error("Failed to retrieve analytics", user_email=user["email"], ip=request.client.host)
        raise HTTPException(status_code=404, detail="Failed to retrieve analytics for this user")
    
    logger.info("Task analytics retrieved", user_email=user["email"], ip=request.client.host)
    return analytics
