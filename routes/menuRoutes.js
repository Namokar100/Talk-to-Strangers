// routes/menuRoutes.js
const express = require("express");
const router = express.Router();
const menuController = require("../controllers/menuController");

module.exports = (bot) => {
  menuController.handleMenuActions(bot);
  return router;
};
