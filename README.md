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

## 🌐 Live Deployment

This project is deployed and can be tested online:

Live App (Client): https://fitflow1-1.onrender.com  
Server API: https://fitflow1.onrender.com  

Note: The project is fully functional in production.  
Running locally is optional and provided below for development purposes.

---

## 🧱 Tech Stack

Client:
- React
- React Router
- Redux Toolkit
- Context API
- Custom Hooks
- CSS (custom styling)

Server:
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

## 🚀 How to Run the Project (Local - Optional)

1) Clone the repository:
git clone https://github.com/orelklodintwito/FitFlow1.git
cd FitFlow1

2) Server setup:
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

3) Client setup:
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
## 🧩 Business Rules & Application Logic

This section defines the core operational logic of FitFlow, including health metrics calculation, calorie assumptions, challenge validation rules, and role-based access control.

---

### 📊 BMI Classification (According to WHO)

The system calculates Body Mass Index (BMI) based on World Health Organization (WHO) standards.

**BMI Categories:**

- **Underweight**  
  BMI < 18.5  
  Color: Blue  

- **Normal**  
  BMI 18.5 – 24.9  
  Color: Green  

- **Overweight**  
  BMI 25.0 – 29.9  
  Color: Yellow  

- **Obese**  
  BMI 30.0 – 34.9  
  Color: Orange  

- **Extremely Obese**  
  BMI ≥ 35.0  
  Color: Red  

BMI is calculated using the standard formula:

BMI = weight (kg) / height² (m)

Each category is visually represented in the UI using its corresponding color indicator.

---

### 🔥 Daily Calorie Assumption

The system uses a fixed daily calorie target of **2000 kcal** for all users.

This assumption is based on the understanding that users participating in platform challenges are physically active individuals, and 2000 kcal represents the recommended average intake for active participants.

This value applies to all standard challenges unless stated otherwise.

---

### 🏁 Challenge Completion Logic

#### Standard Challenges (14 / 30 / 75 Days)

To complete a challenge day, the user must complete all required tasks except one.

The daily progress bar is considered complete if all tasks are finished, allowing for one uncompleted task.

#### Personalized Challenge

In the Personalized Challenge, daily completion is calculated differently.

The progress bar is filled solely based on meeting the daily calorie target.

If the user reaches the 2000 kcal goal, the day is marked as complete regardless of other tasks.

---

### 🔐 User Roles & Access Control

**Admin User**

Email: adminn@test.com  
Password: 1111  

The admin user has full administrative privileges within the system.

All other registered users are standard users with regular permissions.

## 📝 Notes

- MongoDB must be running and accessible for local development
- .env file is required for the server to work
- This project was built as a final project for a React course

---

## ✅ Author

FitFlow – Final Project
