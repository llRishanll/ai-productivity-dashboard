# TaskMaster AI – Frontend 🎯

This is the React + Tailwind frontend for **TaskMaster AI**, a full-stack AI-powered productivity platform. It communicates with the FastAPI backend and displays your tasks, plans, and AI-generated insights in a clean dashboard.

🔗 **Live Site:** [taskmaster-ai.com](https://taskmaster-ai.com)  
📦 **Backend Repo:** [github.com/llRishanll/taskmaster-ai](https://github.com/llRishanll/taskmaster-ai)

---

## ⚙️ Tech Stack

| Feature       | Technology             |
|---------------|-------------------------|
| Framework     | React (Vite)            |
| Styling       | Tailwind CSS            |
| Routing       | React Router DOM        |
| Environment   | Vite `.env` & `.env.prod` |
| Auth          | Google OAuth2 via backend |
| Deployment    | Docker + Nginx + AWS    |

---

## ✨ Key Features

- Responsive landing page built with Tailwind
- Auth-aware header and routing (Google login, email verification)
- Dashboard with AI-generated tasks, plans, summaries
- Uses `VITE_API_URL` and `VITE_APP_URL` to link backend/frontend
- Protected routes for logged-in users

---

## 📁 Project Structure

```bash
frontend/
├── public/                # Static assets
├── src/
│   ├── api/               # Axios config + backend calls
│   ├── assets/            # Images, icons
│   ├── components/        # Reusable UI components
│   ├── hooks/             # Custom hooks
│   ├── pages/             # Main page views
│   ├── styles/            # Tailwind and global styles
│   └── utils/             # Helper functions
│   ├── App.jsx            # Root component
│   ├── main.jsx           # App entry point
├── .env                   # Dev environment variables
├── .env.prod              # Production environment variables
├── Dockerfile             # Frontend Docker image
├── eslint.config.js       # ESLint rules
├── index.html             # HTML shell for Vite
├── nginx.conf             # Nginx production config
├── package.json           # Project dependencies
├── vite.config.js         # Vite configuration
└── README.md              # You're here
```

---

## ⚙️ Setup Instructions

1. Create `.env` and `.env.prod` in `/frontend` with the following keys:

```env
# Vite API Routing
VITE_API_URL=https://taskmaster-ai.com/api
VITE_APP_URL=https://taskmaster-ai.com
```

2. Install dependencies:

```bash
npm install
```

3. Start development server:

```bash
npm run dev
```

4. Build for production:

```bash
npm run build
```

---

## 🔧 Areas for Improvement

- Finalize full dashboard styling and layout (cards, tabs)
- Add loading/error states for API calls
- Add route guards and toast notifications
- Add unit tests for components
- Optimize performance + bundle size

---

## 👨‍💻 Maintainer

This frontend was built by [Rishan Deshmukh](https://linkedin.com/in/rishan-deshmukh-11022823a) as part of a full-stack project built from scratch using FastAPI, OpenAI, and React.

---

> Want to contribute design suggestions or frontend components? Open an issue or pull request!
