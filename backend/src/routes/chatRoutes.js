const express = require("express");
const { getMessages, markAsRead, sendMessage } = require("../controllers/chatController");
const { protect, restrictTo } = require("../middlewares/authMiddleware");

const router = express.Router();

// ✅ Route to get messages for a specific proposal
router.get("/:proposalId", protect, restrictTo("founder", "investor"), getMessages);

// ✅ Route to send a message
router.post("/", protect, restrictTo("founder", "investor"), sendMessage);

// ✅ Route to mark a message as read (only receiver can do this)
router.patch("/read/:messageId", protect, markAsRead);

// ✅ Admin-only route to monitor chats
router.get("/admin/:proposalId", protect, restrictTo("admin"), getMessages);

module.exports = router;
