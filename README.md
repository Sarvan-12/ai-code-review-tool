# 🤖 AI Code Review Tool

An AI-powered application that analyzes source code for bugs, performance bottlenecks, and quality issues using the **Groq API**. It provides developers with instant feedback, quality scores, and refactored code suggestions to accelerate the development lifecycle.

---

## 🛠️ Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v18 or higher)
- **Git**
- **MongoDB** (Local instance or a [MongoDB Atlas](https://www.mongodb.com/atlas) account)
- **Groq API Key** (Get yours at [console.groq.com](https://console.groq.com/keys))

---

## 🚀 Step-by-Step Setup

### 1. Cloning the Repository
Run this command to clone the project (this will automatically create the `ai-code-review-tool` folder):
```bash
git clone https://github.com/Sarvan-12/ai-code-review-tool.git

# Navigate into the project folder
cd ai-code-review-tool
```

### 2. Branching Workflow
**CRITICAL:** Never work directly on the `main` or `dev` branches. Always create a feature branch:
```bash
# 1. Switch to the dev branch
git checkout dev

# 2. Pull the latest changes
git pull origin dev

# 3. Create your own feature branch
git checkout -b feature/your-task-name
```

### 3. Environment Configuration
You need to set up your secrets in the `backend` folder:
1. Navigate to `backend/`.
2. Create a file named `.env`.
3. Add the following lines and fill in your actual credentials:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
GROQ_API_KEY=your_groq_api_key
```

### 4. Installation & Running
You must run both the backend and the frontend in separate terminals.

**Terminal 1 (Backend):**
```bash
cd backend
npm install
npm run dev
```

**Terminal 2 (Frontend):**
```bash
cd frontend
npm install
npm run dev
```
The frontend runs on `http://localhost:5173` and the backend on `http://localhost:5000`.

---

## 🤝 How to Contribute

Once you have finished your task, follow these steps to submit your work:

1. **Commit your changes**:
   ```bash
   git add .
   git commit -m "feat: added character counter to UI"
   ```
2. **Push to GitHub**:
   ```bash
   git push origin feature/your-task-name
   ```
3. **Open a Pull Request**: 
   - Go to the GitHub repository.
   - Click **New Pull Request**.
   - Set **Base branch: `dev`** and **Compare branch: `your-feature-branch`**.
   - Add a proper title and description of your work.
   - Tag the repo owner for review.

---

## 🏗️ Project Structure

```
ai-code-review-tool/
├── backend/                  ← Node.js + Express API
│   ├── config/               ← Database connection
│   ├── controllers/          ← API logic
│   ├── models/               ← Mongoose schemas
│   ├── routes/               ← API endpoints
│   └── services/             ← Groq API integration
├── frontend/                 ← React + Vite UI
│   ├── src/
│   │   ├── components/       ← Reusable UI parts
│   │   ├── App.jsx           ← Main orchestration
│   │   └── App.css           ← Modern styling
├── prd.md                    ← Product Requirements
└── DOCUMENTATION.md          ← Deep technical details
```

---

## ⚠️ Git Rules & Daily Workflow

To keep our codebase clean and prevent mistakes, please follow these rules strictly:

- **Rule 1**: Always `git pull origin dev` before starting new work to avoid merge conflicts.
- **Rule 2**: **Never push to `main`**. All features must go to `dev` via Pull Request first.
- **Rule 3**: Use descriptive commit messages (e.g., `fix: scroll issue` instead of `updated code`).
- **Rule 4**: If you get stuck on a merge conflict, ask a teammate before forcing a push.

### 🔄 Sync your branch with latest dev
If your teammates have merged new code into `dev`, you need to sync your branch:
```bash
git checkout dev
git pull origin dev
git checkout feature/your-task-name
git merge dev
```

### ❗ Important: Do NOT commit these files
The following files are ignored for security and stability. Ensure they are never committed:
- `node_modules/` (Dependencies)
- `.env` (Your private API keys)
- `frontend/.vite/` (Vite cache)
