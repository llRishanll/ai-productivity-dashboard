from fastapi import APIRouter, Depends, HTTPException
from utils.security import oauth2_scheme, get_current_user
from models.user import users
from models.task import tasks
from database import database
from sqlalchemy import select, func, or_
from datetime import datetime, timezone
from fastapi import Request
from logging_config import logger

router = APIRouter()

@router.get("/admin/users")
async def get_all_users(
    request: Request,
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

    logger.info(
        "Admin fetched user list",
        admin_email=current_user["email"],
        filters={"search": search, "role": role, "is_verified": is_verified},
        sort_by=sort_by,
        order=order,
        limit=limit,
        offset=offset,
        returned=len(results),
        total_matching=total,
        ip=request.client.host
    )

    return {
        "total_users": total,
        "limit": limit,
        "offset": offset,
        "users": results
    }


@router.delete("/admin/users/{user_id}")
async def delete_user(request: Request, user_id: int, token: str = Depends(oauth2_scheme)):
    current_user = await get_current_user(["admin"], token=token)

    query = select(users).where(users.c.id == user_id)
    user_to_delete = await database.fetch_one(query)

    if user_to_delete is None:
        logger.warning(
            "Admin attempted to delete non-existent user",
            admin_email=current_user["email"],
            target_user_id=user_id,
            ip=request.client.host
        )
        raise HTTPException(status_code=404, detail="User not found")

    delete_query = users.delete().where(users.c.id == user_id)
    await database.execute(delete_query)

    logger.info(
        "Admin deleted user",
        admin_email=current_user["email"],
        deleted_user_id=user_id,
        deleted_email=user_to_delete["email"],
        ip=request.client.host
    )

    return {"detail": f"User {user_id} deleted successfully"}


@router.get("/admin/stats")
async def get_stats(request: Request, token: str = Depends(oauth2_scheme)):
    current_user = await get_current_user(["admin"], token=token)

    user_count = await database.fetch_val(select(func.count()).select_from(users))
    task_count = await database.fetch_val(select(func.count()).select_from(tasks))

    logger.info(
        "Admin accessed system stats",
        admin_email=current_user["email"],
        ip=request.client.host,
        user_count=user_count,
        task_count=task_count
    )

    return {
        "total_users": user_count,
        "total_tasks": task_count
    }


@router.post("/admin/promote/{user_id}")
async def promote_user_to_admin(
    request: Request,
    user_id: int,
    token: str = Depends(oauth2_scheme)
):
    current_user = await get_current_user(["admin"], token=token)

    query = select(users).where(users.c.id == user_id)
    user_to_promote = await database.fetch_one(query)

    if not user_to_promote:
        logger.warning("Promotion failed - User not found", admin=current_user["email"], user_id=user_id, ip=request.client.host)
        raise HTTPException(status_code=404, detail="User not found")

    if user_to_promote["role"] == "admin":
        logger.info("Promotion skipped - User already admin", admin=current_user["email"], user_id=user_id, ip=request.client.host)
        raise HTTPException(status_code=400, detail="User is already an admin")

    update_query = users.update().where(users.c.id == user_id).values(
        role="admin",
        updated_at=datetime.now(timezone.utc)
    )
    await database.execute(update_query)

    logger.info("User promoted to admin", promoted_user_id=user_id, admin=current_user["email"], ip=request.client.host)

    return {"detail": f"User {user_id} promoted to admin"}

