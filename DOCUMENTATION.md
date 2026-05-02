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
2. **Validation Layer:** The controller intercepts the request, ensuring the inputs exist and that `code` stays under the 5,000-character upper limit.
3. **Service Layer (AI Integration):** The payload is handed to `groqService.js`. A specialized LLM prompt is constructed demanding strict JSON structure.
4. **Resilience & Parsing:** Groq SDK errors are intercepted natively. Escaping errors inherent to LLM-generated JSON are safely parsed and preserved via regex-stripping fallbacks.
5. **Persistence Layer:** The metrics (`responseTime`, `model`), inputs, and formatted `suggestions` are saved to MongoDB.
6. **Client Response:** An enveloped JSON payload (`{ success: true, data: { ... } }`) is surfaced back to the client.

---

## 3. Directory Structure

```text
ai-code-review-tool/
├── backend/
│   ├── server.js         # Entry point: Server initialization
│   ├── config/           # Database connection logic
│   ├── models/           # Mongoose schema definitions
│   ├── routes/           # Express Router mapping
│   ├── controllers/      # Business logic and validation
│   └── services/         # Groq SDK integration
│
└── frontend/
    ├── src/
    │   ├── components/   # Glassmorphism UI components
    │   ├── pages/        # MainPage and HistoryPage
    │   ├── App.jsx       # Routing and Global Background
    │   └── lib/          # Utility functions (cn merger)
    └── vite.config.js    # Proxy & Build settings
```

---

## 4. API Endpoints Contract

### 4.1 List All Reviews
**Endpoint:** `GET /api/reviews`  
Fetches the entire array of previously submitted code reviews, sorted from newest to oldest.

### 4.2 Delete History
**Endpoint:** `DELETE /api/history/:id`  
Deletes a specific review record by ID.

**Endpoint:** `DELETE /api/history/all`  
CRITICAL: Permanently clears the entire MongoDB collection for reviews.

---

## 5. Premium Frontend Architecture

The frontend is a high-performance **React SPA** modernized with a **Glassmorphism Design System**.

### 5.1 Glassmorphism & UI System
- **Visuals**: Uses `backdrop-filter: blur(24px)` and `linear-gradient` overlays to create a "frosted glass" effect.
- **Styling**: Leverages an **Inline-Style System** for maximum performance and atomic control over premium effects.
- **Background**: An animated `BgradientAnim` component provides a soft, oklch-based color-shifting background that sits behind the UI.

### 5.2 Layered Editor Architecture
The `CodeInput.jsx` component uses a layered strategy to provide real-time syntax highlighting:
1. **Background Layer**: A `react-syntax-highlighter` (Prism) component renders the highlighted code based on the selected language.
2. **Foreground Layer**: A transparent `<textarea>` sits perfectly on top, allowing users to type while seeing the highlights beneath them.
3. **Synchronization**: The text content is shared via state, ensuring the highlights update instantly as the user types.

### 5.3 3-Column History Dashboard
The `HistoryPage.jsx` implements a complex state-driven layout:
- **Sidebar (Col 1)**: A scrollable list of past reviews with "Score Rings".
- **Analysis (Col 2)**: Detailed issue lists (Bugs, Security, Performance) for the active record.
- **Comparison (Col 3)**: Side-by-side view of the **Original Source** vs. the **Refactored Result**, both with syntax highlighting.

### 5.4 Component Tree
- **App.jsx**: Global background and routing.
- **Header.jsx**: Premium hero section with animated navigation pills.
- **MainPage.jsx**: Orchestrates the input and results flow.
    - **CodeInput.jsx**: The layered IDE-style editor.
    - **ReviewResult.jsx**: The glassmorphism analysis display.
- **HistoryPage.jsx**: The 3-column historic analysis dashboard.
- **IssueList.jsx**: Reusable glass-card issue renderer.
4. **Hydration**: The API response hydrates the `reviewData` state, which is passed down to `ReviewResult` and its children for rendering.
