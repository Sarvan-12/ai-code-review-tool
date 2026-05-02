# AI-Based Code Review Tool
**Product Requirements Document**

**Stack:** MERN + Groq API  
**Version:** v1.1 (Premium Edition)
**AI Provider:** Groq (LLaMA 3.3)  

---

## 1. Problem Statement
Developers need fast, consistent feedback on code quality. Peer reviews are slow, and many logic/style issues go unnoticed. This tool provides instant AI-generated reviews with actionable fixes and refactored code.

---

## 2. Project Scope

### ✅ Completed (Backend)
- **Groq API Integration**: Seamless communication with LLaMA 3.3 for structured JSON feedback.
- **REST API**: Robust endpoints for submitting reviews and retrieving history.
- **Database**: MongoDB storage for persistent review records and performance metadata.
- **Response Handling**: Stable JSON contract with error envelopes.

### ✅ Completed (Frontend Premium UI)
- **Glassmorphism Design System**: High-end frosted glass aesthetic across all components.
- **Real-Time Syntax Highlighting**: Integrated `react-syntax-highlighter` for a pro-IDE feel in the input box.
- **Animated Backgrounds**: Soft oklch-based animated gradients.
- **3-Column History Dashboard**: Advanced layout for comparing original and refactored code history.
- **Component Architecture**: Modular React components (`Header`, `CodeInput`, `ReviewResult`, `IssueList`).
- **API Integration**: Fully connected to the backend `/api/review` endpoint via Vite proxy.

---

## 3. Core Request Flow

| Step | Component | Action |
| :--- | :--- | :--- |
| 1 | **Frontend** | User pastes code into the syntax-highlighted editor. |
| 2 | **Vite Proxy** | Forwards request to local backend at port 5000. |
| 3 | **Express API** | Validates input and triggers Groq Service. |
| 4 | **Groq API** | Generates structured JSON review. |
| 5 | **MongoDB** | Persists the review result. |
| 6 | **Frontend** | Renders glassmorphism sections and highlighted refactored code. |

---

## 4. API Specification

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/review` | Submit code for AI analysis |
| `GET` | `/api/reviews` | Retrieve full history of reviews |
| `DELETE` | `/api/history/:id`| Delete a single history record |
| `DELETE` | `/api/history/all`| Clear all history |
| `GET` | `/api/health` | Check system status |