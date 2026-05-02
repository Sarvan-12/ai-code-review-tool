# 🤖 AI Code Review Tool (Premium Edition)

An AI-powered application that analyzes source code for bugs, performance bottlenecks, and quality issues using the **Groq API**. Featuring a state-of-the-art **Glassmorphism UI**, real-time syntax highlighting, and advanced history dashboards.

---

## ✨ Key Premium Features

- **💎 Glassmorphism Design**: Frosted glass aesthetic with backdrop blur and soft-gradient animations.
- **🌈 Real-Time Highlighting**: Pro-IDE feel with `react-syntax-highlighter` integrated directly into the input box.
- **📊 Advanced Dashboards**: 3-column history view for side-by-side comparison of original and refactored code.
- **🚀 Ultra-Fast AI**: Powered by Groq's LLaMA 3.3 70B model for high-speed, intelligent reviews.
- **📱 Responsive Layouts**: Built to look stunning on all professional workstation displays.

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
Run this command to clone the project:
```bash
git clone https://github.com/Sarvan-12/ai-code-review-tool.git

# Navigate into the project folder
cd ai-code-review-tool
```

### 2. Branching Workflow
**CRITICAL:** Never work directly on the `main` branch. Always use the `dev` branch for stable development or a feature branch:
```bash
git checkout dev
git pull origin dev
```

### 3. Environment Configuration
You need to set up your secrets in the `backend` folder:
1. Navigate to `backend/`.
2. Create a file named `.env`.
3. Add the following lines:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
GROQ_API_KEY=your_groq_api_key
```

### 4. Installation & Running
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

## 🏗️ Project Structure

```
ai-code-review-tool/
├── backend/                  ← Node.js + Express API
│   ├── controllers/          ← API logic (AI Analysis, History)
│   ├── models/               ← Mongoose schemas
│   └── services/             ← Groq API integration
├── frontend/                 ← React + Vite (Premium UI)
│   ├── src/
│   │   ├── components/       ← Glassmorphism UI parts
│   │   ├── pages/            ← Main & History views
│   │   └── lib/              ← Utility functions
├── prd.md                    ← Product Requirements
└── DOCUMENTATION.md          ← Deep technical details
```

---

## ⚠️ Git Rules
- **Rule 1**: Always pull before starting work.
- **Rule 2**: **Never push to `main`**. All features must go to `dev` first.
- **Rule 3**: Use descriptive commit messages (e.g., `style: upgrade glassmorphism`).
