from fastapi import APIRouter, Depends, HTTPException
from utils.security import oauth2_scheme, get_current_user
from models.user import users
from models.task import tasks
from database import database
from sqlalchemy import select, func, or_
from datetime import datetime

router = APIRouter()

@router.get("/admin/users")
async def get_all_users(
    search: str = None,
    role: str = None,
    is_verified: bool = None,
    sort_by: str = "created_at",
    order: str = "desc",
    limit: int = 10,
    offset: int = 0,
    token: str = Depends(oauth2_scheme)
):
    current_user = await get_current_user(["admin"], token=token)

    query = select(users)

    if search:
        query = query.where(
            or_(
                users.c.email.ilike(f"%{search}%"),
                users.c.name.ilike(f"%{search}%")
            )
        )

    if role:
        query = query.where(users.c.role == role)

    if is_verified is not None:
        query = query.where(users.c.is_verified == is_verified)

    if sort_by in users.c:
        column = users.c[sort_by]
        query = query.order_by(column.desc() if order == "desc" else column.asc())

    query = query.limit(limit).offset(offset)

    total_query = select(func.count()).select_from(query.alias("filtered_users"))

    results = await database.fetch_all(query)
    total = await database.fetch_val(total_query)

    return {
        "total_users": total,
        "limit": limit,
        "offset": offset,
        "users": results
    }



@router.delete("/admin/users/{user_id}")
async def delete_user(user_id: int, token: str = Depends(oauth2_scheme)):
    current_user = await get_current_user(["admin"], token=token)

    query = select(users).where(users.c.id == user_id)
    user_to_delete = await database.fetch_one(query)

    if user_to_delete is None:
        raise HTTPException(status_code=404, detail="User not found")

    delete_query = users.delete().where(users.c.id == user_id)
    await database.execute(delete_query)

    return {"detail": f"User {user_id} deleted successfully"}

@router.get("/admin/stats")
async def get_stats(token: str = Depends(oauth2_scheme)):
    current_user = await get_current_user(["admin"], token=token)

    user_count = await database.fetch_val(select(func.count()).select_from(users))
    task_count = await database.fetch_val(select(func.count()).select_from(tasks))

    return {
        "total_users": user_count,
        "total_tasks": task_count
    }

@router.post("/admin/promote/{user_id}")
async def promote_user_to_admin(
    user_id: int,
    token: str = Depends(oauth2_scheme)
):
    current_user = await get_current_user(["admin"], token=token)

    query = select(users).where(users.c.id == user_id)
    user_to_promote = await database.fetch_one(query)

    if not user_to_promote:
        raise HTTPException(status_code=404, detail="User not found")
    if user_to_promote["role"] == "admin":
        raise HTTPException(status_code=400, detail="User is already an admin")
    update_query = users.update().where(users.c.id == user_id).values(
        role="admin",
        updated_at=datetime.utcnow()
    )
    await database.execute(update_query)

    return {"detail": f"User {user_id} promoted to admin"}
