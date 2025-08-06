# TaskMaster AI – Backend 🧠

This is the FastAPI backend powering **TaskMaster AI**, an AI-integrated productivity platform with intelligent task tools, secure user auth, email verification, and OpenAI-powered scheduling.

[![Coverage](https://codecov.io/gh/llRishanll/ai-productivity-dashboard/branch/dev/graph/badge.svg)](https://codecov.io/gh/llRishanll/ai-productivity-dashboard)

---

## ⚙️ Tech Stack

| Component     | Technology                            |
|---------------|----------------------------------------|
| Web Framework | FastAPI (async)                        |
| Database      | PostgreSQL + SQLAlchemy (async)        |
| Auth          | JWT, Email Verification, Google OAuth  |
| AI            | OpenAI API (gpt-3.5-turbo)             |
| Testing       | Pytest, Docker-based test runner       |
| Logging       | Structlog + JSON log rotation          |
| Rate Limiting | SlowAPI                                |
| Scheduler     | Background email reminders via APScheduler

---

## 📁 Project Structure

```
backend/
├── crud/               # DB query and business logic
├── models/             # SQLAlchemy model definitions
├── routes/             # Auth, tasks, AI, admin endpoints
├── schemas/            # Pydantic data validation models
├── templates/          # Email HTML templates
├── tests/              # Pytest test suite (mocked AI/email)
├── utils/              # Email, OpenAI, and auth helpers
├── scheduler.py        # Daily task reminder scheduler
├── main.py             # FastAPI entry point
├── database.py         # DB session + init
├── logging_config.py   # Structured log formatter + rotation
├── requirements.txt    # Dependency list
└── Dockerfile          # Container instructions
```

---

## 🔐 Auth Feature Overview

| Feature             | Endpoint                          | Description                    |
|---------------------|------------------------------------|--------------------------------|
| Email Signup/Login  | `/auth/signup`, `/auth/login`     | JWT-based login system         |
| Google OAuth        | `/auth/google-login`, `/callback` | Secure OAuth2 integration      |
| Email Verification  | `/auth/verify-email`              | Confirm email before login     |
| Resend Link         | `/resend-verification`            | Send new verification email    |
| Authenticated Fetch | `/me`                             | Get current user profile       |
| Roles               | Internal                          | Admin vs User route protection |

---

## 🧠 AI Feature Overview

| Feature        | Endpoint               | Description                                     |
|----------------|------------------------|-------------------------------------------------|
| Generate       | `/tasks/ai-generate`   | Converts vague input into structured tasks      |
| Prioritize     | `/tasks/ai-prioritize` | Ranks tasks by urgency and importance           |
| Daily Plan     | `/tasks/ai-daily-plan` | Builds a realistic plan for today's tasks       |
| Weekly Plan    | `/tasks/ai-week-plan`  | Distributes tasks across the next 7 days        |
| Summary        | `/tasks/ai-summary`    | Summarizes workload into natural language       |

---

## 🧪 Running Tests

### Locally:
```bash
cd backend
pytest --cov=.
```

### With Docker:
```bash
docker-compose run --rm test-runner
```

---

## 🌐 Environment Configuration

Create the following in `backend/`:

- `.env` (for development)
- `.env.prod` (for production deployment)

Example keys (do **not** commit real values):

```env
# OpenAI
OPENAI_API_KEY=...

# Google OAuth
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
GOOGLE_REDIRECT_URI=https://taskmaster-ai.com/api/auth/callback

# JWT
SECRET_KEY=...
VERIFICATION_SECRET_KEY=...
RESET_SECRET_KEY=...
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=60

# Email (SMTP)
EMAIL_HOST=smtp-relay.brevo.com
EMAIL_PORT=587
EMAIL_FROM=noreply@taskmaster-ai.com
SMTP_USER=...
SMTP_PASS=...

# Frontend
FRONTEND_URL=https://taskmaster-ai.com

# Rate Limiting
LIMITER=True

# PostgreSQL
POSTGRES_USER=postgres
POSTGRES_PASSWORD=...
POSTGRES_DB=taskmaster
POSTGRES_HOST=taskmaster-db-prod
POSTGRES_PORT=5432
```

---

## ✅ Backend Status

- ✅ Auth (Email + OAuth2)
- ✅ Role-based Access (Admin/User)
- ✅ AI Planning Features (5 endpoints)
- ✅ Dockerized + Test-Runner Container
- ✅ 93% Pytest Coverage
- ✅ PostgreSQL Integration
- ✅ Daily Scheduler
- ✅ JSON Structured Logging
- ✅ CI/CD Pipeline 
- ✅ Admin Analytics Panel 
- 🔄 Google Calendar Integrations (planned)

---

## 📚 Lessons Learned

- Building scalable FastAPI apps with async DB layers and clean routing
- Creating testable, prompt-engineered OpenAI workflows
- Integrating real-world login flows via Google OAuth and SMTP
- Designing backend infrastructure for production (logging, testing, secrets)

---

## 🔧 Areas for Improvement

- Add metrics dashboard for admin
- Enhance error reporting across all endpoints
- Convert all logs to external storage/monitoring solution
- Add Redis caching layer for AI response reuse
- Expand scheduler to include overdue task nudges

---

## 👨‍💻 Maintainer

Built and maintained by [Rishan Deshmukh](https://linkedin.com/in/rishan-deshmukh-11022823a), BSc. Computer Science (Class of 2026), Wilfrid Laurier University.

---

> ✉️ For feedback, contributions, or questions — open an issue or reach out via LinkedIn.
