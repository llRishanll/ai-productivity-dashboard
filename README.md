# TaskMaster AI ✅

**An AI-powered productivity dashboard that intelligently generates, organizes, prioritizes, and schedules your tasks — built with FastAPI, React, OpenAI, and deployed on AWS.**

🔗 **Live Demo:** [taskmaster-ai.com](https://taskmaster-ai.com)  
📂 **Backend Code:** [github.com/llRishanll/ai-productivity-dashboard](https://github.com/llRishanll/ai-productivity-dashboard)  
🎥 **Demo Video/GIF:** *(Coming soon — add GIF or Loom video here)*

---

## ⚙️ Tech Stack

| Layer       | Technology                             |
|-------------|----------------------------------------|
| Backend     | FastAPI, PostgreSQL, SQLAlchemy        |
| Auth        | JWT, Google OAuth, Email Verification  |
| AI Features | OpenAI API (gpt-3.5-turbo)             |
| Frontend    | React (Vite), Tailwind CSS             |
| Testing     | Pytest, Docker Compose (test-runner)   |
| Deployment  | AWS EC2, SES, SEM, Docker, Nginx       |
| Utilities   | Structlog, dotenv, SlowAPI             |

---

## ✨ Key Features

### 🧠 AI Endpoints
| Route                  | Functionality                                               |
|------------------------|-------------------------------------------------------------|
| `/tasks/ai-generate`   | Converts vague user input into structured tasks             |
| `/tasks/ai-prioritize` | Ranks tasks by urgency and priority                         |
| `/tasks/ai-daily-plan` | Creates a personalized daily task schedule                  |
| `/tasks/ai-week-plan`  | Generates a structured week plan from your task list        |
| `/tasks/ai-summary`    | Produces a human-readable summary of your workload          |

### 🔐 Authentication & Access
- JWT auth with email verification
- Google OAuth 2.0 login
- Role-based access control: Admin vs User
- Rate limiting on sensitive endpoints (SlowAPI)

---

## 🏗️ Build & Run Instructions

### Clone and Build:

```bash
git clone https://github.com/llRishanll/taskmaster-ai.git
cd taskmaster-ai
docker-compose up --build
```

### Run Tests:

```bash
docker-compose run --rm test-runner
```

### Frontend Dev Mode (optional):

```bash
cd frontend
npm install
npm run dev
```

---

## 🧪 Setup Instructions

Create and configure the following environment files:

```
backend/.env
backend/.env.prod
frontend/.env
frontend/.env.prod
```

### 🔐 Backend `.env` (for development/production):

```env
# OpenAI API
OPENAI_API_KEY=...

# OAuth
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
GOOGLE_REDIRECT_URI=https://taskmaster-ai.com/api/auth/callback

# Email (Brevo SMTP)
EMAIL_HOST=smtp-relay.brevo.com
EMAIL_PORT=587
EMAIL_FROM=noreply@taskmaster-ai.com
SMTP_USER=...
SMTP_PASS=...

# JWT
SECRET_KEY=...
VERIFICATION_SECRET_KEY=...
RESET_SECRET_KEY=...
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=60

# General
FRONTEND_URL=https://taskmaster-ai.com
LIMITER=True

# DB
POSTGRES_USER=postgres
POSTGRES_PASSWORD=...
POSTGRES_DB=taskmaster
POSTGRES_HOST=taskmaster-db-prod
POSTGRES_PORT=5432
```

### 🌐 Frontend `.env`:

```env
VITE_API_URL=https://taskmaster-ai.com/api
VITE_APP_URL=https://taskmaster-ai.com
```

---

## 📚 Lessons Learned

- Built a secure, scalable backend with FastAPI from scratch
- Integrated AI into real-world task flows using OpenAI
- Implemented role-based access, secure OAuth, and email verification logic
- Learned Dockerization, cloud deployment, and logging best practices
- Managed AWS resources (EC2, SES, SEM) and custom email infra

---

## 🔧 Areas for Improvement

- Finalize frontend dashboard UI and error handling
- Integrate Google Calendar for real-time sync
- Build admin panel for task/user analytics
- Convert frontend to PWA for offline usage
- Add frontend test suite (unit + integration)

---

## 🚀 Deployment Details

- Backend and frontend deployed to AWS EC2
- Nginx reverse proxy with HTTPS (Let’s Encrypt or certbot)
- Email delivery via AWS SES
- Fully Dockerized with CI-ready test setup

---

## 👋 About Me

I'm a third-year Computer Science student at Wilfrid Laurier University (Class of 2026), passionate about backend development, automation, and AI-powered workflows. This project demonstrates real-world deployment, architecture, and OpenAI integration — built fully from scratch.

Feel free to fork, open an issue, or reach out. Always open to collaboration!
