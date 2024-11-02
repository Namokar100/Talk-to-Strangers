const TelegramBot = require("node-telegram-bot-api");
const express = require("express")
const app = express()

const dotenv = require("dotenv")
dotenv.config()

const database = require("./config/db")
database.connect()

app.use(express.json())

const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, { polling: true });

//routes
const startRoutes = require("./routes/startRoutes")(bot);
const userRoutes = require("./routes/userRoutes")(bot);
// const findPartnerRoutes = require('./routes/findPartnerRoutes');
// app.use('/api/partner', findPartnerRoutes);
// const menuRoutes = require("./routes/menuRoutes")(bot);


const findPartnerController = require("./controllers/findPartnerController");
// Handle menu actions
findPartnerController.handleMenuActions(bot);
// Handle incoming messages
findPartnerController.handleMessages(bot);

const userUpdate = require("./controllers/updateUserController");
//Handle update user
userUpdate.handleCallbackQuery(bot);


// Start Listening for Bot Commands
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  findPartnerController.showMenu(bot, chatId);
});

// handle user update 
// userUpdate.updateProfile(bot);

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});