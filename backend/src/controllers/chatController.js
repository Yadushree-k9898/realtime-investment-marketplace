const Message = require("../models/Message");

exports.getMessages = async (req, res) => {
  try {
    const { proposalId } = req.params;

    if (!proposalId) {
      return res.status(400).json({ error: "Proposal ID is required" });
    }

    const messages = await Message.find({ proposal: proposalId })
      .populate("sender", "name email")
      .populate("receiver", "name email")
      .sort({ createdAt: 1 });

    if (!messages.length) {
      return res.status(404).json({ message: "No messages found for this proposal" });
    }

    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch messages", details: error.message });
  }
};

exports.sendMessage = async (req, res) => {
  try {
    const { receiver, proposalId, content } = req.body;

    if (!receiver || !proposalId || !content) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const message = new Message({
      sender: req.user.id, // Authenticated user is the sender
      receiver,
      proposal: proposalId,
      content,
    });

    await message.save();

    res.status(201).json({ message: "Message sent successfully", data: message });
  } catch (error) {
    res.status(500).json({ error: "Failed to send message", details: error.message });
  }
};

exports.markAsRead = async (req, res) => {
  try {
    const { messageId } = req.params;

    const message = await Message.findById(messageId);
    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }

    if (message.receiver.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to mark this message as read" });
    }

    message.isRead = true;
    await message.save();

    res.status(200).json({ message: "Message marked as read successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to mark message as read", details: error.message });
  }
};
