const router = require("express").Router();
const authMiddleware = require("../middleware/auth");
const Favorite = require("../models/Favorite");

// Get all favorites for user
router.get("/", authMiddleware, async (req, res) => {
  try {
    const favorites = await Favorite.find({ user: req.user.id }).sort({
      date_added: -1,
    });
    res.json(favorites);
  } catch (err) {
    console.error("Get favorites error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});

// Add new favorite
router.post("/", authMiddleware, async (req, res) => {
  const { city, country } = req.body;

  // Validation
  if (!city || !country) {
    return res.status(400).json({ message: "City and country are required" });
  }

  try {
    // Check if favorite already exists
    const existingFavorite = await Favorite.findOne({
      user: req.user.id,
      city: city.trim().toLowerCase(),
    });

    if (existingFavorite) {
      return res
        .status(400)
        .json({ message: "This city is already in your favorites" });
    }

    // Create new favorite
    const newFavorite = new Favorite({
      user: req.user.id,
      city: city.trim(),
      country: country.trim(),
    });

    await newFavorite.save();
    res.status(201).json(newFavorite);
  } catch (err) {
    console.error("Add favorite error:", err.message);

    if (err.code === 11000) {
      return res
        .status(400)
        .json({ message: "This city is already in your favorites" });
    }

    res.status(500).json({ message: "Server error" });
  }
});

// Delete favorite
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const favorite = await Favorite.findById(req.params.id);

    if (!favorite) {
      return res.status(404).json({ message: "Favorite not found" });
    }

    // Check if user owns this favorite
    if (favorite.user.toString() !== req.user.id) {
      return res.status(401).json({ message: "Not authorized" });
    }

    await Favorite.findByIdAndDelete(req.params.id);
    res.json({ message: "Favorite removed successfully" });
  } catch (err) {
    console.error("Delete favorite error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
