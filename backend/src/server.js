const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db"); // Import database connection function
const authRoutes = require("./routes/authRoutes");
const redis = require("./config/redis"); // Import Redis connection

dotenv.config();

const app = express();
app.use(express.json());

// ✅ Call the database connection function
connectDB(); // This ensures MongoDB connects when the server starts

app.use("/api/auth", authRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
