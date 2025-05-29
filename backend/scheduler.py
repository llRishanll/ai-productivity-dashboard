from apscheduler.schedulers.asyncio import AsyncIOScheduler
from apscheduler.triggers.cron import CronTrigger
from utils.notifications import send_daily_reminders

scheduler = AsyncIOScheduler()

def start_scheduler():
    scheduler.add_job(send_daily_reminders, CronTrigger(hour=7, minute=0))
    scheduler.start()
