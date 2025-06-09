# TaskMaster AI – Backend 🧠

This is the FastAPI backend for TaskMaster AI — an intelligent productivity manager with AI task tools, user authentication, and structured logging.

![Coverage](https://codecov.io/gh/llRishanll/ai-productivity-dashboard/branch/dev/graph/badge.svg)

---

## ⚙️ Stack

- **FastAPI** – Async Python web framework
- **SQLite (PostgreSQL soon)** – Lightweight dev database
- **SQLAlchemy + Databases** – Async ORM
- **JWT Auth** – With email verification + Google OAuth
- **OpenAI API** – For smart task generation and planning
- **Pytest** – 93% test coverage with mocking
- **Structlog** – JSON logs with rotation
- **SlowAPI** – Request rate limiting

---

## 📁 Backend Structure

- `crud/` — CRUD service layer
- `models/` — SQLAlchemy models
- `routes/` — API endpoints (auth, tasks, admin)
- `schemas/` — Pydantic request/response models
- `templates/` — HTML email templates
- `tests/` — Test suite (pytest + mocking)
- `utils/` — Auth, logging, AI, email, etc.
- `database.py` — DB setup
- `logging_config.py` — Structured logging config
- `scheduler.py` — Background job scheduler
- `main.py` — FastAPI app entry
- `requirements.txt` — Python dependencies
- `README.md` — You're here

---

## 🌐 Environment Variables

```env
# Frontend
FRONTEND_URL=http://localhost:5173

# JWT Auth
SECRET_KEY=any-secret-key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=60

# Google OAuth
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-client-secret

# OpenAI
OPENAI_API_KEY=sk-...

# Email (SMTP)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# Rate Limiting
LIMITER=True
```
---

## 🧪 Running Tests

cd backend
pytest --cov=.

---

## 🪵 Logging

Structured logs with structlog

Logged to console + logs/app.log

Rotation via RotatingFileHandler

Used across auth, tasks, admin, and scheduler

---

## 🧠 AI Feature Summary

| Feature        | Endpoint               | Description                           |
| -------------- | ---------------------- | ------------------------------------- |
| AI Generation  | `/tasks/ai-generate`   | Converts user input → structured task |
| Prioritization | `/tasks/ai-prioritize` | Ranks all tasks by urgency            |
| Daily Plan     | `/tasks/ai-daily-plan` | Builds today’s optimized task plan    |
| Summary        | `/tasks/ai-summary`    | Weekly overview of pending tasks      |
| Week Plan      | `/tasks/ai-week-plan`  | Plans next 7 days from task list      |

---

## 🔐 Auth Feature Summary

| Feature             | Endpoint                          | Description                    |
| ------------------- | --------------------------------- | ------------------------------ |
| Email Signup/Login  | `/auth/signup`, `/auth/login`     | JWT-based authentication       |
| Google OAuth Login  | `/auth/google-login`, `/callback` | Login using Google credentials |
| Email Verification  | `/auth/verify-email`              | Verifies user's email address  |
| Resend Verification | `/resend-verification`            | Resend confirmation email      |
| Get Current User    | `/me`                             | Fetches logged-in user details |

---

## ✅ Status

✅ Auth | ✅ Google Login | ✅ Email Verification
✅ Logging | ✅ Testing | ✅ Pagination
🔄 PostgreSQL | 🔄 Docker | 🔄 AWS Deployment
