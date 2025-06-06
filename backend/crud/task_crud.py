from models.task import tasks
from database import database
from datetime import timedelta, date, datetime
from schemas.task_schema import TaskIn,TaskUpdate
from sqlalchemy import func, select, case

async def create_task(task: TaskIn, user_id: int):
    query = tasks.insert().values(
        title=task.title,
        description=task.description,
        completed=False,
        user_id=user_id,
        due_date=task.due_date,
        priority=task.priority,
        recurring=task.recurring,
        recurring_until=task.recurring_until
    )
    task_id = await database.execute(query)
    return {**task.model_dump(),"user_id": user_id, "id": task_id, "completed": False}

async def get_all_tasks(user_id: int):
    query = tasks.select().where(tasks.c.user_id == user_id)
    return await database.fetch_all(query)

async def update_task(task_id: int, user_id: int, data: TaskUpdate):
    query = tasks.select().where((tasks.c.id == task_id) & (tasks.c.user_id == user_id))
    task = await database.fetch_one(query)
    if not task:
        return None  
    update_data = data.model_dump(exclude_unset=True) 
    update_query = tasks.update().where(tasks.c.id == task_id).values(**update_data)
    await database.execute(update_query)
    
    if (
        update_data.get("completed") == True
        and task["completed"] == False
        and task["recurring"] != "none"
        and task["due_date"]
    ):
        next_due = None
        if task["recurring"] == "daily":
            next_due = task["due_date"] + timedelta(days=1)
        elif task["recurring"] == "weekly":
            next_due = task["due_date"] + timedelta(weeks=1)

        if next_due and (not task["recurring_until"] or next_due <= task["recurring_until"]):
            new_task = {
                "title": task["title"],
                "description": task["description"],
                "completed": False,
                "user_id": user_id,
                "due_date": next_due,
                "priority": task["priority"],
                "recurring": task["recurring"],
                "recurring_until": task["recurring_until"]
            }
            insert_query = tasks.insert().values(**new_task)
            await database.execute(insert_query)
    query = tasks.select().where(tasks.c.id == task_id)
    updated_task = await database.fetch_one(query)
    return updated_task

async def delete_task(task_id: int, user_id: int):
    query = tasks.select().where((tasks.c.id == task_id) & (tasks.c.user_id == user_id))
    task = await database.fetch_one(query)
    if not task:
        return None
    delete_query = tasks.delete().where(tasks.c.id == task_id)
    await database.execute(delete_query)
    return True

async def get_task_analytics(user_id:int):
    total_query = select(func.count()).select_from(tasks).where(tasks.c.user_id == user_id)
    completed_query = select(func.count()).select_from(tasks).where(
        (tasks.c.user_id == user_id) & (tasks.c.completed == True)
    ) 
    priority_query = select(
        func.count(case((tasks.c.priority == "High", 1))).label("High"),
        func.count(case((tasks.c.priority == "Medium", 1))).label("Medium"),
        func.count(case((tasks.c.priority == "Low", 1))).label("Low")
    )
    total = await database.fetch_val(total_query)
    completed = await database.fetch_val(completed_query)
    priority_count = await database.fetch_one(priority_query)

    completion_rate = f"{(completed/total * 100):.0f}%" if total > 0 else "0%"

    return{
        "total_tasks": total,
        "completed_tasks": completed,
        "completion_rate": completion_rate,
        "high_priority": priority_count["High"],
        "medium_priority": priority_count["Medium"],
        "low_priority": priority_count["Low"]
    }