const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const adminOnly = require("../middleware/adminMiddleware");

const adminController = require("../controllers/adminController");

/* ===================== ADMIN ROUTES ===================== */

// 👥 Users
router.get(
  "/users",
  auth,
  adminOnly,
  adminController.getUsers
);
// ⛔ Suspend user
router.patch(
  "/users/:id/suspend",
  auth,
  adminOnly,
  adminController.suspendUser
);

// ▶ Activate user
router.patch(
  "/users/:id/activate",
  auth,
  adminOnly,
  adminController.activateUser
);

// 🗑 Delete user
router.delete(
  "/users/:id",
  auth,
  adminOnly,
  adminController.deleteUser
);
// 📊 Dashboard
router.get(
  "/dashboard",
  auth,
  adminOnly,
  adminController.getDashboard
);

// 🍽️ Create test meal
router.post(
  "/create-meal",
  auth,
  adminOnly,
  adminController.createTestMeal
);

module.exports = router;
