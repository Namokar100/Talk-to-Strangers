// controllers/messageController.js
const connectedUsers = require('./findPartnerController').connectedUsers; // Import connected users object

// Function to handle message delivery between connected users
exports.handleMessages = (bot) => {
  bot.on('message', (message) => {
    const chatId = message.chat.id;

    // Check if the user is connected
    if (connectedUsers[chatId]) {
      const partnerId = connectedUsers[chatId];
      const text = message.text;

      // Forward the message to the connected partner
      bot.sendMessage(partnerId, `${text}`);
    }
  });
};
