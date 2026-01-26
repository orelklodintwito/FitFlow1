require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

// ===== ROUTES =====
const authRoutes = require("./routes/auth");
const challengeRoutes = require("./routes/challenges");
const challengeDaysRoutes = require("./routes/challengeDays");
const workoutsRoutes = require("./routes/workouts");
const mealsRoutes = require("./routes/meals");
const externalApiRoutes = require("./routes/externalApi");

const app = express();

/* ===================== MIDDLEWARE ===================== */
app.use(express.json());

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
// ✅ טיפול מפורש ב־preflight
app.use(cors());


/* ===================== DATABASE ===================== */
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err.message);
    process.exit(1);
  });

/* ===================== TEST ROUTE ===================== */
app.get("/", (req, res) => {
  res.status(200).send("FitFlow server is running");
});

/* ===================== ROUTES ===================== */
// 🔐 AUTH
app.use("/api/auth", authRoutes);

// 🏆 CHALLENGES
app.use("/api/challenge", challengeRoutes);
app.use("/api/challenge-day", challengeDaysRoutes);

// 🏋️ WORKOUTS
app.use("/api/workouts", workoutsRoutes);

// 🥗 MEALS
app.use("/api/meals", mealsRoutes);

// 🌐 EXTERNAL API
app.use("/api/external", externalApiRoutes);

/* ===================== 404 HANDLER ===================== */
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

/* ===================== ERROR HANDLER ===================== */
app.use((err, req, res, next) => {
  console.error("❌ SERVER ERROR:", err.stack);
  res.status(err.status || 500).json({
    message: err.message || "Internal Server Error",
  });
});

/* ===================== SERVER ===================== */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
