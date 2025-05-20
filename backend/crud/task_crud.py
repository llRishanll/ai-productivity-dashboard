from models.task import tasks
from database import database
from schemas.task_schema import TaskIn,TaskUpdate

async def create_task(task: TaskIn, user_id: int):
    query = tasks.insert().values(
        title=task.title,
        description=task.description,
        completed=False,
        user_id=user_id,
        due_date=task.due_date,
    )
    task_id = await database.execute(query)
    return {**task.model_dump(), "id": task_id, "completed": False}

async def get_all_tasks(user_id: int):
    query = tasks.select().where(tasks.c.user_id == user_id)
    return await database.fetch_all(query)

async def update_task(task_id: int, user_id: int, data: TaskUpdate):
    # Ensure the task exists and belongs to the user
    query = tasks.select().where((tasks.c.id == task_id) & (tasks.c.user_id == user_id))
    task = await database.fetch_one(query)
    if not task:
        return None  # Not found or unauthorized
    update_data = {k: v for k, v in data.model_dump().items() if v is not None} # Filter out None values to only update provided fields
    update_query = tasks.update().where(tasks.c.id == task_id).values(**update_data)
    await database.execute(update_query)
    return {**dict(task), **update_data}

async def delete_task(task_id: int, user_id: int):
    # Ensure the task exists and belongs to the user
    query = tasks.select().where((tasks.c.id == task_id) & (tasks.c.user_id == user_id))
    task = await database.fetch_one(query)
    if not task:
        return None
    delete_query = tasks.delete().where(tasks.c.id == task_id)
    await database.execute(delete_query)
    return True
