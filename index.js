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
// const menuRoutes = require("./routes/menuRoutes")(bot);
const findPartnerController = require("./controllers/findPartnerController");

// Start Listening for Bot Commands
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  findPartnerController.showMenu(bot, chatId);
});

// Handle menu actions
findPartnerController.handleMenuActions(bot);

// Handle incoming messages
findPartnerController.handleMessages(bot);

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});