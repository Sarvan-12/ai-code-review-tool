# AI-Based Code Review Tool
**Product Requirements Document**

**Stack:** MERN + Groq API  
**Version:** v1.0  
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

### ✅ Completed (Frontend Boilerplate)
- **React + Vite Setup**: A functional frontend proof-of-concept is complete.
- **API Integration**: Connected to the backend `/api/review` endpoint.
- **Base UI**: Includes code input and result display sections. Ready for team members to extend with advanced features and polished styling.

---

## 3. Core Request Flow

| Step | Component | Action |
| :--- | :--- | :--- |
| 1 | **Frontend** | User pastes code and selects language. |
| 2 | **Vite Proxy** | Forwards request to local backend at port 5000. |
| 3 | **Express API** | Validates input and triggers Groq Service. |
| 4 | **Groq API** | Generates structured JSON review. |
| 5 | **MongoDB** | Persists the review result. |
| 6 | **Frontend** | Renders sections based on the AI feedback. |

---

## 4. API Specification

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/review` | Submit code for AI analysis |
| `GET` | `/api/reviews` | Retrieve full history of reviews |
| `GET` | `/api/health` | Check system status |