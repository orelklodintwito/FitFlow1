require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const challengeRoutes = require("./routes/challenges");
const challengeDaysRoutes = require("./routes/challengeDays");
const workoutsRoutes = require("./routes/workouts"); // ✅ נוסף

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

/* ===================== DEV USER (temporary) ===================== */
/**
 * חשוב: משתמש פיתוח קבוע ותקין (ObjectId) כדי שכל השמירות/שליפות יהיו עקביות.
 * ברגע שתעברו לאוטנטיקציה אמיתית – פשוט תורידי את זה.
 */
const DEV_USER_ID = "65ae7f5c9f1b2c3d4e5f6a7b";
app.use("/api", (req, res, next) => {
  req.user = { id: DEV_USER_ID };
  next();
});

/* ===================== ROUTES ===================== */
app.use("/api/challenge", challengeRoutes);
app.use("/api/challenge-day", challengeDaysRoutes);
app.use("/api/workouts", workoutsRoutes); // ✅ חדש – חיבור workouts

/* ===================== ERROR HANDLING ===================== */
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    message: err.message || "Internal Server Error",
  });
});

/* ===================== SERVER ===================== */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
