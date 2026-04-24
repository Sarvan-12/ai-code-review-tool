# 🤖 AI Code Review Tool

An AI-powered application that provides intelligent code reviews using the **Groq API (LLaMA 3)**. It analyzes code for bugs, logic issues, and performance bottlenecks, returning a structured score and refactored code.

---

## ⚙️ Tech Stack

- **Frontend:** React, Vite, Axios
- **Backend:** Node.js, Express.js
- **Database:** MongoDB + Mongoose
- **AI Provider:** Groq API (LLaMA 3.3 — `llama-3.3-70b-versatile`)

---

## 🗂️ Folder Structure

```
ai-code-review-tool/
├── backend/                  ← Node.js + Express API
│   ├── config/               ← Database connection
│   ├── controllers/          ← API business logic
│   ├── models/               ← MongoDB schemas
│   ├── routes/               ← API route definitions
│   └── services/             ← External service integrations (Groq)
│
├── frontend/                 ← React + Vite UI
│   ├── src/
│   │   ├── components/       ← Reusable UI components
│   │   ├── App.jsx           ← Main application logic
│   │   └── App.css           ← Modern styling
│   └── vite.config.js        ← Build & proxy configuration
```

---

## 🚀 Getting Started

### 1. Run the Backend
```bash
cd backend
npm install
npm run dev
```
*Make sure to configure your `.env` file with `MONGO_URI` and `GROQ_API_KEY`.*

### 2. Run the Frontend
```bash
cd frontend
npm install
npm run dev
```
*The frontend will be available at `http://localhost:5173`.*

---

## 📡 API Example

### `POST /api/review`
Submits code for an AI-generated review.

**Request Body:**
```json
{
  "code": "def add(a, b): return a + b",
  "language": "python"
}
```

**Response Example:**
```json
{
  "success": true,
  "data": {
    "score": 8,
    "suggestions": {
      "bugs": [],
      "issues": [
        { "issue": "Missing type hints", "fix": "Add type hints like `a: int, b: int`" }
      ],
      "improvements": [],
      "performance": [],
      "refactored_code": "def add(a: int, b: int) -> int:\n    return a + b"
    },
    "responseTime": 1205
  }
}
```
