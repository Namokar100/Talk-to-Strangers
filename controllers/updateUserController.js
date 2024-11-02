const User = require("../models/User");

// Function to show update options
exports.showUpdateOptions = (bot, chatId) => {
  const updateKeyboard = {
    reply_markup: {
      inline_keyboard: [
        [
          { text: "Update Gender", callback_data: "update_gender" },
          { text: "Update Age", callback_data: "update_age" },
        ],
        [
          { text: "Update Country", callback_data: "update_country" },
          { text: "Update Interests", callback_data: "update_interests" },
        ],
      ],
    },
  };

  bot.sendMessage(chatId, "Choose an option to update:", updateKeyboard);
};

// Function to handle callback queries for updates
exports.handleCallbackQuery = (bot) => {
  bot.on("callback_query", async (callbackQuery) => {
    const message = callbackQuery.message;
    const chatId = message.chat.id;

    if (callbackQuery.data === "update_gender") {
      await updateGender(bot, chatId);
    } else if (callbackQuery.data === "update_age") {
      await promptForAge(bot, chatId);
    } else if (callbackQuery.data === "update_country") {
      await updateCountry(bot, chatId);
    } else if (callbackQuery.data === "update_interests") {
      await updateInterests(bot, chatId);
    }
    bot.answerCallbackQuery(callbackQuery.id);
  });
};

// Method to update gender
const updateGender = async (bot, chatId) => {
  const genderKeyboard = {
    reply_markup: {
      inline_keyboard: [
        [
          { text: "Male", callback_data: "gender_male" },
          { text: "Female", callback_data: "gender_female" },
          { text: "Other", callback_data: "gender_other" },
        ],
      ],
    },
  };

  bot.sendMessage(chatId, "Select your gender:", genderKeyboard);

  bot.on("callback_query", async (callbackQuery) => {
    if (callbackQuery.data.startsWith("gender_")) {
      const gender = callbackQuery.data.split("_")[1];

      try {
        const result = await User.findOneAndUpdate({ username: chatId }, { gender: gender }, { new: true, upsert: true });
        if (!result) {
          bot.sendMessage(chatId, "User not found in the database.");
        } else {
          bot.sendMessage(chatId, `Gender updated to ${gender}.`);
        }
      } catch (error) {
        bot.sendMessage(chatId, `An error occurred: ${error.message}`);
      }
    }
  });
};

// Method to prompt for age input
const promptForAge = async (bot, chatId) => {
  bot.sendMessage(chatId, "Please enter your age (between 16 - 100):");
  bot.once("message", async (msg) => {
    const age = parseInt(msg.text, 10);
    if (age >= 16 && age <= 100) {
      try {
        const result = await User.findOneAndUpdate({ username: chatId }, { age: age }, { new: true, upsert: true });
        if (!result) {
          bot.sendMessage(chatId, "User not found in the database.");
        } else {
          bot.sendMessage(chatId, `Age updated to ${age}.`);
        }
      } catch (error) {
        bot.sendMessage(chatId, `An error occurred: ${error.message}`);
      }
    } else {
      bot.sendMessage(chatId, "Invalid age. Please enter a number between 16 and 100.");
    }
  });
};

// Method to update country with inline keyboard options
const updateCountry = async (bot, chatId) => {
  const countryKeyboard = {
    reply_markup: {
      inline_keyboard: [
        [
          { text: "India", callback_data: "country_india" },
          { text: "USA", callback_data: "country_usa" },
        ],
        [
          { text: "Brazil", callback_data: "country_brazil" },
          { text: "Germany", callback_data: "country_germany" },
        ],
        [
          { text: "UK", callback_data: "country_uk" },
          { text: "Japan", callback_data: "country_japan" },
        ],
      ],
    },
  };

  bot.sendMessage(chatId, "Please select your country:", countryKeyboard);

  // Use `once` to listen for the callback query for country selection once
  bot.once("callback_query", async (callbackQuery) => {
    const message = callbackQuery.message;
    const selectedCountry = callbackQuery.data.split("_")[1];

    // Acknowledge the callback to stop the loading icon in Telegram
    bot.answerCallbackQuery(callbackQuery.id);

    const countryMap = {
      india: "India",
      usa: "USA",
      brazil: "Brazil",
      germany: "Germany",
      uk: "UK",
      japan: "Japan",
    };

    const country = countryMap[selectedCountry];

    try {
      const result = await User.findOneAndUpdate(
        { username: chatId },
        { country },
        { new: true, upsert: true }
      );

      if (!result) {
        bot.sendMessage(chatId, "User not found in the database.");
      } else {
        bot.sendMessage(chatId, `Country updated to ${country}.`);
      }
    } catch (error) {
      bot.sendMessage(chatId, `An error occurred: ${error.message}`);
    }
  });
};

// Method to update interests
const updateInterests = async (bot, chatId) => {
  const interestsOptions = [
    "friendship", "love", "dating", "discussions", 
    "technology", "gaming", "music", "movies", "travel"
  ];

  // Create the inline keyboard for interests selection
  const interestsKeyboard = {
    reply_markup: {
      inline_keyboard: interestsOptions.map((interest) => [
        { text: interest.charAt(0).toUpperCase() + interest.slice(1), callback_data: `interest_${interest}` }
      ]),
    },
  };

  bot.sendMessage(chatId, "Please select your interests:", interestsKeyboard);

  // Use `once` to listen for the callback query for interest selection once
  bot.once("callback_query", async (callbackQuery) => {
    const message = callbackQuery.message;
    const selectedInterest = callbackQuery.data.split("_")[1];

    // Acknowledge the callback to stop the loading icon in Telegram
    bot.answerCallbackQuery(callbackQuery.id);

    try {
      // Retrieve the current interests from the database or initialize an empty array
      const user = await User.findOne({ username: chatId });
      const interests = user && user.interests ? user.interests : [];

      // Add the selected interest if it’s not already in the list
      if (!interests.includes(selectedInterest)) {
        interests.push(selectedInterest);
      }

      const result = await User.findOneAndUpdate(
        { username: chatId },
        { interests },
        { new: true, upsert: true }
      );

      if (!result) {
        bot.sendMessage(chatId, "User not found in the database.");
      } else {
        bot.sendMessage(chatId, `Interests updated to: ${interests.join(", ")}`);
      }
    } catch (error) {
      bot.sendMessage(chatId, `An error occurred: ${error.message}`);
    }
  });
};

