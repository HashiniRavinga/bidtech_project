export const setupSocketIO = (io) => {
  io.on('connection', (socket) => {
    console.log('👤 User connected:', socket.id);

    // Join user to their personal room for notifications
    socket.on('join', (userId) => {
      socket.join(`user_${userId}`);
      console.log(`👤 User ${userId} joined their room`);
    });

    // Handle real-time bid updates
    socket.on('bid_update', (data) => {
      socket.to(`user_${data.userId}`).emit('bid_notification', data);
    });

    // Handle requirement updates
    socket.on('requirement_update', (data) => {
      socket.broadcast.emit('new_requirement', data);
    });

    socket.on('disconnect', () => {
      console.log('👤 User disconnected:', socket.id);
    });
  });

  return io;
};

// Helper function to send real-time notifications
export const sendNotification = (io, userId, notification) => {
  io.to(`user_${userId}`).emit('notification', notification);
};