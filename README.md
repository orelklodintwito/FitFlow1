# FitFlow 🏃‍♀️🥗
 https://github.com/orelklodintwito/FitFlow1.git
 
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

## 🔁 Core Features & CRUD Operations

FitFlow allows users to fully manage their fitness journey through the following operations:

### 🏁 Challenge Management
- Select a predefined challenge (14 / 30 / 75 days)
- Create a personalized custom challenge
- Update challenge progress
- Track daily completion status

### 🏋️ Workout Tracking (Within Challenge)
- Add workouts to a specific challenge day
- Edit existing workouts
- Delete workouts
- Mark workout as completed

### 📖 Daily Habits Tracking
Within each challenge day, users can track:
- Reading progress
- Daily steps
- Water intake

### 🍽 Meal & Nutrition Management
- Create meals
- View daily meals
- Update meals
- Delete meals
- Track calories & protein intake

### ⭐ Favorites System
- Add recipes from external API to favorites
- Persist favorites using local storage
- Remove recipes from favorites
---

## 📁 Project Structure

FitFlow/
│
├── client/
│   │
│   ├── public/
│   │   └── vite.svg
│   │
│   ├── src/
│   │   │
│   │   ├── admin/
│   │   │   ├── components/
│   │   │   │   ├── AdminChallengeFilter.jsx
│   │   │   │   ├── AdminKpiRow.jsx
│   │   │   │   ├── AdminRecentActivity.jsx
│   │   │   │   ├── AdminRoleFilter.jsx
│   │   │   │   ├── AdminStatusFilter.jsx
│   │   │   │   ├── AvgBmiCard.jsx
│   │   │   │   ├── AvgHeightCard.jsx
│   │   │   │   ├── AvgWeightCard.jsx
│   │   │   │   ├── BmiBar.jsx
│   │   │   │   ├── MiniStatBar.jsx
│   │   │   │   ├── PopularChallengesCard.jsx
│   │   │   │   └── PopularMealsCard.jsx
│   │   │   │
│   │   │   ├── AdminDashboard.jsx
│   │   │   ├── AdminLayout.jsx
│   │   │   ├── AdminRouteGuard.jsx
│   │   │   ├── AdminUsers.jsx
│   │   │   └── admin.css
│   │   │
│   │   ├── assets/
│   │   │   └── images/
│   │   │       ├── chal.png
│   │   │       ├── homeback.png
│   │   │       └── login_bg.png
│   │   │
│   │   ├── challenges/
│   │   │   └── challengeRules.js
│   │   │
│   │   ├── components/
│   │   │   ├── Card.jsx
│   │   │   ├── FoodItem.jsx
│   │   │   ├── Header.jsx
│   │   │   ├── NutritionDonut.jsx
│   │   │   ├── nutritionDonut.css
│   │   │   └── PageState.jsx
│   │   │
│   │   ├── context/
│   │   │   └── FavoritesContext.jsx
│   │   │
│   │   ├── hooks/
│   │   │   ├── useApi.js
│   │   │   ├── useChallengePage.js
│   │   │   ├── useHomeDashboard.js
│   │   │   └── useLocalStorage.js
│   │   │
│   │   ├── modals/
│   │   │   ├── AddWorkoutModal.jsx
│   │   │   ├── EditFoodModal.jsx
│   │   │   ├── EditWorkoutModal.jsx
│   │   │   ├── FoodSearchModal.jsx
│   │   │   └── ManualFoodModal.jsx
│   │   │
│   │   ├── pages/
│   │   │   ├── ApiPage.jsx
│   │   │   ├── ChallengePage.jsx
│   │   │   ├── CreateChallenge.jsx
│   │   │   ├── EditProfilePage.jsx
│   │   │   ├── FoodSearch.jsx
│   │   │   ├── HomePage.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── MealsPage.jsx
│   │   │   ├── NotFound.jsx
│   │   │   ├── SettingsPage.jsx
│   │   │   └── Signup.jsx
│   │   │
│   │   ├── redux/
│   │   │   ├── store.js
│   │   │   └── themeSlice.js
│   │   │
│   │   ├── services/
│   │   │   ├── api.js
│   │   │   ├── auth.js
│   │   │   ├── challenge.js
│   │   │   ├── challengeDays.js
│   │   │   ├── external.js
│   │   │   ├── meals.js
│   │   │   └── workouts.js
│   │   │
│   │   ├── styles/
│   │   │   ├── api.css
│   │   │   ├── auth.css
│   │   │   ├── buttons.css
│   │   │   ├── challenge.css
│   │   │   ├── components.css
│   │   │   ├── global.css
│   │   │   ├── header.css
│   │   │   ├── homepage.css
│   │   │   ├── layout.css
│   │   │   ├── meals.css
│   │   │   └── modal.css
│   │   │
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   ├── .env
│   │   └── production.env
│   │
│   ├── package.json
│   ├── package-lock.json
│   ├── vite.config.js
│   ├── .gitignore
│   ├── .gitattributes
│   ├── eslint.config.js
│   └── index.html
│
├── server/
│   │
│   ├── challenges/
│   │   └── challengeRules.js
│   │
│   ├── controllers/
│   │   ├── adminController.js
│   │   └── authController.js
│   │
│   ├── middleware/
│   │   ├── auth.js
│   │   ├── authMiddleware.js
│   │   └── adminMiddleware.js
│   │
│   ├── models/
│   │   ├── User.js
│   │   ├── Meal.js
│   │   ├── Workout.js
│   │   ├── Challenge.js
│   │   └── ChallengeDay.js
│   │
│   ├── routes/
│   │   ├── adminRoutes.js
│   │   ├── auth.js
│   │   ├── challenges.js
│   │   ├── challengeDays.js
│   │   ├── meals.js
│   │   ├── workouts.js
│   │   └── externalApi.js
│   │
│   ├── index.js
│   ├── package.json
│   ├── package-lock.json
│   └── .env
│
├── structure.txt
└── README.md

## 🚀 How to Run the Project (Local - Optional)

1) Clone the repository:
git clone https://github.com/orelklodintwito/FitFlow1.git
cd FitFlow1

2) Server setup:

cd server  
npm install  

### 📄 Environment Variables

Create a file named `.env` inside the `server` folder based on `.env.example`:

MONGO_URI=your_mongodb_connection_string  
JWT_SECRET=your_secret_key  
PORT=5000  
JWT_EXPIRES=7d  

Run the server:

npm start
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

Email: shlomi@gmail.com 
Password: shlomi  

The admin user has full administrative privileges within the system.

All other registered users are standard users with regular permissions.

## 📝 Notes

- MongoDB must be running and accessible for local development
- .env file is required for the server to work
- This project was built as a final project for a React course

---

## ✅ Author

FitFlow – Final Project
