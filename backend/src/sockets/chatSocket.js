const Message = require("../models/Message");

module.exports = (io) => {
  const onlineUsers = new Map(); // Track online users

  io.on("connection", (socket) => {
    const userId = socket.handshake.query.userId;
    if (userId) onlineUsers.set(userId, socket.id);

    // When user goes offline
    socket.on("disconnect", () => {
      onlineUsers.delete(userId);
    });

    // Handle incoming messages
    socket.on("sendMessage", async ({ sender, receiver, content, proposal }) => {
      const newMessage = await Message.create({
        sender,
        receiver,
        content,
        proposal,
        isRead: onlineUsers.has(receiver), // Mark as read if the receiver is online
      });

      if (onlineUsers.has(receiver)) {
        io.to(onlineUsers.get(receiver)).emit("newMessage", newMessage);
      } else {
        // Receiver is offline, store message for later notification
        console.log("User offline. Message stored.");
      }
    });

    // Notify user when they come online
    socket.on("userOnline", async ({ userId }) => {
      const unreadMessages = await Message.find({ receiver: userId, isRead: false });

      if (unreadMessages.length > 0) {
        io.to(socket.id).emit("unreadMessages", unreadMessages);
        await Message.updateMany({ receiver: userId }, { isRead: true }); // Mark messages as read
      }
    });
  });
};
