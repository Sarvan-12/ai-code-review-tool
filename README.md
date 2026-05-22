# <img src="https://api.iconify.design/lucide/bot.svg?color=%233b82f6" width="32" height="32" align="absmiddle" /> AI Code Review Tool

An AI-powered application that analyzes source code for bugs, performance bottlenecks, and quality issues using the **Groq API**. Featuring a modern UI with real-time syntax highlighting, advanced history dashboards, and actionable feedback.

---

## <img src="https://api.iconify.design/lucide/sparkles.svg?color=%233b82f6" width="24" height="24" align="absmiddle" /> Features

- <img src="https://api.iconify.design/lucide/palette.svg?color=%233b82f6" width="18" height="18" align="absmiddle" /> **Real-Time Highlighting**: Pro-IDE feel with `react-syntax-highlighter` integrated directly into the input box.
- <img src="https://api.iconify.design/lucide/bar-chart-2.svg?color=%233b82f6" width="18" height="18" align="absmiddle" /> **Advanced Dashboards**: Comprehensive history view for side-by-side comparison of original and refactored code.
- <img src="https://api.iconify.design/lucide/zap.svg?color=%233b82f6" width="18" height="18" align="absmiddle" /> **Ultra-Fast AI**: Powered by Groq's LLaMA 3.3 70B model for high-speed, intelligent reviews.
- <img src="https://api.iconify.design/lucide/gem.svg?color=%233b82f6" width="18" height="18" align="absmiddle" /> **Modern Aesthetic**: Clean, responsive, and beautiful UI designed for developer productivity.

---

## <img src="https://api.iconify.design/lucide/settings.svg?color=%233b82f6" width="24" height="24" align="absmiddle" /> How It Works

`Paste Code` ➔ `Groq AI Analyzes` ➔ `Review Displayed + Saved`

---

## <img src="https://api.iconify.design/lucide/layers.svg?color=%233b82f6" width="24" height="24" align="absmiddle" /> Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 18, Vite, Tailwind CSS |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB, Mongoose |
| **AI Model** | Groq API — LLaMA 3.3 70B |

---

## <img src="https://api.iconify.design/lucide/folder-tree.svg?color=%233b82f6" width="24" height="24" align="absmiddle" /> Project Structure

```text
ai-code-review-tool/
├── backend/                  ← Node.js + Express API
│   ├── controllers/          ← API logic (AI Analysis, History)
│   ├── models/               ← Mongoose schemas
│   ├── routes/               ← Express routes
│   └── services/             ← Groq API integration
├── frontend/                 ← React + Vite (Premium UI)
│   ├── src/
│   │   ├── components/       ← Reusable UI parts
│   │   ├── pages/            ← Main & History views
│   │   └── App.jsx           ← Main application component
```

---

## <img src="https://api.iconify.design/lucide/plug-2.svg?color=%233b82f6" width="24" height="24" align="absmiddle" /> API Endpoints

### Review Routes
- `POST /api/review` - Sends source code to Groq LLaMA 3.3, returns analysis, and saves the result.

### History Routes
- `GET /api/history` - Fetches all historical code reviews from MongoDB.
- `DELETE /api/history` - Clears past review logs.

---

## <img src="https://api.iconify.design/lucide/rocket.svg?color=%233b82f6" width="24" height="24" align="absmiddle" /> Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v18 or higher)
- **Git**
- **MongoDB** (Local instance or Atlas account)
- **Groq API Key** (Get yours at [console.groq.com](https://console.groq.com/keys))

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Sarvan-12/ai-code-review-tool.git
   cd ai-code-review-tool
   ```

2. **Configure Environment Variables:**
   Navigate to the `backend/` folder and create a `.env` file:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   GROQ_API_KEY=your_groq_api_key
   ```
   *(If your frontend needs a custom API URL later, you can add a `.env` in the `frontend/` directory with `VITE_API_BASE_URL`)*

3. **Run the Backend:**
   Open a terminal and run:
   ```bash
   cd backend
   npm install
   npm run dev
   ```

4. **Run the Frontend:**
   Open a second terminal and run:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

The application will be available at `http://localhost:5173`.

---

## <img src="https://api.iconify.design/lucide/users.svg?color=%233b82f6" width="24" height="24" align="absmiddle" /> Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project.
2. Create your feature branch (`git checkout -b feature/AmazingFeature`).
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4. Push to the branch (`git push origin feature/AmazingFeature`).
5. Open a Pull Request.

---

<div align="center">
  <h3><img src="https://api.iconify.design/lucide/star.svg?color=%233b82f6" width="22" height="22" align="absmiddle" /> If you like this project or find it helpful, please consider giving it a star!</h3>
</div>
