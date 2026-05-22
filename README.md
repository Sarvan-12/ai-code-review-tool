# 🤖 AI Code Review Tool

An AI-powered application that analyzes source code for bugs, performance bottlenecks, and quality issues using the **Groq API**. Featuring a modern UI with real-time syntax highlighting, advanced history dashboards, and actionable feedback.

![Project Preview](https://via.placeholder.com/1200x600?text=AI+Code+Review+Tool+Preview)

---

## ✨ Features

- **🌈 Real-Time Highlighting**: Pro-IDE feel with `react-syntax-highlighter` integrated directly into the input box.
- **📊 Advanced Dashboards**: Comprehensive history view for side-by-side comparison of original and refactored code.
- **🚀 Ultra-Fast AI**: Powered by Groq's LLaMA 3.3 70B model for high-speed, intelligent reviews.
- **💎 Modern Aesthetic**: Clean, responsive, and beautiful UI designed for developer productivity.

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 18, Vite, Vanilla CSS |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB, Mongoose |
| **AI Model** | Groq API — LLaMA 3.3 70B |

---

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v18 or higher)
- **Git**
- **MongoDB** (Local instance or a [MongoDB Atlas](https://www.mongodb.com/atlas) account)
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

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project.
2. Create your feature branch (`git checkout -b feature/AmazingFeature`).
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4. Push to the branch (`git push origin feature/AmazingFeature`).
5. Open a Pull Request.

---

## 🙏 Acknowledgements

- [Groq](https://groq.com) for the blazing-fast LLaMA inference API
- [React Syntax Highlighter](https://github.com/react-syntax-highlighter/react-syntax-highlighter) for in-editor code highlighting
- [MongoDB Atlas](https://www.mongodb.com/atlas) for cloud database hosting
