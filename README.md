# Expense Tracker

A full-stack expense tracking application built with a React + Vite frontend and an Express + MongoDB backend.

This project helps users:

- create an account and sign in securely
- add and manage income records
- add and manage expense records
- view dashboard summaries for balance, savings, and category spending
- track recent transactions across the app
- export income and expense data
- contact support from the in-app support modal

## Tech Stack

### Frontend

- React
- Vite
- Tailwind CSS
- Framer Motion
- Recharts
- Axios
- EmailJS
- canvas-confetti
- Lucide React

### Backend

- Node.js
- Express
- MongoDB Atlas
- Mongoose
- JWT authentication
- bcryptjs
- XLSX

## Project Structure

```text
Finance Tracker/
|-- Backend/
|   |-- config/
|   |-- controller/
|   |-- middleware/
|   |-- models/
|   |-- routes/
|   |-- utils/
|   |-- .env.example
|   |-- package.json
|   `-- server.js
|-- Frontend/
|   |-- public/
|   |-- src/
|   |   |-- components/
|   |   |-- hooks/
|   |   |-- pages/
|   |   `-- utils/
|   |-- package.json
|   `-- vite.config.js
`-- README.md
```

## Main Features

### Authentication

- user registration
- user login
- session persistence in local storage
- protected routes for dashboard and transaction pages

### Income Management

- add income entries
- view income overview by range
- delete income entries
- export income data to Excel and CSV
- animated feedback after adding income

### Expense Management

- add expense entries
- view expense overview by range
- delete expense entries
- export expense data to Excel and CSV
- threshold-based spending alerts

### Dashboard

- total balance summary
- current month income and expense cards
- savings rate display
- recent transaction feed
- category-wise expense breakdown
- animated balance counter
- support for daily, weekly, monthly, and yearly filtering in key views

### Spending Alerts

- 70% of monthly income used: warning toast
- 85% of monthly income used: warning card on dashboard
- 95% of monthly income used: critical breakdown modal

### Support Modal

- contact form powered by EmailJS
- FAQ accordion with smooth expand/collapse animation
- opens directly from the sidebar Support button

## Screens and Pages

- `Login`
- `Signup`
- `Dashboard`
- `Income`
- `Expense`
- `Profile`

## Backend API Overview

Base URL:

```text
http://localhost:4000/api
```

### User Routes

- `POST /api/user/register`
- `POST /api/user/login`
- `GET /api/user/me`
- `PUT /api/user/profileUpdate`

### Income Routes

- `POST /api/income/add`
- `GET /api/income/get`
- `PUT /api/income/update/:id`
- `DELETE /api/income/delete/:id`
- `GET /api/income/download`
- `GET /api/income/overview?range=monthly`

### Expense Routes

- `POST /api/expense/add`
- `GET /api/expense/get`
- `PUT /api/expense/update/:id`
- `DELETE /api/expense/delete/:id`
- `GET /api/expense/download`
- `GET /api/expense/overview?range=monthly`

### Dashboard Route

- `GET /api/dashboard/overview`

## Environment Variables

### Backend

Create a file at:

`Backend/.env`

Example:

```env
MONGODB_URI=your_mongodb_connection_string
PORT=4000
```

You can start from:

`Backend/.env.example`

### Frontend

If the frontend is not calling the local backend by default, create:

`Frontend/.env`

Example:

```env
VITE_API_BASE_URL=http://localhost:4000/api
```

If this variable is not set, the frontend already falls back to:

```text
http://localhost:4000/api
```

## Installation

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd "Finance Tracker"
```

### 2. Install backend dependencies

```bash
cd Backend
npm install
```

### 3. Install frontend dependencies

```bash
cd ../Frontend
npm install
```

## Running the Project Locally

### Start the backend

From `Backend`:

```bash
npm start
```

Backend runs on:

```text
http://localhost:4000
```

### Start the frontend

From `Frontend`:

```bash
npm run dev
```

Frontend runs on:

```text
http://localhost:5173
```

## Available Scripts

### Backend

From `Backend/package.json`:

- `npm start` - starts the Express server with nodemon

## Authentication Flow

1. User signs up or logs in from the frontend
2. Backend returns a JWT token
3. Frontend stores token and user info in local storage
4. Protected API requests include `Authorization: Bearer <token>`
5. Protected routes are unlocked after authentication

## Data Notes

- transaction records are stored per authenticated user
- future transaction dates are blocked in the form and rejected by the API
- monthly dashboard summaries are calculated from the current calendar month
- recent transactions are sorted by transaction date
- income and expense pages support filtered overview ranges

## Export Support

The app currently supports:

- CSV export from the frontend transaction pages
- Excel export from backend download endpoints



## Deployment Notes

Typical deployment setup:

- frontend on Vercel or Render
- backend on Render, Railway, or any Node hosting provider
- MongoDB on MongoDB Atlas

## Future Improvements

- edit transaction support in the UI
- stronger backend validation and sanitization
- automated tests for API and frontend flows
- pagination for transaction history
- budget goals and category-level limits
- admin/support dashboard for incoming support messages

## Author

Built as an Expense Tracker project using React, Vite, Express, and MongoDB.
