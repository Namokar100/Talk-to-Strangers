const User = require("../models/User");
const updateUser = require('./updateUserController');

let userSessions = {}; // Store user session states
let waitingUsers = []; // Queue to store users waiting for a partner
let connectedUsers = {}; // Object to track connected users with their partners
let disconnectionTimers = {}; // Track disconnection cooldowns
// const updateUser = require('./updateUserController');

// Show the main menu after registration
exports.showMenu = (bot, chatId) => {
  const menuKeyboard = {
    reply_markup: {
      keyboard: [
        [
          { text: "Find Partner" },
          { text: "Update" }
        ],
        [
          { text: "Male" },
          { text: "Female" }
        ]
      ],
      resize_keyboard: true, // Resize the keyboard for better fit
      one_time_keyboard: true // Hide the keyboard after a selection
    }
  };

  bot.sendMessage(chatId, "Click on the required Button!", menuKeyboard)
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

        case "Update":
            updateUser.showUpdateOptions(bot, chatId);
            exports.showMenu(bot, chatId);
          break;

        case "Find Male":
          // Handle report action
          bot.sendMessage(chatId, "Reporting feature is not yet implemented.");
          break;

        case "Find Female":
          // Handle help action
          bot.sendMessage(chatId, "Help feature is not yet implemented.");
          break;

        case "Stop":
        case "End":
          disconnect(bot, chatId);
          break;

        case "Next Partner":
          disconnect(bot, chatId);
          findPartner(bot, chatId);
          break;
      }
    }
  });
};

// Function to handle user connection logic
const findPartner = async (bot, chatId) => {
    // If there are users in the waiting queue, connect them
    if (waitingUsers.length > 0) {
      const partnerId = waitingUsers.shift(); // Get the first user in the queue
  
      // Save both users as connected partners
      connectedUsers[chatId] = partnerId;
      connectedUsers[partnerId] = chatId;
  
      // Inform both users they are connected
      const connectedMessage = "You are connected with your partner";
  
      if (connectedUsers[chatId]) {
        // Get partner details from the database (replace with actual database fetch)
        const partnerDetails = await getPartnerDetails(partnerId); // Await partner details
        const chatDetails = await getPartnerDetails(chatId); // Await your details
  
        if (partnerDetails && chatDetails) { // Check if both details are retrieved
          // Send messages to both users with their details
          bot.sendMessage(chatId, `You found a partner!!:\nGender: ${partnerDetails.gender}\nAge: ${partnerDetails.age}\nInterests: ${partnerDetails.interests}\nCountry: ${partnerDetails.country}`)
            .catch(error => console.error("Error sending message to user:", error));
  
          bot.sendMessage(partnerId, `You found a partner!!:\nGender: ${chatDetails.gender}\nAge: ${chatDetails.age}\nInterests: ${chatDetails.interests}\nCountry: ${chatDetails.country}`)
            .catch(error => console.error("Error sending message to partner:", error));
  
          showConnectionOptions(bot, chatId);
          showConnectionOptions(bot, partnerId);
          return;
        } else {
          bot.sendMessage(chatId, "Could not fetch partner details.")
            .catch(error => console.error("Error sending message to user:", error));
        }
      }
  
      // Send connected message if details are not needed
      bot.sendMessage(chatId, connectedMessage)
        .catch(error => console.error("Error sending message to user:", error));
  
      bot.sendMessage(partnerId, connectedMessage)
        .catch(error => console.error("Error sending message to partner:", error));
  
      // Show the connection options
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

  bot.sendMessage(chatId, "If you want to end chat Click on End Button after 5 sec!", connectionKeyboard)
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

// Getting partner details from the database
const getPartnerDetails = async (partnerId) => {
    try {
        partnerId = "User"+partnerId;
      // Fetch user details from the database based on partnerId
      const user = await User.findOne({username : partnerId});
  
      if (!user) {
        throw new Error("User not found");
      }
    //   console.log(user.gender +"\n"+ user.age );
  
      // Return relevant details for the chat display
      return {
        gender: user.gender,
        age: user.age,
        interests: Array.isArray(user.interests) ? user.interests.join(", ") : user.interests, // format interests if it's an array
        country: user.country,
      };
    } catch (error) {
      console.error("Error fetching partner details:", error);
      return null; // return null if there's an error fetching user details
    }
};
  