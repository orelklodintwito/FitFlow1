# FitFlow 🏃‍♀️🥗

FitFlow is a full-stack fitness and nutrition tracking web application built with React, Node.js, and MongoDB.

The app allows users to:
- Track daily meals (calories & protein)
- Manage fitness challenges (14 / 30 / 75 days or custom)
- Track daily habits (workouts, water, steps, reading)
- Explore healthy recipes via an external API
- Save favorite meals
- Persist user progress across sessions

---

## 🧱 Tech Stack

### Client
- React
- React Router
- Redux Toolkit
- Context API
- Custom Hooks
- CSS (custom styling)

### Server
- Node.js
- Express
- MongoDB + Mongoose
- JWT Authentication

---

## 📁 Project Structure

FitFlow/
├── client/
│   ├── src/
│   │   ├── pages/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── context/
│   │   ├── redux/
│   │   └── styles/
│   └── package.json
│
├── server/
│   ├── routes/
│   ├── controllers/
│   ├── models/
│   ├── middleware/
│   └── server.js
│
└── README.md

---

## 🚀 How to Run the Project

### 1. Clone the repository

git clone https://github.com/orelklodintwito/FitFlow1.git  
cd FitFlow1

---

### 2. Server Setup

cd server  
npm install

Create a .env file inside the server folder:

MONGO_URI=your_mongodb_connection_string  
JWT_SECRET=your_jwt_secret  
PORT=5000

Run the server:

npm start

Server runs on:  
http://localhost:5000

---

### 3. Client Setup

cd client  
npm install  
npm run dev

Client runs on:  
http://localhost:5173

---

## 🔐 Authentication

- Users can register and log in
- Authentication is handled with JWT
- Token is stored in local storage
- Protected routes require authentication

---

## 🔄 Data & State Management

- API communication handled via custom hooks (useApi)
- Global UI state (theme) managed with Redux
- Favorites handled via React Context
- Local storage used for:
  - Auth token
  - Theme preference
  - User metrics (height / weight)

---

## 🧪 Error Handling & UX States

The app handles:
- Loading states
- Empty states
- API/server errors
- Page refresh during active sessions

Each main page displays clear feedback for these states.

---

## 🌐 External API

- Recipe data is fetched from TheMealDB API
- Users can search meals and add them to favorites

---

## 📝 Notes

- MongoDB must be running and accessible
- .env file is required for the server to work
- This project was built as a final project for a React course

---

## ✅ Author

FitFlow – Final Project
