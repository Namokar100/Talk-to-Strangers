const express = require("express");
const router = express.Router();
const findPartnerController = require("../controllers/findPartnerController");

// Route to find a partner
router.post("/find", (req, res) => {
  const { bot, chatId } = req.body; // Assuming bot and chatId are passed in the request
  findPartnerController.findPartner(bot, chatId);
  res.sendStatus(200);
});

// Route to disconnect
router.post("/disconnect", (req, res) => {
  const { bot, chatId } = req.body;
  findPartnerController.disconnect(bot, chatId);
  res.sendStatus(200);
});

module.exports = router;
