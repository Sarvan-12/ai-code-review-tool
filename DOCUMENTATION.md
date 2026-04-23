# AI Code Review Tool — Technical Documentation

## 1. Project Overview
The **AI Code Review Tool** is a backend service designed to provide automated, intelligent, and developer-friendly code reviews. By leveraging the **Groq API** and the **LLaMA 3.3 70B** model, the API acts as a virtual pair-programmer, analyzing code snippets and surfacing actionable bugs, code quality suggestions, and performance bottlenecks.

### Core Objectives
- Provide near-instantaneous feedback on code submissions.
- Ensure strict JSON-structured output (`issues`, `fixes`, `score`, and `refactored_code`) so the frontend can reliably parse and render suggestions.
- Store all completed reviews in MongoDB for historic tracking and analytics.

---

## 2. System Architecture

The application follows a standard REST API architecture built upon the **MERN** stack (specifically Node.js, Express, and MongoDB), strictly segregating HTTP routing from business logic and third-party API integration.

### High-Level Flow
1. **Client Request:** Frontend sends a POST request containing `code` and `language`.
2. **Validation Layer:** The controller intercepts the request, ensuring the inputs exist and that `code` stays under the 5,000-character upper limit to prevent rate-limit burns.
3. **Service Layer (AI Integration):** The payload is handed to `groqService.js`. A specialized LLM prompt is constructed demanding strict JSON structure (`response_format: { type: "json_object" }`).
4. **Resilience & Parsing:** Groq SDK errors are intercepted natively. Escaping errors inherent to LLM-generated JSON are safely parsed and preserved via regex-stripping fallbacks.
5. **Persistence Layer:** The metrics (`responseTime`, `model`), inputs, and formatted `suggestions` are saved to MongoDB as a unique document via Mongoose.
6. **Client Response:** An enveloped JSON payload (`{ success: true, data: { ... } }`) is surfaced back to the client.

### Technology Stack
- **Runtime Environment:** Node.js
- **Server Framework:** Express.js
- **Database:** MongoDB
- **ODM:** Mongoose
- **AI Processing:** Groq Developer API
- **AI Model:** `llama-3.3-70b-versatile` (chosen for superior logical consistency over 8B variants)

---

## 3. Directory Structure

```text
ai-code-review-tool/
├── .env                  # Environment secrets (IGNORED IN GIT)
├── .gitignore            # Git exclusion rules 
├── prd.md                # Historic Product Requirements Document
├── README.md             # Developer setup instructions
├── DOCUMENTATION.md      # This file
│
└── backend/
    ├── package.json      # Node.js dependencies
    ├── server.js         # Entry point: Server initialization and middleware setup
    │
    ├── config/
    │   └── db.js         # Mongoose DB connection logic
    │
    ├── models/
    │   └── Review.js     # Mongoose schema definitions (code, suggestions object)
    │
    ├── routes/
    │   └── reviewRoutes.js     # Express Router mapping HTTP verbs to controllers
    │
    ├── controllers/
    │   └── reviewController.js # Business logic and validation checks
    │
    └── services/
        └── groqService.js      # Groq SDK integration, prompting, and parsing logic
```

---

## 4. API Endpoints Contract

The API utilizes a standardized response wrapper envelope for all endpoints:
- **Success Form:** `{ "success": true, "data": { ... } }`
- **Error Form:** `{ "success": false, "error": "Error message" }`

### 4.1 Health Check
**Endpoint:** `GET /api/health`  
Returns the operational status of the server. Useful for pinging and alive checks.

### 4.2 Submit Code Review
**Endpoint:** `POST /api/review`  
Synchronously triggers the AI code review process.

**Request Payload:**
```json
{
  "code": "function add(a, b) { return a+b }",
  "language": "javascript"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "id": "64abc12347...",
    "language": "javascript",
    "model": "llama-3.3-70b-versatile",
    "responseTime": 850,
    "suggestions": {
      "score": 8,
      "bugs": [],
      "issues": [
        { "issue": "Missing type hints", "fix": "Add type annotations if using TS or JSDoc" }
      ],
      "improvements": [],
      "performance": [],
      "refactored_code": "/**\n* @param {number} a\n* @param {number} b\n*/\nfunction add(a, b) { return a + b }"
    },
    "createdAt": "2026-04-23T10:30:00Z"
  }
}
```

### 4.3 Fetch Specific Review
**Endpoint:** `GET /api/review/:id`  
Returns the full historic Review Document matching the Mongoose `ObjectId`.

### 4.4 List All Reviews
**Endpoint:** `GET /api/reviews`  
Fetches the entire array of previously submitted code reviews, sorted from newest to oldest.

---

## 5. Security and Constraints
1. **Character Limit:** Arbitrary constraints enforce a maximum payload length of `5000` characters to protect against DDOS-style rate-limit spikes on the Groq tier.
2. **Environment Variables:** API keys and Database URIs are read purely from environment bindings (`process.env`).
3. **JSON Resilience:** LLMs occasionally corrupt nested quotes. We intercept raw `failed_generation` data natively dumped by Groq and funnel it safely back as raw strings so critical data is never swallowed entirely during SDK parsing failures.
