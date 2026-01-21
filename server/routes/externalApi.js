const express = require("express");
const router = express.Router();
const axios = require("axios");

// GET /api/external/meals?search=salad
router.get("/meals", async (req, res) => {
  try {
    const search = req.query.search || "salad";

    const response = await axios.get(
      `https://www.themealdb.com/api/json/v1/1/search.php?s=${search}`
    );

    res.status(200).json(response.data);
  } catch (err) {
    res.status(500).json({
      message: "Failed to fetch meals from external API",
    });
  }
});

module.exports = router;
