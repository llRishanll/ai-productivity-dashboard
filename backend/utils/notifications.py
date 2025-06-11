import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from datetime import date
from database import database
from models.user import users 
from models.task import tasks
from jinja2 import Environment, FileSystemLoader
from pathlib import Path
import os
from dotenv import load_dotenv
load_dotenv(dotenv_path=Path(__file__).parent.parent / ".env")

TEMPLATES_DIR = Path(__file__).parent.parent / "templates"
env = Environment(loader=FileSystemLoader(TEMPLATES_DIR))

def render_template(template_name: str, context: dict) -> str:
    template = env.get_template(template_name)
    return template.render(context)

def send_email(to_email: str, tasks: list[dict]):
    if not tasks:
        return 
    
    subject = "📅 Your Tasks Due Today"
    task_lines = "\n".join([f"- {t['title']}: {t['description']}" for t in tasks])
    body = f"Hi there,\n\nHere are your tasks due today:\n\n{task_lines}\n\nStay productive!"
    msg = MIMEMultipart()
    msg['From'] = os.getenv("EMAIL_USER")   
    msg['To'] = to_email
    msg['Subject'] = subject
    msg.attach(MIMEText(body, 'plain'))

    server = smtplib.SMTP(os.getenv("EMAIL_HOST"), int(os.getenv("EMAIL_PORT", 587)))
    server.starttls()
    server.login(os.getenv("EMAIL_USER"), os.getenv("EMAIL_PASS"))
    server.send_message(msg)
    server.quit()

async def send_daily_reminders():
    today = date.today()
    query = (tasks.select().where(tasks.c.due_date == today))
    due_today = await database.fetch_all(query)
    user_tasks = {}
    for task in due_today:
        uid = task["user_id"]
        user_tasks.setdefault(uid, []).append(task)

    for user_id, task_list in user_tasks.items():
        user_query = users.select().where(users.c.id == user_id)
        user = await database.fetch_one(user_query)
        if user and user["email"]:
            send_email(user["email"], task_list)


def send_verification_email(email: str, token: str):
    verification_url = f"{os.getenv('FRONTEND_URL')}/verify-email?token={token}"
    subject = "Verify your email"
    body = f"Click the link to verify your account: {verification_url}"

    msg = MIMEMultipart()
    msg['From'] = os.getenv("EMAIL_USER")
    msg['To'] = email
    msg['Subject'] = subject
    msg.attach(MIMEText(render_template("verify_email.html", {"verification_url": verification_url}), 'html'))

    server = smtplib.SMTP(os.getenv("EMAIL_HOST"), int(os.getenv("EMAIL_PORT")))
    server.starttls()
    server.login(os.getenv("EMAIL_USER"), os.getenv("EMAIL_PASS"))
    server.send_message(msg)
    server.quit()