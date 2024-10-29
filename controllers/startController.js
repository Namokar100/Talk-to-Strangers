// controllers/startController.js
const menuController = require('./menuController'); // Ensure this points to your menu controller

exports.sendWelcomeMessage = (bot) => {
  bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    console.log(`${msg.chat.username} clicked on start btn`);
    const welcomeText = `Welcome to Random Chat Room! 🎉\n\nConnect with people globally. Please ensure you're familiar with our [Bot Rules](https://example.com/rules) and [Privacy Policy](https://example.com/privacy).`;

    // Inline keyboard to start chatting
    const inlineKeyboard = {
      reply_markup: {
        inline_keyboard: [
          [{ text: "Start Chatting", callback_data: "start_chatting" }]
        ]
      }
    };

    bot.sendMessage(chatId, welcomeText, { parse_mode: "Markdown", reply_markup: inlineKeyboard.reply_markup });
  });

  // Handle the callback query for the Start Chatting button
  bot.on("callback_query", (callbackQuery) => {
    const chatId = callbackQuery.message.chat.id;
    
    if (callbackQuery.data === "start_chatting") {
      // Show the main menu after clicking Start Chatting
      menuController.showMenu(bot, chatId); // Call the menu controller to display the menu
    }
  });
};
