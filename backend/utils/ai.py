from openai import OpenAI
from datetime import date
import json,os,re
from dotenv import load_dotenv

load_dotenv()

def get_openai_client():
    from os import getenv
    return OpenAI(api_key=getenv("OPENAI_API_KEY"))

def prioritize_tasks(tasks: list[dict]) -> str:
    if not tasks:
        return "No tasks provided."

    client = get_openai_client()
    task_text = "\n".join(
        f"- {task['title']}: {task['description']}" for task in tasks
    )

    prompt = (
    "You are a productivity AI assistant. Your task is to analyze the user's task list "
    "and classify each task's priority as 'High', 'Medium', or 'Low'.\n\n"
    "Classification should be based on:\n"
    "- Urgency (e.g. due soon, time-sensitive)\n"
    "- Importance (e.g. critical for goals, impact level)\n\n"
    "Respond ONLY in valid JSON using this exact format:\n"
    "{\n"
    "  \"Task Title One\": \"High\",\n"
    "  \"Task Title Two\": \"Low\"\n"
    "}\n\n"
    "Input task list:\n"
    f"{task_text}"
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
    "You are a task generation assistant.\n"
    "Your role is to generate a structured task based on the user's input. Today’s date is "
    f"{today_str}.\n\n"
    "Rules:\n"
    "- Always include: 'title', 'description', and 'due_date'.\n"
    "- If a due date is missing, default to today's date.\n"
    "- Include 'recurring' and 'recurring_until' ONLY if the user input mentions repetition.\n"
    "- All dates must follow 'YYYY-MM-DD' format.\n\n"
    "Respond ONLY with a valid JSON object using this structure:\n"
    "{\n"
    "  \"title\": \"...\",\n"
    "  \"description\": \"...\",\n"
    "  \"due_date\": \"YYYY-MM-DD\",\n"
    "  \"recurring\": \"daily\" | \"weekly\" | \"none\",  // omit if not recurring\n"
    "  \"recurring_until\": \"YYYY-MM-DD\"               // omit if not provided\n"
    "}"
)
    client = get_openai_client()
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
    "You are a productivity planning assistant.\n"
    "The user has a list of tasks due today. Your job is to:\n"
    "1. Prioritize each task as High, Medium, or Low\n"
    "2. Create a realistic schedule for the day, broken into:\n"
    "   - Morning (before 12pm)\n"
    "   - Afternoon (12pm–5pm)\n"
    "   - Evening (after 5pm)\n"
    "Include time estimates for each scheduled task.\n\n"
    "Return your response in this format:\n"
    "**High Priority**\n- Task A\n\n**Medium Priority**\n- Task B\n\n"
    "**Schedule**\n- Morning: Task A (1 hr), Task C (30 min)\n- Afternoon: ...\n\n"
    f"Tasks:\n{task_list}"
)

    client = get_openai_client()
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
    "You are a productivity assistant. The user has the following tasks today:\n\n"
    + "\n".join(task_descriptions) +
    "\n\n"
    "Your goal is to write a concise, human-readable summary (~3–4 sentences) "
    "that captures the overall workload and what the user should focus on first.\n"
    "Do NOT list all tasks. Instead, synthesize and prioritize. Start with the most urgent focus.\n\n"
    "Summary:"
)


    try:
        client = get_openai_client()
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
    "You are a smart scheduling assistant. The user has provided a list of tasks with titles, "
    "descriptions, and sometimes due dates.\n\n"
    "Generate a weekly plan from today through Sunday. Follow these rules:\n"
    "- Assign tasks based on urgency, due date, and importance.\n"
    "- Skip days already past.\n"
    "- Do NOT duplicate tasks.\n"
    "- Mark any remaining days without tasks as 'Free Day'.\n\n"
    "Return the response in this exact format:\n"
    "- Monday:\n  - Task\n- Tuesday:\n  - Task\n...\n\n"
    f"User Tasks:\n{task_text}"
)


    try:
        client = get_openai_client()
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[{"role": "user", "content": prompt}],
            max_tokens=500,
            temperature=0.7
        )
        return response.choices[0].message.content.strip()
    except Exception as e:
        return f"Failed to generate weekly plan: {e}"