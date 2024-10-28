// controllers/userController.js

const User = require("../models/User"); // Import the User model
const userRegistrationData = {}; // Temporary storage for user registration data
const ageOptions = Array.from({ length: 75 - 16 + 1 }, (_, i) => (i + 16).toString()); // Age options from 16 to 75
const agePageSize = 12; // Number of age options to display per page
const menuController = require("./menuController");
const findPartnerController = require("./findPartnerController"); // Import findPartnerController

exports.startChatting = (bot) => {
  bot.on('callback_query', async (callbackQuery) => {
    const message = callbackQuery.message;
    const chatId = message.chat.id;

    if (callbackQuery.data === "start_chatting") {
      // Check if user is already registered
      const existingUser = await User.findOne({ username: `User${chatId}` });

      if (existingUser) {
        // If user is already registered, direct them to find a partner
        bot.sendMessage(chatId, "You are already registered. Click on Find Partner Button");
      } else {
        // If user is new, start the registration process
        userRegistrationData[chatId] = {}; // Initialize user data
        askForGender(bot, chatId);
      }
    }

    // Rest of the callback_query handling remains the same
    else if (callbackQuery.data.startsWith("gender_")) {
      userRegistrationData[chatId].gender = callbackQuery.data.split("_")[1];
      userRegistrationData[chatId].agePage = 0; // Initialize age page
      askForAge(bot, chatId);
    } 
    
    else if (callbackQuery.data.startsWith("age_")) {
      userRegistrationData[chatId].age = callbackQuery.data.split("_")[1];
      askForLanguage(bot, chatId);
    } 
    
    else if (callbackQuery.data.startsWith("language_")) {
      userRegistrationData[chatId].language = callbackQuery.data.split("_")[1];
      askForCountry(bot, chatId);
    } 
    
    else if (callbackQuery.data.startsWith("country_")) {
      userRegistrationData[chatId].country = callbackQuery.data.split("_")[1];
      askForInterests(bot, chatId);
    } 
    
    else if (callbackQuery.data.startsWith("interest_")) {
      const interest = callbackQuery.data.split("_")[1];
      if (!userRegistrationData[chatId].interests) {
        userRegistrationData[chatId].interests = [];
      }
      userRegistrationData[chatId].interests.push(interest);
      bot.sendMessage(chatId, `${interest} added. Click on finish Registration to end profile setup`);
    } 
    
    else if (callbackQuery.data === "finish_registration") {
      // Save the user data to the database
      await saveUserData(chatId, userRegistrationData[chatId]);
      bot.sendMessage(chatId, "Thank you for providing your information! You are now registered.");
      delete userRegistrationData[chatId]; // Clean up temporary data

      // Call the menu controller to show the main menu
      menuController.showMenu(bot, chatId);
    } 
    
    else if (callbackQuery.data === "next_age") {
      userRegistrationData[chatId].agePage++;
      askForAge(bot, chatId);
    } 
    
    else if (callbackQuery.data === "prev_age") {
      userRegistrationData[chatId].agePage--;
      askForAge(bot, chatId);
    }
  });
};

// Prompt user for gender
const askForGender = (bot, chatId) => {
  const genderKeyboard = {
    reply_markup: {
      inline_keyboard: [
        [
          { text: "Male", callback_data: "gender_Male" },
          { text: "Female", callback_data: "gender_Female" },
          { text: "Other", callback_data: "gender_Other" },
        ]
      ]
    }
  };

  bot.sendMessage(chatId, "Please select your gender:", genderKeyboard);
};

// Prompt user for age with pagination in a grid format
const askForAge = (bot, chatId) => {
  const page = userRegistrationData[chatId].agePage || 0;
  const start = page * agePageSize;
  const end = start + agePageSize;
  const currentAgeOptions = ageOptions.slice(start, end);

  const ageKeyboard = {
    reply_markup: {
      inline_keyboard: [],
    }
  };

  // Create rows of 4 columns for age options
  for (let i = 0; i < currentAgeOptions.length; i += 4) {
    ageKeyboard.reply_markup.inline_keyboard.push(
      currentAgeOptions.slice(i, i + 4).map(age => ({
        text: age,
        callback_data: `age_${age}`
      }))
    );
  }

  // Add navigation buttons
  ageKeyboard.reply_markup.inline_keyboard.push([
    { text: "Prev", callback_data: "prev_age" },
    { text: "Next", callback_data: "next_age" }
  ]);

  bot.sendMessage(chatId, "Please select your age:", ageKeyboard);
};

// Prompt user for language
const askForLanguage = (bot, chatId) => {
  const languageKeyboard = {
    reply_markup: {
      inline_keyboard: [
        [
          { text: "English", callback_data: "language_English" },
          { text: "Spanish", callback_data: "language_Spanish" },
          { text: "French", callback_data: "language_French" },
        ]
      ]
    }
  };

  bot.sendMessage(chatId, "Please select your language:", languageKeyboard);
};

// Prompt user for country
const askForCountry = (bot, chatId) => {
  const countryOptions = [
    "India", "USA", "Brazil", "Germany", "UK", "Japan"
    // Add more countries as needed
  ];
  
  const countryKeyboard = {
    reply_markup: {
      inline_keyboard: countryOptions.map(country => ([{
        text: country,
        callback_data: `country_${country}`
      }]))
    }
  };

  bot.sendMessage(chatId, "Please select your country:", countryKeyboard);
};

// Prompt user for interests
const askForInterests = (bot, chatId) => {
  const interestsOptions = [
    "friendship", "love", "dating", "discussions", 
    "technology", "gaming", "music", "movies", "travel"
  ];

  const interestsKeyboard = {
    reply_markup: {
      inline_keyboard: [
        ...interestsOptions.map(interest => ([{
          text: interest,
          callback_data: `interest_${interest}`
        }])),
        [
          { text: "Finish Registration", callback_data: "finish_registration" }
        ]
      ]
    }
  };

  bot.sendMessage(chatId, "Please select your interests:", interestsKeyboard);
};

// Function to save user data to the database
const saveUserData = async (chatId, userData) => {
  console.log("User data being saved:", userData); 

  if (!userData || !userData.gender || !userData.age || !userData.language || !userData.country || !userData.interests) {
    console.error("User data is missing some required fields:", userData);
    throw new Error("User data is incomplete.");
  }

  const user = new User({
    username: `User${chatId}`,
    gender: userData.gender,
    age: userData.age,
    language: userData.language,
    country: userData.country,
    interests: userData.interests,
    createdAt: new Date()
  });

  try {
    await user.save();
    console.log("User saved successfully:", user);
  } catch (error) {
    console.error("Error saving user data:", error);
    throw new Error("Failed to save user data.");
  }
};
