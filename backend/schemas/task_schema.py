from pydantic import BaseModel
from typing import Optional
from datetime import date

class TaskIn(BaseModel):
    title: str
    description: Optional[str] = None
    due_date: Optional[date] = None
    priority: Optional[str] = None
    recurring: Optional[str] = "none"  
    recurring_until: Optional[date] = date(2999, 1, 1)

class TaskOut(BaseModel):
    id: int
    user_id: int
    title: str
    description: Optional[str] = None
    due_date: Optional[date] = None
    priority: Optional[str] = None
    recurring: Optional[str] = "none"  
    recurring_until: Optional[date] = date(2999, 1, 1)
    completed: bool
    
class TaskUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    due_date: Optional[date] = None
    priority: Optional[str] = None
    completed: Optional[bool] = None
    recurring: Optional[str] = None

