# 🤖 AI Code Review Tool

An AI-powered application that accepts code snippets and returns intelligent, developer-friendly review suggestions using the **Groq API (LLaMA 3)**. Built with the **MERN stack** (MongoDB, Express, React, Node.js).

---

## 📌 Project Status

> **Backend: 100% complete**  
> **Frontend: 100% complete**  
> The application is fully functional, with a modern React UI integrated with the AI-powered backend.

| Phase | Description | Status |
|---|---|---|
| Backend Setup | Express, MongoDB, Groq API Integration | ✅ Done |
| API Development | Review submission, history retrieval, health checks | ✅ Done |
| Frontend Setup | React + Vite, Axios, Modern CSS | ✅ Done |
| UI/UX Design | Professional dark mode, structured results, refactored code display | ✅ Done |
| End-to-End | Full integration and verification | ✅ Done |

---

## ⚙️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React, Vite, Axios, Vanilla CSS |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB + Mongoose |
| **AI Provider** | Groq API (LLaMA 3.3 — `llama-3.3-70b-versatile`) |

---

## 🗂️ Folder Structure

```
ai-code-review-tool/
├── backend/                  ← Node.js + Express API
│   ├── config/               ← Database connection
│   ├── controllers/          ← API business logic
│   ├── models/               ← MongoDB schemas
│   ├── routes/               ← API route definitions
│   ├── services/             ← External service integrations (Groq)
│   └── server.js             ← Entry point
│
├── frontend/                 ← React + Vite UI
│   ├── src/
│   │   ├── components/       ← Modular UI components
│   │   ├── App.jsx           ← Main app logic & state
│   │   └── App.css           ← Modern styling
│   └── vite.config.js        ← Build & proxy configuration
│
├── prd.md                    ← Product Requirements Document
└── README.md                 ← You are here
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js installed
- MongoDB (Local or Atlas)
- [Groq API Key](https://console.groq.com/keys)

### 1. Setup Backend
```bash
cd backend
npm install
cp .env.example .env # Add your MONGO_URI and GROQ_API_KEY
npm run dev
```
*Backend runs on `http://localhost:5000`*

### 2. Setup Frontend
```bash
cd frontend
npm install
npm run dev
```
*Frontend runs on `http://localhost:5173`*

---

## 📡 API Reference (Brief)

### `POST /api/review`
Submits code for review.
**Request:** `{ "code": "...", "language": "..." }`
**Response:**
```json
{
  "success": true,
  "data": {
    "score": 8,
    "suggestions": {
      "bugs": [...],
      "issues": [...],
      "improvements": [...],
      "performance": [...],
      "refactored_code": "..."
    }
  }
}
```

---

## 👥 Collaborative Workflow

We follow a `dev` branch workflow. Always branch off from `dev` for features:
`Clone` → `Checkout dev` → `Feature Branch` → `PR to dev` → `Merge to main`

**Rules:**
- No direct commits to `main` or `dev`.
- All secrets live in `.env` and are never committed.
