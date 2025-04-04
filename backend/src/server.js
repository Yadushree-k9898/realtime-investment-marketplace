const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const proposalRoutes = require("./routes/proposalRoutes");
const chatRoutes = require("./routes/chatRoutes");
const investmentRoutes = require("./routes/investmentRoutes"); 
const cronJob = require('../src/cron/cronJobs');
// const paymentRoutes = require('./routes/paymentRoutes');



dotenv.config();
connectDB();

const app = express();

cronJob;

// ✅ Middleware
app.use(express.json());
app.use(cors({ origin: process.env.CLIENT_URL || "*" })); // Allow frontend access

// ✅ Routes
app.use("/api/auth", authRoutes);
app.use("/api/proposals", proposalRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/investments", investmentRoutes); 
// app.use('/api/payments', paymentRoutes);




const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
