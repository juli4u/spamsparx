// functions/index.js
const functions = require("firebase-functions");
const fetch = require("node-fetch"); 
const cors = require("cors")({ origin: true });

// For local emulation, load .env.local if present
if (process.env.FUNCS_EMULATOR === "true" || process.env.NODE_ENV !== 'production') {
    try {
        require('dotenv').config({ path: '.env.local' });
        console.log("Loaded .env.local for emulator.");
    } catch (e) {
        console.warn("Could not load .env.local for emulator.", e);
    }
}

const MAILBOXLAYER_API_KEY = functions.config().mailboxlayer?.key || process.env.MAILBOXLAYER_KEY;

if (!MAILBOXLAYER_API_KEY) {
    console.error("FATAL ERROR: Mailboxlayer API Key not found. Check .env.local for emulator or Firebase config for deployment.");
}

exports.checkMailboxlayerEmail = functions.https.onRequest(async (req, res) => {
    cors(req, res, async () => {
        if (!MAILBOXLAYER_API_KEY) {
            console.error("Mailboxlayer API Key is not available. Function cannot proceed.");
            return res.status(500).json({ message: "API Key not configured for the server." });
        }

        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ message: "Email is required." });
        }

        try {
            const apiUrl = `https://apilayer.net/api/check?access_key=${MAILBOXLAYER_API_KEY}&email=${encodeURIComponent(email)}&smtp=1&format=1`;
            
            // Use the imported 'fetch' from node-fetch
            const apiResponse = await fetch(apiUrl); // <<< THIS LINE USES THE IMPORTED fetch

            if (!apiResponse.ok) { // Check if the response status is not OK (e.g., 4xx, 5xx)
                // Try to get error details from Mailboxlayer if possible
                let errorDetails = `Mailboxlayer API returned status: ${apiResponse.status}`;
                try {
                    const errorData = await apiResponse.json(); // Or .text() if it's not JSON
                    errorDetails += ` - ${errorData.error ? errorData.error.info : JSON.stringify(errorData)}`;
                } catch (e) { /* Failed to parse error response body */ }
                throw new Error(errorDetails);
            }
            
            const data = await apiResponse.json();
            console.log("Mailboxlayer response (from function):", data);
            return res.status(200).json(data);

        } catch (error) {
            console.error("Error calling Mailboxlayer from function:", error); // This will now log the specific error
            // Send a more informative error message to the client
            return res.status(500).json({ message: "Failed to check email with external service.", details: error.message });
        }
    });
});