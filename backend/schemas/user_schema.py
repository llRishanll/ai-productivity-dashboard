from pydantic import BaseModel, EmailStr

class UserCreate(BaseModel):
    email: str
    name: str
    picture: str

class UserSignup(BaseModel):
    name: str
    email: EmailStr
    password: str
