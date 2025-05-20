from openai import OpenAI
from datetime import date
import json
import os
from dotenv import load_dotenv

load_dotenv()

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

def prioritize_tasks(tasks: list[dict]) -> str:
    if not tasks:
        return "No tasks provided."
    
    task_text = "\n".join(
        f"- {task['title']}: {task['description']}" for task in tasks
    )
    prompt = (
    "You're a professional productivity assistant. The user has a list of tasks below.\n"
    "Your job is to:\n"
    "1. Analyze the tasks and rank them by urgency and importance\n"
    "2. Group them into high, medium, and low priority\n"
    "3. Provide a daily plan with time blocks for each group\n\n"
    f"Tasks:\n{task_text}\n\n"
    "Reply ONLY with:\n"
    "- A section for High Priority Tasks (with reasoning)\n"
    "- A section for Medium Priority Tasks\n"
    "- A section for Low Priority Tasks\n"
    "- A Suggested Daily Schedule broken into morning, afternoon, and evening\n\n"
    "Be clear and concise. Don't repeat the original task text unnecessarily."
)

    response = client.chat.completions.create(
        model = "gpt-3.5-turbo",
        messages = [{"role": "user", "content": prompt}],
        temperature = 0.7,
        max_tokens = 150,
    )
    return response.choices[0].message.content

def generate_task_from_text(prompt:str)->dict:
    today_str = date.today().isoformat()
    system_prompt = (
        "You are a task generation assistant. Your job is to create a task based on the user's input.\n"
        "Today's date is " + today_str + ".\n"
        "The task should include a title, description, and due date if applicable.\n"
        "If no due date is mentioned, omit that key.\n"
        "Reply ONLY with the task in JSON format:\n"
        "{\n"
        "  \"title\": \"Task Title\",\n"
        "  \"description\": \"Task Description\",\n"
        "  \"due_date\": \"YYYY-MM-DD\"\n"
        "}"
    )

    response = client.chat.completions.create(
        model = "gpt-3.5-turbo",
        messages = [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": prompt}
        ],
        temperature = 0.3,
        max_tokens = 150,
    )
    reply = response.choices[0].message.content
    try:
        return json.loads(reply)
    except json.JSONDecodeError:
        return {"title": prompt.strip()}
    
def generate_daily_plan(tasks: list[dict]) -> str:
    if not tasks:
        return "You have no tasks due today."

    task_list = "\n".join(
        f"- {t['title']}: {t['description']}" for t in tasks
    )

    prompt = (
        f"Today is {date.today().isoformat()}.\n"
        "Here is a list of tasks due today. Based on urgency, context, and common sense, "
        "do the following:\n"
        "1. Prioritize them (High, Medium, Low)\n"
        "2. Provide a clear schedule broken into morning, afternoon, and evening along with relevant time allocation and estimates\n\n"
        f"Tasks:\n{task_list}\n\n"
        "Format it as:\n\n"
        "**High Priority**\n- ...\n\n**Medium Priority**\n- ...\n\n**Schedule**\n- Morning: ...\n"
    )

    response = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[{"role": "user", "content": prompt}],
        temperature=0.5,
    )

    return response.choices[0].message.content