const router = require("express").Router();
const axios = require("axios");
const Search = require("../models/Search");

// Handle GET /api/weather (root of this router)
router.get("/", async (req, res) => {
  const { city } = req.query;

  if (!city) {
    return res.status(400).json({ message: "City parameter is required" });
  }

  const apiKey = process.env.OPENWEATHER_API_KEY;

  if (!apiKey || apiKey === "YOUR_OPENWEATHERMAP_API_KEY") {
    return res.status(500).json({
      message: "Server configuration error: Missing API Key.",
    });
  }

  const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
    city
  )}&appid=${apiKey}&units=metric`;

  try {
    const response = await axios.get(url);

    // Optional: Save search to database
    try {
      const search = new Search({
        city: city,
        timestamp: new Date(),
      });
      await search.save();
    } catch (dbError) {
      console.error("Database save error:", dbError);
      // Don't fail the request if DB save fails
    }

    res.json(response.data);
  } catch (error) {
    console.error("Weather API error:", error.message);

    if (error.response) {
      return res.status(error.response.status).json({
        message: error.response.data.message || "Weather data not found",
        error: error.response.data,
      });
    }

    res.status(500).json({ message: "Internal server error" });
  }
});

// Handle GET /api/weather/search (if you want a separate search endpoint)
router.get("/search", async (req, res) => {
  const { city } = req.query;

  if (!city) {
    return res.status(400).json({ message: "City parameter is required" });
  }

  const apiKey = process.env.OPENWEATHER_API_KEY;

  if (!apiKey) {
    return res.status(500).json({
      message: "Server configuration error: Missing API Key.",
    });
  }

  const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
    city
  )}&appid=${apiKey}&units=metric`;

  try {
    const response = await axios.get(url);
    res.json(response.data);
  } catch (error) {
    if (error.response) {
      return res.status(error.response.status).json(error.response.data);
    }
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
