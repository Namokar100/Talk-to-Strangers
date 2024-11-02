// controllers/messageController.js
const connectedUsers = require('./findPartnerController').connectedUsers; // Import connected users object

// Function to handle message delivery between connected users
exports.handleMessages = (bot) => {
    bot.on("message", (message) => {
      const chatId = message.chat.id;
  
      // Check if the message is a valid text message and not a button press
      if (message.text && connectedUsers[chatId]) {
        const partnerId = connectedUsers[chatId];
  
      //   printing user msgs on the console
        console.log(message.text)
        bot.sendMessage(partnerId, message.text)
          .catch(error => console.error("Error forwarding message to partner:", error));
      }
    });
  
    // Handle polling errors
    bot.on("polling_error", (error) => {
      console.error("Polling error:", error);
    });
  };
