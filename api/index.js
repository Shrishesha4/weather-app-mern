const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const weatherRoute = require("./routes/weather");
const authRoutes = require("./routes/auth");
const favoriteRoutes = require("./routes/favorites");

dotenv.config();
const app = express();

// Middleware
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "*",
    credentials: true,
  })
);
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// MongoDB connection with connection pooling for serverless
let cachedConnection = null;

async function connectToDatabase() {
  if (cachedConnection) {
    return cachedConnection;
  }

  try {
    const connection = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });

    cachedConnection = connection;
    console.log("MongoDB Connected...");
    return connection;
  } catch (err) {
    console.error("MongoDB Connection Error:", err.message);
    throw err;
  }
}

// Connect to database
connectToDatabase();

// Routes
app.use("/api/weather", weatherRoute);
app.use("/api/auth", authRoutes);
app.use("/api/favorites", favoriteRoutes);

// Health check endpoint
app.get("/api", (req, res) => {
  res.json({
    message: "API is running...",
    timestamp: new Date().toISOString(),
    env: process.env.NODE_ENV || "development",
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Error:", err.stack);
  res.status(500).json({
    error: "Something went wrong!",
    ...(process.env.NODE_ENV !== "production" && { details: err.message }),
  });
});

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// Only listen on port in development
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 3001;
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`API Server listening on port ${PORT}`);
  });
}

module.exports = app;
