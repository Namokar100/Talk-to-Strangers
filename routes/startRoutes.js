// routes/startRoutes.js
const express = require("express");
const router = express.Router();
const startController = require("../controllers/startController");

module.exports = (bot) => {
  startController.sendWelcomeMessage(bot);
  return router;
};
