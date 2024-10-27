const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true, // To ensure usernames are unique
    },

    age: {
        type: Number,
        required: true,
        min: 18, // Validation for reasonable age range
        max: 100
    },

    gender: {
        type: String,
        enum: ["Male", "Female", "Unknown"],
        required: true,
    },

    language: {
        type: String,
        enum: ["English"],
        required: true,
    },

    country: {
        type: String,
        enum: [
            "India", "Russia", "Indonesia", "USA", "Brazil", "Mexico", "Turkey", "Philippines", "Egypt", "Iran", 
            "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Antigua and Barbuda", "Argentina", "Armenia", 
            "Australia", "Austria", "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", 
            "Belize", "Benin", "Bhutan", "Bolivia", "Bosnia and Herzegovina", "Botswana", "Brunei", "Bulgaria", "Burkina Faso", 
            "Burundi", "Cambodia", "Cameroon", "Canada", "Cape Verde", "Central African Republic", "Chad", "Chile", "China", 
            "Colombia", "Comoros", "Congo", "Costa Rica", "Croatia", "Cuba", "Cyprus", "Czech Republic", "Denmark", "Djibouti", 
            "Dominica", "Dominican Republic", "Ecuador", "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia", "Eswatini", 
            "Ethiopia", "Fiji", "Finland", "France", "Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Greece", "Grenada", 
            "Guatemala", "Guinea", "Guinea-Bissau", "Guyana", "Haiti", "Honduras", "Hungary", "Iceland", "Iraq", "Ireland", 
            "Israel", "Italy", "Ivory Coast", "Jamaica", "Japan", "Jordan", "Kazakhstan", "Kenya", "Kiribati", "Kuwait", 
            "Kyrgyzstan", "Laos", "Latvia", "Lebanon", "Lesotho", "Liberia", "Libya", "Liechtenstein", "Lithuania", "Luxembourg", 
            "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Marshall Islands", "Mauritania", "Mauritius", 
            "Micronesia", "Moldova", "Monaco", "Mongolia", "Montenegro", "Morocco", "Mozambique", "Myanmar", "Namibia", "Nauru", 
            "Nepal", "Netherlands", "New Zealand", "Nicaragua", "Niger", "Nigeria", "North Korea", "North Macedonia", "Norway", 
            "Oman", "Pakistan", "Palau", "Panama", "Papua New Guinea", "Paraguay", "Peru", "Poland", "Portugal", "Qatar", 
            "Romania", "Rwanda", "Saint Kitts and Nevis", "Saint Lucia", "Saint Vincent and the Grenadines", "Samoa", "San Marino", 
            "Sao Tome and Principe", "Saudi Arabia", "Senegal", "Serbia", "Seychelles", "Sierra Leone", "Singapore", "Slovakia", 
            "Slovenia", "Solomon Islands", "Somalia", "South Africa", "South Korea", "South Sudan", "Spain", "Sri Lanka", "Sudan", 
            "Suriname", "Sweden", "Switzerland", "Syria", "Taiwan", "Tajikistan", "Tanzania", "Thailand", "Timor-Leste", "Togo", 
            "Tonga", "Trinidad and Tobago", "Tunisia", "Turkmenistan", "Tuvalu", "Uganda", "Ukraine", "United Arab Emirates", 
            "United Kingdom", "Uruguay", "Uzbekistan", "Vanuatu", "Vatican City", "Venezuela", "Vietnam", "Yemen", "Zambia", 
            "Zimbabwe"
          ],
        required: true
    },

    preferredCountry: {
        type: String,
        default: "International",
    },

    isPremium: {
        type: Boolean,
        default: false,
    },

    isConnected: {       //To indicate user is present in the chat
        type: Boolean,
        default: false,
    },

    referralCount: {
        type: Number,
        default: 0,
    },

    successfulReferrals: { // To track successfully converted referrals
        type: Number,
        default: 0,
    },

    referredBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },

    interests: [{ 
        type: String,
        enum: ["friendship", "love", "dating", "discussions", "geopolitics", "fitness", "technology", "gaming", "music", "movies", "travel"],
        required: true,
    }],

    status: {
        isOnline: {          // Online/offline status
            type: Boolean, default: false 
        }, 
        isInConversation: {     // In-conversation status
            type: Boolean, default: false 
        },
    },

    createdAt: { 
        type: Date, default: Date.now 
    },

    // For premium users only
    preferredAge: {
        type: String,
    },

    preferredGender: {
        type: String,
        enum: ["Male", "Female", "Unknown"],
    },

    premiumExpiryDate: { // Optional field for time-bound premium subscriptions
        type: Date,
    },
},
{timestamps: true} 
);

module.exports = mongoose.model("user", userSchema);