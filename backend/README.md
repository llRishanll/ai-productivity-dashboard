# TaskMaster AI – Backend 🧠

This is the FastAPI backend for TaskMaster AI — an intelligent productivity manager with AI task tools, user authentication, and structured logging.

![Coverage](https://codecov.io/gh/llRishanll/ai-productivity-dashboard/branch/dev/graph/badge.svg)

---

## ⚙️ Stack

- **FastAPI** – Async Python web framework
- **PostgreSQL** – Production-ready relational DB
- **SQLAlchemy + Databases** – Async ORM
- **JWT Auth** – With email verification + Google OAuth
- **OpenAI API** – For smart task generation and planning
- **Pytest** – 93% test coverage
- **Structlog** – JSON logs with rotation
- **SlowAPI** – Request rate limiting

---

## 📁 Backend Structure

```
backend/
├── crud/               # Service layer for DB logic
├── models/             # SQLAlchemy model definitions
├── routes/             # FastAPI endpoints (auth, tasks, admin)
├── schemas/            # Pydantic models
├── templates/          # HTML templates for email
├── tests/              # Test suite using Pytest
├── utils/              # Helper modules: email, AI, auth, etc.
├── main.py             # FastAPI entry point
├── database.py         # DB setup and query wrappers
├── scheduler.py        # Background job scheduler
├── logging_config.py   # JSON log formatter + rotation
├── requirements.txt    # Backend dependencies
├── Dockerfile          # Container instructions
├── .dockerignore
└── README.md           # You're here
```

---

## 🌐 Environment Variables

`.env` or `.env.test`:

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

## 🧪 Run Tests (Local or Docker)

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

## 🧠 AI Feature Summary

| Feature        | Endpoint               | Description                           |
| -------------- | ---------------------- | ------------------------------------- |
| AI Generation  | `/tasks/ai-generate`   | Converts vague input → structured task|
| Prioritization | `/tasks/ai-prioritize` | Ranks tasks by urgency                |
| Daily Plan     | `/tasks/ai-daily-plan` | Builds today’s task plan              |
| Summary        | `/tasks/ai-summary`    | Generates a task workload summary     |
| Week Plan      | `/tasks/ai-week-plan`  | Plans next 7 days                     |

---

## 🔐 Auth Feature Summary

| Feature             | Endpoint                          | Description                    |
| ------------------- | --------------------------------- | ------------------------------ |
| Email Signup/Login  | `/auth/signup`, `/auth/login`     | JWT-based authentication       |
| Google OAuth Login  | `/auth/google-login`, `/callback` | Login using Google credentials |
| Email Verification  | `/auth/verify-email`              | Confirms email before login    |
| Resend Verification | `/resend-verification`            | Sends confirmation email again |
| Get Current User    | `/me`                             | Fetches logged-in user details |

---

## ✅ Status

✅ Auth | ✅ Google OAuth | ✅ Email Verification | ✅ Task CRUD |
✅ AI Features(OpenAI) | ✅ Role-based Access | ✅ Logging | ✅ PostgreSQL | ✅ Docker | 
✅ 93% Pytest Coverage | 🔄 AWS Deployment
