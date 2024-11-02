// findPartnerRoutes.js
const express = require('express');
const findPartnerController = require('../controllers/findPartnerController'); // Import your controller
const router = express.Router();

// Route to show the main menu
router.post('/showMenu', (req, res) => {
    console.log("Inside routes")
    const { bot, chatId } = req.body;
    findPartnerController.showMenu(bot, chatId);
    res.sendStatus(200);
});

// Route to handle menu actions
router.post('/handleMenuActions', (req, res) => {
    const { bot } = req.body;
    findPartnerController.handleMenuActions(bot);
    res.sendStatus(200);
});

// Route to handle user connection
router.post('/findPartner', (req, res) => {
    const { bot, chatId } = req.body;
    findPartnerController.findPartner(bot, chatId);
    res.sendStatus(200);
});

// Route to handle user disconnection
router.post('/disconnect', (req, res) => {
    const { bot, chatId } = req.body;
    findPartnerController.disconnect(bot, chatId);
    res.sendStatus(200);
});

// Route to handle incoming messages
router.post('/handleMessages', (req, res) => {
    const { bot } = req.body;
    findPartnerController.handleMessages(bot);
    res.sendStatus(200);
});

module.exports = router;
