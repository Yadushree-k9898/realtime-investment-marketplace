module.exports = (io) => {
    io.on('connection', (socket) => {
      socket.on('notify', ({ userId, message }) => {
        io.to(userId).emit('notification', message);
      });
  
      // Notify when a proposal status changes
      socket.on('proposalUpdated', ({ proposalId, status }) => {
        io.to(proposalId).emit('proposalStatusUpdate', { proposalId, status });
      });
    });
  };
  