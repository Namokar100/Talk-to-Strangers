
const User = require("../models/User"); 

let userSessions = {}; 

// Show the main menu after registration
exports.showMenu = (bot, chatId) => {
  const menuKeyboard = {
    reply_markup: {
      keyboard: [
        [
          { text: "Find Partner" },
          { text: "Settings" }
        ],
        [
          { text: "Report" },
          { text: "Help" }
        ]
      ],
      resize_keyboard: true, // Resize the keyboard for better fit
      one_time_keyboard: true // Hide the keyboard after a selection
    }
  };

  bot.sendMessage(chatId, "Welcome to the Menu! Please choose an option:", menuKeyboard);
  userSessions[chatId] = { connected: false }; // Initialize user session state
};

// Handle the menu button actions
exports.handleMenuActions = (bot) => {
  bot.on("message", async (message) => {
    const chatId = message.chat.id;

    if (userSessions[chatId]) {
      switch (message.text) {
        case "Find Partner":
          userSessions[chatId].connected = true; // Set the user as connected
          showConnectingOptions(bot, chatId);
          break;

        case "Settings":
          // Handle settings action
          bot.sendMessage(chatId, "Settings feature is not yet implemented.");
          break;

        case "Report":
          // Handle report action
          bot.sendMessage(chatId, "Reporting feature is not yet implemented.");
          break;

        case "Help":
          // Handle help action
          bot.sendMessage(chatId, "Help feature is not yet implemented.");
          break;

        default:
          bot.sendMessage(chatId, "Please choose a valid option.");
      }
    }
  });
};

// Display connecting options when a user starts finding a partner
const showConnectingOptions = (bot, chatId) => {
  const connectingKeyboard = {
    reply_markup: {
      keyboard: [
        [
          { text: "Stop" },
          { text: "Help" }
        ]
      ],
      resize_keyboard: true,
      one_time_keyboard: true
    }
  };

  bot.sendMessage(chatId, "You are looking for a partner. Please wait...", connectingKeyboard);
};
