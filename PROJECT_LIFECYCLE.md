# AI Code Review Tool - Project Lifecycle

This document chronicles the step-by-step development lifecycle of the AI Code Review Tool, breaking down the architecture, logic, and folder structures.

---

## Phase 1: PRD & Planning (The Blueprint)

This phase was all about defining the "Why" and the "What" before writing a single line of code. It set the entire trajectory for the AI Code Review Tool.

### 1. The Problem Statement (The "Why")
The core problem identified was that traditional peer code reviews are notoriously slow. Developers spend too much time waiting for feedback, and subtle logic or styling issues often slip through the cracks. 
**The Goal:** Build a tool that provides instant, automated, and structured AI-generated code reviews with actionable fixes and refactored code.

### 2. Tech Stack Selection (The "How")
To achieve a fast, scalable, and modern application, the team established a powerful stack:
*   **Backend & Frontend:** MERN Stack (MongoDB, Express, React, Node.js) - providing a unified JavaScript ecosystem.
*   **AI Engine:** Groq API leveraging the **LLaMA 3.3** model. Groq was chosen for its blazing-fast inference speeds, ensuring the "instant feedback" requirement was met.
*   **Build Tool/Routing:** Vite for the frontend to ensure fast hot-module replacement and optimal proxying to the backend.

### 3. Defining the Scope & Architecture
The PRD clearly divided the project into functional pillars:
*   **Backend Scope:** A REST API with robust endpoints to communicate with Groq, handle structured JSON responses, and persist review history in MongoDB.
*   **Frontend Scope:** A premium, modular React interface with real-time syntax highlighting, designed to feel like a professional IDE.

### 4. The Core Request Flow
The team mapped out the exact lifecycle of a single user action:
1. User pastes code into the frontend editor.
2. Vite proxies the request to the Express backend.
3. Express validates it and pings the Groq service.
4. Groq returns a structured JSON review.
5. The backend saves this review in MongoDB.
6. The frontend renders the results beautifully.

**The Logic behind Phase 1:**
Jumping straight into coding often leads to messy architecture. By drafting the PRD first, the team established a clear JSON contract for the API, defined the database schema requirements early on, and set a high standard for the UI/UX. This ensured that when backend and frontend development started, both sides knew exactly how the data would flow.

---

## Phase 2: Backend Development

This phase involved building the core server, database schemas, and AI integration logic.

### Directory Structure & Logic

#### 1. The Root Foundation (Project Setup)
Before writing any business logic, the Node.js environment was initialized.
*   **`package.json`**: The first file generated. It tracks dependencies (`express`, `mongoose`, `groq-sdk`, `cors`, `dotenv`) and defines startup scripts.
*   **`.env` & `.env.example`**: Securely stores environment variables like `PORT`, `MONGO_URI`, and `GROQ_API_KEY`.
*   **`server.js`**: **The Entry Point**. The main file that boots up the application, loads environment variables, initializes the Express application, connects to the database, applies middleware, and routes API requests.

#### 2. `config/` Folder (Configuration)
**Why it was created:** To isolate database connection logic from the main server file.
*   **`db.js`**: Contains the `connectDB()` function, using Mongoose to connect to MongoDB. It exits the process if the connection fails, as the app requires a database.

#### 3. `models/` Folder (Database Schemas)
**Why it was created:** To enforce a strict structure on the data saved in MongoDB.
*   **`Review.js`**: Defines the `reviewSchema`. It dictates what a "Review" object looks like (requiring `code`, `language`, `suggestions`, `model`, and `responseTime`).

#### 4. `services/` Folder (External Integrations)
**Why it was created:** To handle complex external logic without bloating controllers.
*   **`groqService.js`**: **The Brain of the AI.** Initializes the Groq client. Contains `getCodeReview()` which wraps user code in a strict system prompt, commanding the LLaMA 3.3 model to return a structured JSON object (`score`, `bugs`, `issues`, `improvements`, `refactored_code`). It handles API rate limits and timeouts.

#### 5. `controllers/` Folder (Business Logic)
**Why it was created:** Controllers act as traffic cops, processing incoming requests, executing logic via services/models, and sending responses.
*   **`reviewController.js`**: 
    *   `submitReview`: Validates code, calls Groq service, saves to MongoDB, returns data.
    *   `getAllReviews` & `getReviewById`: Fetches history.
    *   `deleteHistory` & `deleteAllHistory`: Removes records.

#### 6. `routes/` Folder (API Routing)
**Why it was created:** To map HTTP URLs to specific controller functions.
*   **`reviewRoutes.js`**: A map that binds paths like `POST /review` to the `submitReview` function.

### The Main Logic Flow (Start to Finish)
1. **Boot Up:** `server.js` executes, connects to MongoDB, and listens on port 5000.
2. **Request Arrival:** Frontend sends a `POST` request with code to `/api/review`.
3. **Routing:** `server.js` routes to `reviewRoutes.js`, which triggers `submitReview`.
4. **Processing:** `submitReview` validates code and starts a timer.
5. **AI Generation:** Calls `getCodeReview` in `groqService.js`. The service fetches JSON feedback from LLaMA 3.3 and returns it.
6. **Database Save:** Controller calculates response time and creates a new MongoDB entry via `Review.js`.
7. **Response:** Controller sends a clean JSON response to the frontend.

---

## Appendix: MongoDB Commands Cheat Sheet

To explore the backend data locally, open your `mongosh` terminal and use these commands:

1. **See all databases:**
   ```bash
   show dbs
   ```
2. **Switch to the project database:**
   ```bash
   use ai-code-review
   ```
3. **See all collections (tables):**
   ```bash
   show collections
   ```
4. **View saved code reviews:**
   ```bash
   db.reviews.find().pretty()
   ```
5. **Count total reviews:**
   ```bash
   db.reviews.countDocuments({})
   ```
6. **Clear terminal screen:**
   ```bash
   cls
   ```
7. **Exit Mongosh:**
   ```bash
   exit
   ```

---

## Phase 3: Frontend Foundations

In this phase, the user interface was built to interact with the backend API. The focus was on creating a modular, responsive React application.

### Directory Structure & Logic

#### 1. Root & Setup
*   **`index.html` & `vite.config.js`**: The foundational entry points configured by Vite for ultra-fast local development and proxying API requests to the Express backend.
*   **`src/main.jsx`**: The React entry point that injects the app into the DOM.
*   **`src/App.jsx`**: Manages global state (like backgrounds) and handles routing, dictating which page is currently active.

#### 2. `src/pages/` Folder (Views)
**Why it was created:** To separate full-screen views from smaller, reusable components.
*   **`MainPage.jsx`**: The core application screen. It orchestrates the primary user flow: capturing input, handling the loading state while the AI thinks, and displaying the results.
*   **`HistoryPage.jsx`**: A dedicated view that fetches past reviews from `/api/reviews` and displays them in a structured dashboard layout.

#### 3. `src/components/` Folder (Building Blocks)
**Why it was created:** To create modular, reusable UI elements that keep the code DRY (Don't Repeat Yourself) and maintainable.
*   **`Header.jsx`**: The top navigation bar, establishing the application's branding and providing links between pages.
*   **`CodeInput.jsx`**: The editor component where users paste their code. It manages local state for the text input and the selected programming language.
*   **`ReviewResult.jsx`**: The workhorse of the results display. It receives the structured JSON object from the backend and dictates how the score, bugs, issues, and performance metrics are laid out on the screen.
*   **`IssueList.jsx`**: A reusable sub-component used by `ReviewResult.jsx` to map over arrays of bugs or issues and render them consistently as visually distinct cards.

### The Main Logic Flow (Frontend perspective)
1. **User Input:** The user types code into `CodeInput.jsx` and clicks submit.
2. **State Update:** `MainPage.jsx` updates its state to `isLoading: true` and fires an API request to the backend.
3. **Rendering Loading:** The UI displays a loading animation.
4. **Receiving Data:** The backend responds with the AI's JSON data. `MainPage.jsx` stores this in state.
5. **Displaying Results:** `MainPage.jsx` passes the data down to `ReviewResult.jsx` via props, which in turn passes specific arrays (like bugs) down to `IssueList.jsx` for rendering.

---

## Phase 4: Team Contributions

During this phase, the project shifted from an individual foundation to a collaborative effort. As teammates joined, version control (Git/GitHub) became crucial.

### Workflow & Integration Logic
*   **Modular Architecture Payoff:** Because the frontend was broken into distinct components (`Header`, `CodeInput`, `IssueList`) and the backend was split by logic (`routes`, `controllers`, `services`), teammates could work on different parts of the application simultaneously without causing massive merge conflicts.
*   **Feature Expansion:** Teammates focused on bridging gaps—ensuring the backend error handling correctly communicated with the frontend, standardizing the JSON response parsing, and improving the database query efficiency for the history page.
*   **Git Collaboration:** This phase involved branching strategies, opening Pull Requests (PRs), conducting code reviews (ironically, for the code review tool), and resolving merge conflicts to stabilize the `main` branch.

---

## Phase 5: UI/UX Transformation (The Polish)

The final phase transformed the application from a "functional prototype" into a "premium product." This is where the visual aesthetic and user experience were drastically upgraded.

### The Transformation Logic

#### 1. Glassmorphism Aesthetic
*   **The Shift:** Basic HTML/CSS layouts were replaced with a modern "Glassmorphism" design system. This involved using semi-transparent backgrounds, CSS backdrop filters (`backdrop-filter: blur`), subtle borders, and soft shadows to create a "frosted glass" effect floating over animated gradients.
*   **Why:** To ensure the user is wowed at first glance, achieving a high-end, premium feel.

#### 2. Pro-IDE Experience
*   **Syntax Highlighting:** The raw, plain `<textarea>` for code input and output was upgraded. Libraries like `react-syntax-highlighter` were integrated to provide real-time syntax coloring, making the tool feel like a native code editor (like VS Code).
*   **Refactored Code View:** Implementing the side-by-side or layered view for original vs. refactored code to make it immediately obvious to the developer what changed.

#### 3. Advanced Layout Changes
*   **3-Column History Dashboard:** The simple list of past reviews was rebuilt into a complex, interactive dashboard. 
    *   *Column 1:* A scrollable list of past reviews with visual score rings.
    *   *Column 2:* The detailed analysis (Bugs, Improvements).
    *   *Column 3:* The side-by-side code comparison.
*   **Micro-animations:** Hover effects, smooth transitions on buttons, and dynamic rendering to make the interface feel responsive and alive.

**The Logic behind Phase 5:**
Functionality alone is not enough for modern web apps. The UI/UX transformation was applied last because it is much easier to style a fully functional, state-driven application than it is to build complex logic into a rigid design. This phase elevated the project from a simple student assignment to a professional-grade portfolio piece.
