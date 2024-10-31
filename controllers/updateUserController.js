// controllers/userUpdate.js

const User = require("../models/User"); // Import the User model
const userUpdates = {}; // Temporary storage for user update data

exports.updateProfile = (bot) => {
  bot.onText(/\/update_profile/, async (msg) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id;

    userUpdates[userId] = {}; // Initialize temporary storage for the current user

    // Start the update process by asking for the new category
    bot.sendMessage(chatId, 'Please enter your preferred category:');
    
    // Ask for category
    bot.once('message', (categoryResponse) => {
      userUpdates[userId].category = categoryResponse.text;

      bot.sendMessage(chatId, 'Please enter your age:');
      
      // Ask for age
      bot.once('message', (ageResponse) => {
        userUpdates[userId].age = parseInt(ageResponse.text);
        
        bot.sendMessage(chatId, 'Please enter your gender:');
        
        // Ask for gender
        bot.once('message', (genderResponse) => {
          userUpdates[userId].gender = genderResponse.text;
          
          bot.sendMessage(chatId, 'Please list your interests (separated by commas):');
          
          // Ask for interests
          bot.once('message', (interestsResponse) => {
            userUpdates[userId].interests = interestsResponse.text.split(',').map(item => item.trim());
            
            bot.sendMessage(chatId, 'Please enter your country:');
            
            // Ask for country
            bot.once('message', (countryResponse) => {
              userUpdates[userId].country = countryResponse.text;
              
              bot.sendMessage(chatId, 'Please enter your language:');
              
              // Ask for language
              bot.once('message', async (languageResponse) => {
                userUpdates[userId].language = languageResponse.text;
                
                // After gathering all inputs, update in the database at once
                try {
                  const updatedUser = await User.findOneAndUpdate(
                    { telegramId: userId },
                    userUpdates[userId],
                    { new: true } // Return the updated document
                  );
                  
                  if (!updatedUser) {
                    bot.sendMessage(chatId, 'User not found. Please make sure you are registered.');
                  } else {
                    bot.sendMessage(chatId, 'Your profile has been updated successfully!');
                  }
                } catch (error) {
                  bot.sendMessage(chatId, 'An error occurred while updating your profile. Please try again.');
                  console.error("Error updating user profile:", error);
                }

                // Clear temporary storage for this user
                delete userUpdates[userId];
              });
            });
          });
        });
      });
    });
  });
};
