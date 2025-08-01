# Server-to-Server Communication Demo

This project demonstrates how different layers of a web application communicate:

## Architecture Flow
```
Frontend (HTML/JS) → Backend API (Express) → Database (SQLite)
     ↓                    ↓                      ↓
  User clicks         API processes          Data stored/
  button              request                retrieved
```

## Components

1. **Frontend** (`public/index.html`): Simple web interface
2. **Backend API** (`server.js`): Express server with REST endpoints
3. **Database** (`database.db`): SQLite database for data persistence

## How to Run

1. Start the server: `npm start`
2. Open browser to `http://localhost:3000`
3. Watch the console logs to see server-to-server communication

## Communication Flow Demo

- Click "Add User" → Frontend sends POST to `/api/users` → Backend saves to database
- Click "Get Users" → Frontend sends GET to `/api/users` → Backend queries database
- All communication is logged with timestamps and details
