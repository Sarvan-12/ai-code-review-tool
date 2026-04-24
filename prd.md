# AI-Based Code Review Tool
**Product Requirements Document**

**Stack:** MERN + Groq API  
**Version:** v1.0 (Production-Ready)  
**Date:** April 2026  
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

### ✅ Completed (Frontend)
- **Modern UI**: Sleek dark-mode interface with a centered, responsive layout.
- **Modular Components**: Structured React code with reusable components (Header, CodeInput, ResultCard).
- **Rich Results**: Actionable sections for Bugs, Issues, Improvements, and Performance.
- **Code Refactoring**: Dedicated section for AI-suggested refactored code.
- **Performance Info**: Visibility into AI model used and response latency.

---

## 3. Core Request Flow

| Step | Component | Action |
| :--- | :--- | :--- |
| 1 | **Frontend** | User pastes code and selects language. |
| 2 | **Vite Proxy** | Forwards request to local backend at port 5000. |
| 3 | **Express API** | Validates input and triggers Groq Service. |
| 4 | **Groq API** | Generates structured JSON review. |
| 5 | **MongoDB** | Persists the review result. |
| 6 | **Frontend** | Renders sections based on the `suggestions` object. |

---

## 4. API Specification

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/review` | Submit code for AI analysis |
| `GET` | `/api/reviews` | Retrieve full history of reviews |
| `GET` | `/api/health` | Check system status |

---

## 5. UI Requirements (v1.0)
- **Centered Layout**: Max-width 1000px for optimal readability.
- **States**: Clear hover effects, disabled buttons during loading, and error boxes.
- **Score Badge**: Color-coded (Green/Amber/Red) based on the AI quality score.
- **Issue Breakdown**: Categorized sections using clear icons and meaningful summaries.

---

## 6. Folder Structure

```
ai-code-review-tool/
├── backend/                  ← Node.js + Express
│   ├── controllers/          ← Business logic
│   ├── services/             ← Groq API Service
│   └── models/               ← Mongoose Schemas
└── frontend/                 ← React + Vite
    ├── src/components/       ← UI Building blocks
    └── App.jsx               ← State and orchestration
```

---

## 7. Assumptions & Constraints
- **Model**: Uses `llama-3.3-70b-versatile` for high-quality reasoning.
- **Security**: No authentication in v1.0; internal tool focus.
- **Rate Limits**: 5000 character limit per submission to ensure API stability.