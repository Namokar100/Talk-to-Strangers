// routes/userRoutes.js
const express = require("express");
const router = express.Router();
const userController = require("../controllers/userRegistrationController");

module.exports = (bot) => {
  // Start chatting and handle the user registration process
  userController.startChatting(bot);
  return router;
};
