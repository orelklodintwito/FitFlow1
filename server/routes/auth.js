const express = require("express");
const router = express.Router();

// Controllers
const {
  signup,
  login
} = require("../controllers/authController");

/* =========================
   AUTH ROUTES
========================= */

// Signup
router.post("/signup", signup);

// Login
router.post("/login", login);

module.exports = router;
