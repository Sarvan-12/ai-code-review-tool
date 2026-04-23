# 🤖 AI Code Review Tool

An AI-powered backend service that accepts code snippets and returns intelligent, developer-friendly review suggestions using the **Groq API (LLaMA 3)**. Built with the **MERN stack** (MongoDB, Express, Node.js) as part of a team project.

---

## 📌 Project Status

> **Backend: 100% complete**  
> Core logic is fully implemented and verified. Ready for full frontend integration.

| Phase | Description | Status |
|---|---|---|
| Project Setup | Express server, .env, MongoDB connection, folder structure | ✅ Done |
| Schema & Model | Mongoose `Review` schema | ✅ Done |
| Groq Integration | `groqService.js` with prompt engineering | ✅ Done |
| Routes & Controller | All 4 API endpoints implemented | ✅ Done |
| Testing | Thunder Client endpoint verification | ✅ Done |
| Frontend Handoff | JSON contract stabilized and documented | ✅ Done |

---

## 🗂️ Folder Structure

```
ai-code-review-tool/
│
├── .gitignore
├── prd.md                            ← Product Requirements Document
├── DOCUMENTATION.md                  ← Comprehensive technical documentation
├── README.md
│
└── backend/
    ├── node_modules/                 ← Installed dependencies
    ├── package.json
    ├── package-lock.json
    ├── .env                          ← Active secrets (Internal use)
    ├── .env.example                  ← Environment template for collaborators
    ├── server.js                     ← Entry point: Express middleware & server setup
    │
    ├── config/
    │   └── db.js                     ← MongoDB connection logic
    │
    ├── models/
    │   └── Review.js                 ← Mongoose schema for review documents
    │
    ├── routes/
    │   └── reviewRoutes.js           ← Route definitions mapped to controllers
    │
    ├── controllers/
    │   └── reviewController.js       ← Business logic for all API endpoints
    │
    └── services/
        └── groqService.js            ← Groq API integration (LLaMA 3.3)
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

## 🤝 Collaborative Workflow & Setup

We follow a structured Git workflow to ensure code quality and stability.

### 1. Branching & PR Strategy

- **`main`**: Production-ready code (Protected).
- **`dev`**: Active integration branch.
- **`feature/*`**: Individual feature development.

**Workflow Workflow:**
1.  **Sync**: Ensure your local `dev` is up to date: `git checkout dev && git pull origin dev`.
2.  **Branch**: Create a new feature branch: `git checkout -b feature/your-feature-name`.
3.  **Develop**: Work and commit changes locally.
4.  **Push**: Push to remote: `git push origin feature/your-feature-name`.
5.  **Review**: Open a Pull Request from your feature branch to `dev`. All code must be reviewed before merging.

### 2. Environment Setup

Follow these steps to get the environment running on your machine:

**Prerequisites:**
- Node.js & Git installed.
- MongoDB (Running locally or a [MongoDB Atlas](https://www.mongodb.com/atlas) string).
- [Groq API Key](https://console.groq.com/keys) (Select the `llama-3.3-70b-versatile` model compatibility).

**Installation:**
```bash
# 1. Clone the repository
git clone https://github.com/Sarvan-12/ai-code-review-tool.git
cd ai-code-review-tool/backend

# 2. Install dependencies
npm install

# 3. Configure credentials
cp .env.example .env
```

**Environment Configuration (`.env`):**
Open `.env` and configure your local settings:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_uri # (e.g., mongodb://localhost:27017/ai-code-review)
GROQ_API_KEY=your_gsk_key_here
```

### 3. Running the Project

```bash
# Start development server with Nodemon
npm run dev
```
The API will be live at `http://localhost:5000`. Test endpoints using the **Thunder Client** collection or Postman.

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

