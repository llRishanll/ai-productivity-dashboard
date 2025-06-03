import pytest
from unittest.mock import patch, MagicMock
from utils import notifications
from utils.notifications import send_daily_reminders

@pytest.mark.asyncio
@patch("utils.notifications.database.fetch_all")
@patch("utils.notifications.database.fetch_one")
@patch("utils.notifications.send_email")
async def test_send_daily_reminders(mock_send_email, mock_fetch_one, mock_fetch_all):
    
    mock_tasks = [
        {"user_id": 1, "title": "Task 1", "description": "Desc 1"},
        {"user_id": 1, "title": "Task 2", "description": "Desc 2"},
    ]
    mock_user = {"id": 1, "email": "test@example.com"}

    mock_fetch_all.return_value = mock_tasks
    mock_fetch_one.return_value = mock_user

    await send_daily_reminders()

    mock_send_email.assert_called_once_with("test@example.com", mock_tasks)
    mock_fetch_all.assert_called()
    mock_fetch_one.assert_called()

@patch("utils.notifications.smtplib.SMTP")
def test_send_email(mock_smtp):
    mock_server = MagicMock()
    mock_smtp.return_value = mock_server

    sample_tasks = [
        {"title": "Read", "description": "Chapter 1"},
        {"title": "Code", "description": "Fix bugs"}
    ]

    notifications.send_email("recipient@example.com", sample_tasks)

    mock_server.starttls.assert_called_once()
    mock_server.login.assert_called_once()
    mock_server.send_message.assert_called_once()
    mock_server.quit.assert_called_once()

@patch("utils.notifications.smtplib.SMTP")
def test_send_email_skips_empty_task_list(mock_smtp):
    notifications.send_email("someone@example.com", [])
    mock_smtp.assert_not_called()
