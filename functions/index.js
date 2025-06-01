// functions/index.js
const functions = require("firebase-functions");
const fetch = require("node-fetch"); // If using node-fetch for API calls
const cors = require("cors")({ origin: true });

// For local emulation, load .env.local if present
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config({ path: '.env.local' });
}

// Access API Key:
// 1. From Firebase config (for deployed functions)
// 2. From process.env (for local emulation via .env.local)
const MAILBOXLAYER_API_KEY = functions.config().mailboxlayer?.key || process.env.MAILBOXLAYER_KEY;

if (!MAILBOXLAYER_API_KEY) {
    console.error("FATAL ERROR: Mailboxlayer API Key not found.");
}

exports.checkMailboxlayerEmail = functions.https.onRequest(async (req, res) => {
    cors(req, res, async () => {
        if (!MAILBOXLAYER_API_KEY) {
            res.status(500).json({ message: "API Key not configured for the server." });
            return;
        }
        // ... (rest of your function logic from before, using node-fetch or axios to call Mailboxlayer)
        // Example using node-fetch:
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ message: "Email is required." });
        }
        try {
            const apiUrl = `https://apilayer.net/api/check?access_key=${MAILBOXLAYER_API_KEY}&email=${encodeURIComponent(email)}&smtp=1&format=1`;
            const apiResponse = await fetch(apiUrl);
            const data = await apiResponse.json();
            console.log("Mailboxlayer response (from function):", data);
            return res.status(200).json(data); // Send Mailboxlayer's response directly
        } catch (error) {
            console.error("Error calling Mailboxlayer from function:", error);
            return res.status(500).json({ message: "Failed to check email." });
        }
    });
});