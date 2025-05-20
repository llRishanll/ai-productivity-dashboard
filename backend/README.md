# AI Productivity Dashboard

A full-stack AI-powered productivity dashboard to help users stay focused and organized.  
Built with **FastAPI**, connected to the **OpenAI API**, and integrated with a simple frontend (React).

## 🔧 Features (WIP)
- Add/view daily tasks
- AI-generated summaries, motivation, or schedule suggestions
- Simple and clean UI 

## 🚀 Tech Stack
- Backend: FastAPI (Python)
- AI: OpenAI API
- Frontend: (React)
- Database: SQLite (initial), then PostgreSQL (optional)

## 🛠️ Setup Instructions
```bash
git clone https://github.com/llRishanll/ai-productivity-dashboard.git
cd ai-productivity-dashboard
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload
