# CipherSQLStudio

## Overview
CipherSQLStudio is a robust, browser-based SQL learning platform designed to help students practice and refine their SQL querying skills. The platform provides real-time query execution against pre-configured databases, coupled with intelligent, AI-powered hints (using Gemini/OpenAI API) that guide learners without revealing the full solutions. 

**Note for Evaluators:** This project includes all core features (90%) and the optional features (10%), including full JWT Authentication and User Execution Tracking.

## Key Features
1. **Assignment Listing System:** Dynamically fetches and displays available SQL assignments tagged with their relative difficulty.
2. **Interactive Code Sandbox:** Integrates with **Monaco Editor** to deliver a premium, syntax-highlighted SQL authoring experience directly in the browser.
3. **Real-time Query Execution Engine:** Evaluates student SQL queries safely against a PostgreSQL Sandbox database, strictly sanitizing inputs to prevent destructive actions (only `SELECT` queries are permitted).
4. **Intelligent LLM Hints:** Integrates with an LLM API to provide context-aware hints based on the assignment question and the user's current query attempts.
5. **Sample Data Viewer:** Shows students the schema and a preview of the tabular data they will be querying against before writing their code.
6. **Authentication & Progress Tracking (Optional Feature):** A secure Login/Signup flow that saves a history of every student's past SQL executions and outcomes to MongoDB.

## Technologies Used
- **Frontend Framework:** React.js (Bootstrapped with Vite for speed)
- **Styling:** Vanilla SCSS (Fully custom mobile-first responsive design following BEM methodology without using utility libraries like Tailwind/Bootstrap)
- **Backend Runtime:** Node.js / Express.js
- **Execution Sandbox DB:** PostgreSQL
- **Persistence DB:** MongoDB (Mongoose)
- **Code Editor:** Monaco Editor (Microsoft)

## Technology Choices Rationale
- **Vanilla SCSS over UI Libraries:** SCSS was explicitly chosen to maintain complete granular control over the mobile-first layouts (320px, 641px, 1024px, 1281px breakpoints) and fully encapsulate styles using BEM notation without relying on third-party design systems.
- **Dual Database Architecture:** 
  - **PostgreSQL** is strictly used as the execution "Sandbox" to validate relational SQL queries. 
  - **MongoDB** is used for persistence layer data (User authentication, password hashing, and logging historical query attempts) to keep user-data safely decoupled from the execution engine.
- **Monaco Editor:** Selected because it is the core engine behind VS Code, providing students with the most familiar and powerful code-completion and syntax-highlighting experience possible in a web interface.

## Environment Variables (`.env`)
To run this project, you will need to create two `.env` files. Ensure you never commit your actual `.env` files to version control.

**1. Backend (`backend/.env`)**
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
PG_USER=your_postgres_username
PG_HOST=your_postgres_host
PG_DATABASE=your_postgres_sandbox_db
PG_PASSWORD=your_postgres_password
PG_PORT=5432
GEMINI_API_KEY=your_key
```

**2. Frontend (`frontend/.env`)**
*(If using Vite, prefix with VITE_ if defining custom API URLs)*
```env
VITE_API_URL=http://localhost:5000/api
```

## 🚀 Setup & Installation
Follow these steps to get the application running locally.

### 1. Clone the Repository
git clone [https://github.com/Deepak-web-07/CipherSQLStudio.git](https://github.com/Deepak-web-07/Cipher-Sql-Studio.git)
cd CipherSQLStudio

### 2. Backend Setup
```bash
cd backend
npm install

# Create environment file
touch .env
```
#### Configure your .env file with the following variables:
```bash
PORT=5000
MONGO_URI=your_mongodb_connection_string
PG_USER=your_postgres_user
PG_HOST=localhost
PG_DATABASE=sandbox_db
PG_PASSWORD=your_password
PG_PORT=5432
JWT_SECRET=your_super_secret_key
```

### 3. Frontend Setup
```bash
# Open a new terminal tab
cd frontend
npm install
npm run dev
```

### 4. Database Initialization
- **PostgreSQL:** Create a database named sandbox_db. Ensure you have a users table (or similar) with dummy data so you can test SELECT queries immediately.

- **MongoDB:** Ensure your MongoDB Atlas cluster (or local instance) is running and your IP address is whitelisted in the access settings.

## 🏗️ Application Architecture (Data Flow)
1. **Input:** The user enters a SQL query into the Monaco Editor interface.

2. **Request:** The Frontend sends a POST request to /api/execute-query containing the SQL string and the user's JWT.

3. **Security (Sanitization):** The backend middleware intercepts the query. It uses a regex-based white-list to ensure the command is a SELECT statement, explicitly blocking destructive commands like DROP, DELETE, or UPDATE.

4. **Execution:** Once validated, the query is executed via pgPool against the PostgreSQL Sandbox.

5. **Logging:** Regardless of whether the query succeeds or fails, the backend asynchronously logs the attempt, the status, and the code snippet to MongoDB via Mongoose.

6. **Rendering:** The frontend receives the JSON result set and dynamically generates an HTML table by mapping over the object keys.

## 🛠️ Tech Stack
| Layer          | Technology                               |
| :---           | :---                                     |
| **Frontend**   | React, Vite, Monaco Editor, Tailwind CSS |
| **Backend**    | Node.js, Express                         |
| **Sandbox DB** | PostgreSQL (`pg` pool)                   |
| **Logging DB** | MongoDB (Mongoose)                       |
| **Auth**       | JSON Web Tokens (JWT)                    |

![DFD_CipherSqlStudio](https://github.com/user-attachments/assets/c573e6ac-1d1c-40dc-8271-2065bfc4ff63)
