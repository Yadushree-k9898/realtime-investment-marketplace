// const express = require("express");
// const dotenv = require("dotenv");
// const cors = require("cors");
// const connectDB = require("./config/db");
// const authRoutes = require("./routes/authRoutes");
// const proposalRoutes = require("./routes/proposalRoutes");
// const chatRoutes = require("./routes/chatRoutes");
// const investmentRoutes = require("./routes/investmentRoutes");
// const cronJob = require('../src/cron/cronJobs');

// dotenv.config();
// connectDB();

// const app = express();

// // ✅ Run Cron Jobs
// cronJob();

// // ✅ Middleware
// app.use(express.json());

// app.use(cors({
//   origin: process.env.CLIENT_URL || 'http://localhost:5173',
//   credentials: true,
// }));

// // ✅ Routes
// app.use("/api/auth", authRoutes);
// app.use("/api/proposals", proposalRoutes);
// app.use("/api/chat", chatRoutes);
// app.use("/api/investments", investmentRoutes);

// // ✅ Start Server
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));



const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const proposalRoutes = require("./routes/proposalRoutes");
const chatRoutes = require("./routes/chatRoutes");
const investmentRoutes = require("./routes/investmentRoutes");
const adminRoutes = require("./routes/adminRoutes"); // ✅ Import admin routes

const cronJob = require("./cron/cronJobs");

dotenv.config();
connectDB();

const app = express();

// ✅ Run Cron Jobs
cronJob();

// ✅ Middleware
app.use(express.json());

app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}));

// ✅ Routes
app.use("/api/auth", authRoutes);
app.use("/api/proposals", proposalRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/investments", investmentRoutes);
app.use("/api/admin", adminRoutes); // ✅ Admin route prefix

// ✅ Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
