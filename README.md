# TaskMaster AI ✅

**An AI-powered productivity dashboard that helps you generate, organize, prioritize, and plan your tasks — intelligently.**

## 🔗 Live Demo
[taskmaster-ai.com](https://taskmaster-ai.com)

---

## 🧠 AI-Powered Features
- **📝 /ai-generate** – Turn vague prompts into structured, actionable tasks.
- **⚡ /ai-prioritize** – Rank your tasks based on urgency and importance.
- **📅 /ai-daily-plan** – Generate a focused schedule for today’s tasks.
- **📊 /ai-summary** – Receive weekly summaries of pending tasks.
- **📆 /ai-week-plan** – Plan intelligently for the next 7 days.

---

## 🔐 Auth Features
- JWT-based Signup/Login with Email Verification
- Google OAuth Login
- Rate Limited Endpoints (SlowAPI)
- Role-based Access: Admin vs User

---

## 🛠️ Project Structure

```
.
├── backend/               # FastAPI backend (see details below)
├── frontend/              # React frontend (WIP)
├── docker-compose.yml     # Multi-service Docker setup
├── .env                   # Env vars for dev
├── .env.test              # Env vars for test runs
├── .gitignore
└── README.md              # This file
```

---

## 🐋 Dockerized Setup

```bash
# Build and run all services
docker-compose up --build

# Run backend tests using test-runner container
docker-compose run --rm test-runner
```

---

## 📋 TODO

- ✅ PostgreSQL Integration
- ✅ Full Docker Support
- 🔄 Frontend Completion (React + Tailwind)
- 🔄 AWS Deployment (EC2, RDS, SES, S3)
