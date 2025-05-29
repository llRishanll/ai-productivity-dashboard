from openai import OpenAI
from datetime import date
import json,os,re
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
    "You're a productivity assistant. The user has a list of tasks below.\n"
        "Classify each task as High, Medium, or Low priority based on urgency and importance.\n"
        "Respond in the following JSON format (use task titles as keys):\n"
        "{\n"
        "  \"Go to gym\": \"High\",\n"
        "  \"Buy groceries\": \"Low\"\n"
        "}\n\n"
        f"Tasks:\n{task_text}"
)

    response = client.chat.completions.create(
        model = "gpt-3.5-turbo",
        messages = [{"role": "user", "content": prompt}],
        temperature = 0.7,
        max_tokens = 300,
    )

    try:
        priority_map = json.loads(response.choices[0].message.content)
    except json.JSONDecodeError:
        priority_map = {}
        for line in response.choices[0].message.content.splitlines():
            match = re.match(r'^\s*"(.+?)"\s*:\s*"?(High|Medium|Low)"?', line)
            if match:
                priority_map[match.group(1)] = match.group(2)

    result = []
    for task in tasks:
        title = task["title"]
        key = f'{task["title"]}: {task["description"]}'
        if key in priority_map:
            result.append({
                "id": task["id"],
                "priority": priority_map[key]
            })

    return result

def generate_task_from_text(prompt:str)->dict:
    today_str = date.today().isoformat()
    system_prompt = (
        "You are a task generation assistant. Your job is to create a task based on the user's input.\n"
        "Today's date is " + today_str + ".\n"
        "The task should include a title, description, due date, recurring and recurring_until if applicable.\n"
        "If no due date is mentioned, assign today's date.\n"
        "If no recurring is mentioned, omit that key.\n"
        "If no recurring_until is mentioned, omit that key.\n"
        "Reply ONLY with the task in JSON format:\n"
        "{\n"
        "  \"title\": \"Task Title\",\n"
        "  \"description\": \"Task Description\",\n"
        "  \"due_date\": \"YYYY-MM-DD\"\n"
        "  \"recurring\": \"daily\",\"weekly\" or \"none\"\n"
        "  \"recurring_until\": \"YYYY-MM-DD\"\n"
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

def summarize_tasks(tasks):
    if not tasks:
        return "You currently have no pending tasks."

    task_descriptions = []
    for task in tasks:
        desc = f"- {task['title']}"
        if task.get('description'):
            desc += f": {task['description']}"
        if task.get('due_date'):
            desc += f" (Due: {task['due_date']})"
        task_descriptions.append(desc)

    prompt = (
        "You are a productivity assistant. Summarize the following tasks into a single paragraph "
        "that helps the user understand their current workload and what to focus on:\n\n"
        + "\n".join(task_descriptions)
        + "\n\nSummary:"
    )

    try:
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",  
            messages=[
                {"role": "system", "content": "You are a helpful assistant."},
                {"role": "user", "content": prompt},
            ],
            max_tokens=150,
            temperature=0.7,
        )
        summary = response.choices[0].message.content.strip()
        return summary
    except Exception as e:
        print("AI Summary Error:", e)
        return "An error occurred while generating the summary."

def generate_week_plan(tasks):
    if not tasks:
        return "No tasks found for the upcoming week."

    today = date.today().strftime("%A, %B %d, %Y")
    task_text = ""
    for task in tasks:
        title = task["title"]
        desc = task["description"]
        due = task["due_date"]
        due_str = f"Due date: {due}" if due else ""
        task_text += f"- Title: {title}\n  Description: {desc}\n  {due_str}\n\n"

    prompt = (
        f"Today is {today}.\n"
        "You are a productivity assistant.\n"
        "Below is a list of tasks of a user. Each task includes a title, a description, and sometimes a due date.\n\n"
        f"Create an organized weekly plan ({today} to Sunday) for the user based on urgency, importance, due date and description.\n"
        "DO NOT put tasks in days that have already passed.\n"
        "DO NOT repeat tasks if already assigned to a day.\n"
        "State upcoming days with no tasks and as free day."
        "Return the response in the following format with all 7 days of the week:\n"
        "- Monday:\n  - Task \n- Tuesday:\n  - Task \n...\n\n"
        "TASKS:\n"
        f"{task_text}"
    )

    try:
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[{"role": "user", "content": prompt}],
            max_tokens=500,
            temperature=0.7
        )
        return response.choices[0].message.content.strip()
    except Exception as e:
        return f"Failed to generate weekly plan: {e}"