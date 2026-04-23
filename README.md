# 🤖 AI Code Review Tool

An AI-powered backend service that accepts code snippets and returns intelligent, developer-friendly review suggestions using the **Groq API (LLaMA 3)**. Built with the **MERN stack** (MongoDB, Express, Node.js) as part of a team project.

---

## 📌 Project Status

> **Backend: ~70% complete**
> All core code is scaffolded and written. Testing and frontend handoff remain.

| Phase | Description | Status |
|---|---|---|
| Project Setup | Express server, .env, MongoDB connection, folder structure | ✅ Done |
| Schema & Model | Mongoose `Review` schema | ✅ Done |
| Groq Integration | `groqService.js` with prompt engineering | ✅ Done |
| Routes & Controller | All 4 API endpoints implemented | ✅ Done |
| Testing | Thunder Client endpoint testing | 🔲 Pending |
| Frontend Handoff | Share JSON contract with frontend team | 🔲 Pending |

---

## 🗂️ Folder Structure

```
ai-code-review-tool/
│
├── .gitignore
├── prd.md                            ← Product Requirements Document
├── README.md
│
└── backend/
    ├── package.json
    ├── .env.example                  ← Copy this to .env and fill in your keys
    ├── server.js                     ← Entry point: Express + middleware setup
    │
    ├── config/
    │   └── db.js                     ← MongoDB connection logic
    │
    ├── models/
    │   └── Review.js                 ← Mongoose schema for review documents
    │
    ├── routes/
    │   └── reviewRoutes.js           ← Route definitions → maps to controller
    │
    ├── controllers/
    │   └── reviewController.js       ← Business logic for all endpoints
    │
    └── services/
        └── groqService.js            ← Groq API calls + prompt engineering
```

---

## ⚙️ Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js |
| Framework | Express.js |
| Database | MongoDB + Mongoose |
| AI Provider | Groq API (LLaMA 3.3 — `llama-3.3-70b-versatile`) |
| Dev Tools | Nodemon, Thunder Client |

---

## 🌟 Guide for Collaborators

### 1. Branching Strategy

We follow a structured Git workflow:

**Branches:**
* `main` → production-ready code (protected)
* `dev` → active development branch
* `feature/*` → individual features

**Workflow:**
1. Create a feature branch from `dev`
2. Work and commit changes
3. Push branch to remote
4. Create Pull Request → `dev`
5. Code review required before merge

**Rules:**
* No direct commits to `main`
* All changes go through PR
* `dev` is merged into `main` for releases

**Naming Convention:**
* `feature/login-api`
* `feature/dashboard-ui`
* `bugfix/auth-error`

**Example Commands:**
```bash
git checkout dev
git pull origin dev
git checkout -b feature/your-feature
# (make your changes)
git add .
git commit -m "feat: your feature"
git push origin feature/your-feature
```

---

## 🚀 Local Setup Instructions

### Prerequisites
- Node.js installed
- Git installed
- MongoDB installed locally **or** a MongoDB Atlas free account
- A Groq Developer account

### 1. Repository Setup
```bash
git clone https://github.com/Sarvan-12/ai-code-review-tool.git
cd ai-code-review-tool/backend
npm install
```

### 2. Configure MongoDB
- **Local:** Install [MongoDB Community Server](https://www.mongodb.com/try/download/community) and MongoDB Compass. Your URI will be `mongodb://localhost:27017/ai-code-review`.
- **Atlas (Cloud):** Create a free cluster at [mongodb.com/atlas](https://www.mongodb.com/atlas). Get your connection string (URI) starting with `mongodb+srv://...`

### 3. Configure Groq AI
- Go to the [Groq Cloud Console](https://console.groq.com/keys)
- Click "Create API Key"
- Copy the key immediately (it starts with `gsk_`)

### 4. Set Environment Variables
Copy the template file to create your active `.env`:
```bash
cp .env.example .env
```
Then paste your Mongo URI and Groq API key inside `.env`:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/ai-code-review
GROQ_API_KEY=your_groq_api_key_here
```
> ⚠️ **Never commit `.env` to Git.** It is already excluded via `.gitignore`.

### 5. Run the Server
```bash
npm run dev
```
Server will run at: `http://localhost:5000`

---

## 📡 API Endpoints

Base URL: `http://localhost:5000/api`

### `GET /api/health`
Server status check. Use this first to confirm the server is running.

**Response:**
```json
{ "success": true, "message": "Server is running" }
```

---

### `POST /api/review`
Submit code for an AI-generated review.

**Request Body:**
```json
{
  "code": "def add(a, b): return a + b",
  "language": "python"
}
```

**Response `201`:**
```json
{
  "success": true,
  "data": {
    "id": "64abc123...",
    "language": "python",
    "model": "llama-3.3-70b-versatile",
    "responseTime": 1205,
    "suggestions": {
      "score": 8,
      "bugs": [],
      "issues": [
        { "issue": "Missing type hints", "fix": "Add type hints to parameters `a: int, b: int`" }
      ],
      "improvements": [],
      "performance": [],
      "refactored_code": "def add(a: int, b: int) -> int:\n    return a + b"
    },
    "createdAt": "2026-04-23T10:30:00Z"
  }
}
```

**Error `400`** (if `code` is missing or exceeds 5000 chars):
```json
{ "success": false, "error": "Code is required" }
```

---

### `GET /api/review/:id`
Fetch a single saved review by its MongoDB ID.

**Response `200`:** `{ "success": true, "data": { ...review document } }`  
**Response `404`:** `{ "success": false, "error": "Review not found" }`

---

### `GET /api/reviews`
List all past reviews, sorted newest first.

**Response `200`:** `{ "success": true, "data": [ ...array of review documents ] }`

---

## 🗄️ MongoDB Schema

**Collection:** `reviews`

| Field | Type | Description |
|---|---|---|
| `_id` | ObjectId | Auto-generated by MongoDB |
| `code` | String | The submitted source code |
| `language` | String | Programming language (default: `plaintext`) |
| `suggestions` | Object | Structured JSON AI review containing quality, bugs, etc. |
| `model` | String | Groq model used (default: `llama-3.3-70b-versatile`) |
| `responseTime` | Number | Milliseconds taken for the Groq API call to complete |
| `createdAt` | Date | Timestamp of submission |

---

## 🔁 Request Lifecycle

```
Thunder Client / Frontend
        │
        ▼
   server.js  ──►  reviewRoutes.js  ──►  reviewController.js
                                               │            │
                                         groqService.js   Review.js
                                         (Groq API)       (MongoDB)
```

---

## 👥 Team Scope

| Role | Responsibility |
|---|---|
| **Backend** *(this repo)* | Express API, Groq integration, MongoDB |
| **Frontend** | React UI, code editor, displaying suggestions |
| **Deployment** | Hosting, CI/CD (out of v1.0 scope) |

> Frontend team: consume the `POST /api/review` response. The JSON contract is stable — see the endpoint docs above.

---

## 📋 Notes & Assumptions

- No authentication required for v1.0
- Groq model: `llama-3.3-70b-versatile` (fast and free-tier friendly)
- `suggestions` is returned as a **structured JSON object**. The UI should parse keys like `quality` and `bugs`.
- Error responses always follow: `{ "success": false, "error": "message" }`
- All responses are wrapped in a `{ success: true, data: ... }` envelope
- All environment variables live in `.env` — never committed to Git


