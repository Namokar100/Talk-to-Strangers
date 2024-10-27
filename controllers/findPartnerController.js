const User = require("../models/User");

let userSessions = {}; // Store user session states
let waitingUsers = []; // Queue to store users waiting for a partner
let connectedUsers = {}; // Object to track connected users with their partners
let disconnectionTimers = {}; // Track disconnection cooldowns

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

  bot.sendMessage(chatId, "Welcome! Choose an option:", menuKeyboard)
    .catch(error => console.error("Error sending menu message:", error));
    
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
          findPartner(bot, chatId);
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

        case "Stop":
        case "End":
          disconnect(bot, chatId);
          break;

        case "Next Partner":
          findPartner(bot, chatId);
          break;
      }
    }
  });
};

// Function to handle user connection logic
const findPartner = (bot, chatId) => {
  // If there are users in the waiting queue, connect them
  if (waitingUsers.length > 0) {
    const partnerId = waitingUsers.shift(); // Get the first user in the queue

    // Save both users as connected partners
    connectedUsers[chatId] = partnerId;
    connectedUsers[partnerId] = chatId;

    // Inform both users they are connected
    const connectedMessage = "You are connected to a partner. Have a nice talk!";
    if (connectedUsers[chatId]) {
        // Get partner details from the database (replace with actual database fetch)
        const partnerId = connectedUsers[chatId]; // Get partner ID
        const partnerDetails = getPartnerDetails(partnerId);
        const chatDetails = getPartnerDetails(chatId);
        bot.sendMessage(chatId, `You found a partner!!:\nGender: ${partnerDetails.gender}\nAge: ${partnerDetails.age}\nInterests: ${partnerDetails.interests}\nCountry: ${partnerDetails.country}`)

        bot.sendMessage(partnerId, `You found a partner!!:\nGender: ${chatDetails.gender}\nAge: ${chatDetails.age}\nInterests: ${chatDetails.interests}\nCountry: ${chatDetails.country}`)
        return;
    }
    bot.sendMessage(chatId, connectedMessage)
      .catch(error => console.error("Error sending message to user:", error));
    
    bot.sendMessage(partnerId, connectedMessage)
      .catch(error => console.error("Error sending message to partner:", error));

    // Show the connection options
    showConnectionOptions(bot, chatId);
    showConnectionOptions(bot, partnerId);
  } else {
    // Add the user to the waiting queue
    waitingUsers.push(chatId);
    bot.sendMessage(chatId, "Waiting for a partner. Please wait...")
      .catch(error => console.error("Error sending waiting message:", error));

    // Set a 10-second timeout to check if a partner is found
    setTimeout(() => {
      if (waitingUsers.includes(chatId) && !connectedUsers[chatId]) {
        // Remove the user from the waiting queue if still waiting
        waitingUsers = waitingUsers.filter(id => id !== chatId);
        bot.sendMessage(chatId, "Could not find a partner. Try again later.")
          .catch(error => console.error("Error sending timeout message:", error));
      }
    }, 10000);
  }
};

// Function to display the connection options
const showConnectionOptions = (bot, chatId) => {
  const connectionKeyboard = {
    reply_markup: {
      keyboard: [
        [
          { text: "End" },
          { text: "Next Partner" }
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

  bot.sendMessage(chatId, "You can now chat with your partner. What would you like to do next?", connectionKeyboard)
    .catch(error => console.error("Error sending connection options:", error));
};

// Function to handle disconnection
const disconnect = (bot, chatId) => {
  const partnerId = connectedUsers[chatId];

  if (partnerId) {
    // Inform both users of the disconnection
    bot.sendMessage(chatId, "You have ended the chat with your partner.")
      .catch(error => console.error("Error sending disconnection message to user:", error));

    bot.sendMessage(partnerId, "Your partner has ended the chat.")
      .catch(error => console.error("Error sending disconnection message to partner:", error));

    // Set a disconnection timer for 3 minutes
    disconnectionTimers[chatId] = setTimeout(() => {
      delete disconnectionTimers[chatId];
    }, 180000); // 3 minutes

    // Remove both users from the connectedUsers object
    delete connectedUsers[chatId];
    delete connectedUsers[partnerId];

    // Show the main menu again
    exports.showMenu(bot, partnerId);
    exports.showMenu(bot, chatId);
  } else {
    bot.sendMessage(chatId, "You are not connected to any partner.")
      .catch(error => console.error("Error sending not connected message:", error));
  }
};

// Function to handle incoming messages from connected users
exports.handleMessages = (bot) => {
  bot.on("message", (message) => {
    const chatId = message.chat.id;

    // Check if the message is a valid text message and not a button press
    if (message.text && connectedUsers[chatId]) {
      const partnerId = connectedUsers[chatId];
      bot.sendMessage(partnerId, message.text)
        .catch(error => console.error("Error forwarding message to partner:", error));
    }
  });

  // Handle polling errors
  bot.on("polling_error", (error) => {
    console.error("Polling error:", error);
  });
};

// Dummy function to mimic getting partner details from the database
const getPartnerDetails = (partnerId) => {
  // Replace with actual database fetch logic
  return {
    gender: "Female",
    age: 25,
    interests: "Reading, Traveling",
    country: "USA"
  };
};