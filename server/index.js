require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors"); // ✅ נוסף

const mealsRoutes = require("./routes/meals");
const authRoutes = require("./routes/auth");
const adminRoutes = require("./routes/admin");
const externalApiRoutes = require("./routes/externalApi");
const challengeRoutes = require("./routes/challenges");

const app = express();

/* ===================== MIDDLEWARE ===================== */
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
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

/* ===================== ROUTES ===================== */
app.use("/api/auth", authRoutes);
app.use("/api/meals", mealsRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/external", externalApiRoutes);
app.use("/api/challenge", challengeRoutes);


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
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
