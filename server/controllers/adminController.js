const User = require("../models/User");
const Meal = require("../models/Meal");

/* ===================== USERS ===================== */
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find({
      $or: [
        { deletedAt: null },
        { deletedAt: { $exists: false } }
      ]
    }).select(
      "name email role status activeChallenge challengeStartedAt createdAt age height weight deletedAt"
    );

    res.json(users);
  } catch (err) {
    console.error("Get users error:", err);
    res.status(500).json({ message: "Failed to load users" });
  }
};

/* ===================== CREATE TEST MEAL ===================== */
exports.createTestMeal = async (req, res) => {
  try {
    const meal = await Meal.create({
      ...req.body,
      user: req.user.id,
    });

    res.status(201).json(meal);
  } catch (err) {
    console.error("Create meal error:", err);
    res.status(400).json({ message: "Failed to create test meal" });
  }
};

/* ===================== ADMIN DASHBOARD ===================== */
exports.getDashboard = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalAdmins = await User.countDocuments({ role: "admin" });
    /* ========= TODAY RANGE ========= */

        const startOfToday = new Date();
        startOfToday.setHours(0, 0, 0, 0);

        const endOfToday = new Date();
        endOfToday.setHours(23, 59, 59, 999);

        /* ========= TODAY KPIS ========= */

        const usersSuspendedToday = await User.countDocuments({
        suspendedAt: {
            $gte: startOfToday,
            $lte: endOfToday,
        },
        });

        const usersDeletedToday = await User.countDocuments({
        deletedAt: {
            $gte: startOfToday,
            $lte: endOfToday,
        },
        });
    const latestUsers = await User.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select("name email createdAt");

    /* ========= CHALLENGE POPULARITY ========= */

    const usersWithChallenge = await User.find({
      activeChallenge: { $ne: null },
    }).select("activeChallenge");

    const challengeCounts = {};

    usersWithChallenge.forEach((u) => {
      if (!u.activeChallenge) return;
      challengeCounts[u.activeChallenge] =
        (challengeCounts[u.activeChallenge] || 0) + 1;
    });

    let mostSelectedChallenge = null;

    if (Object.keys(challengeCounts).length > 0) {
      mostSelectedChallenge = Object.entries(challengeCounts)
        .sort((a, b) => b[1] - a[1])[0][0];
    }

    const challengePercentage =
      totalUsers > 0
        ? Math.round(
            (usersWithChallenge.length / totalUsers) * 100
          )
        : 0;

    /* ========= MEAL POPULARITY ========= */

    const totalMeals = await Meal.countDocuments();

    const mostLoggedMealAgg = await Meal.aggregate([
      {
        $group: {
          _id: "$name",
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
      { $limit: 1 },
    ]);

    const mostLoggedMeal =
      mostLoggedMealAgg.length > 0
        ? mostLoggedMealAgg[0]._id
        : null;

    /* ========= HEALTH STATS ========= */

    const users = await User.find().select("height weight");

    let totalHeight = 0;
    let totalWeight = 0;
    let totalBMI = 0;
    let validCount = 0;

    users.forEach((u) => {
      if (u.height && u.weight) {
        totalHeight += u.height;
        totalWeight += u.weight;

        const bmi = u.weight / Math.pow(u.height / 100, 2);
        totalBMI += bmi;
        validCount++;
      }
    });

    const averageHeight = validCount
      ? Math.round(totalHeight / validCount)
      : 0;

    const averageWeight = validCount
      ? Math.round(totalWeight / validCount)
      : 0;

    const averageBMI = validCount
      ? Number((totalBMI / validCount).toFixed(1))
      : 0;

    /* ==== convert to component format ==== */

    const heightPercentage = averageHeight
      ? Math.min(Math.round((averageHeight / 220) * 100), 100)
      : 0;

    const weightPercentage = averageWeight
      ? Math.min(Math.round((averageWeight / 150) * 100), 100)
      : 0;

    const bmiPercentage = averageBMI
      ? Math.min(Math.round((averageBMI / 40) * 100), 100)
      : 0;

    /* ========= RESPONSE ========= */

    res.json({
     kpis: [
  { label: "Total Users", value: totalUsers },
  { label: "Admins", value: totalAdmins },
  { label: "Users Suspended Today", value: usersSuspendedToday },
  { label: "Users Deleted Today", value: usersDeletedToday },
],

      recentActivity: latestUsers.map((u) => ({
        title: "New User",
        description: u.email,
        date: u.createdAt,
      })),

      popularChoices: {
        challengePercentage,
        challengeCounts,
        mostSelectedChallenge,
        totalMeals,
        mostLoggedMeal,
      },

      healthStats: {
        averageBMI: {
          value: averageBMI,
          percentage: bmiPercentage,
        },
        averageHeight: {
          value: averageHeight,
          percentage: heightPercentage,
          unit: "cm",
        },
        averageWeight: {
          value: averageWeight,
          percentage: weightPercentage,
          unit: "kg",
        },
      },
    });
  } catch (err) {
    console.error("Dashboard error:", err);
    res.status(500).json({ message: "Failed to load dashboard" });
  }
};

/* ===================== USER ACTIONS ===================== */

exports.suspendUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      {
        status: "suspended",
        suspendedAt: new Date(),
      },
      { new: true }
    );

    res.json(user);
  } catch (err) {
    console.error("Suspend error:", err);
    res.status(500).json({ message: "Failed to suspend user" });
  }
};

exports.activateUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
     {
  status: "active",
  suspendedAt: null,
},
      { new: true }
    );

    res.json(user);
  } catch (err) {
    console.error("Activate error:", err);
    res.status(500).json({ message: "Failed to activate user" });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      {
        deletedAt: new Date(),
      },
      { new: true }
    );

    res.json(user);
  } catch (err) {
    console.error("Delete error:", err);
    res.status(500).json({ message: "Failed to delete user" });
  }
};