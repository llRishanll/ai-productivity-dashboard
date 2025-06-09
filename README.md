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

- `backend/` — FastAPI backend with AI, auth, database, logging, and tests  
- `frontend/` — React frontend (in progress)  
- `.github/` — GitHub Actions workflow for CI  
- `README.md` — This file

---

## ✅ Backend Highlights

- FastAPI + SQLite (PostgreSQL coming soon)
- AI task tools with OpenAI integration
- JWT authentication with Google OAuth
- Email verification with Gmail SMTP
- Full test suite (Pytest + Coverage)
- CI pipeline with GitHub Actions + Codecov badge
- Structured JSON logging with file rotation
- Rate limiting and admin-only routes

---

## 🧪 Test Coverage

![Coverage](https://codecov.io/gh/llRishanll/ai-productivity-dashboard/branch/dev/graph/badge.svg)

---

## 🚧 Frontend (WIP)
- React + Tailwind UI
- Responsive layout with dashboard pages
- View Tasks, Add Task, Profile, Landing Page

---

## 🗺️ Coming Soon

- PostgreSQL Migration
- Dockerization (`docker-compose`)
- Full AWS deployment (EC2, RDS, SES, S3)