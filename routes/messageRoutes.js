// routes/messageRoutes.js
const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');

// Route to handle messages from users
router.post('/message', (req, res) => {
  const { chatId, text } = req.body; // Assuming you send chatId and text in the request body

  // Here you would handle the message logic
  messageController.handleMessage(chatId, text);

  res.status(200).send({ message: 'Message processed' });
});

module.exports = router;
