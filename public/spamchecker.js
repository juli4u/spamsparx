
const navbar = document.getElementById('navbar');
const menuToggle = document.getElementById('mobile-menu');
const navMenu = document.getElementById('nav-menu');
const bodyElement = document.body;
const MOBILE_BREAKPOINT = 768;

function switchToMobileView() {
    bodyElement.classList.add('mobile-view');
    if (navMenu) navMenu.classList.remove('active');
    if (menuToggle) {
        menuToggle.classList.remove('is-active');
        menuToggle.setAttribute('aria-expanded', 'false');
    }
}

function switchToDesktopView() {
    bodyElement.classList.remove('mobile-view');
    if (navMenu) navMenu.classList.remove('active');
    if (menuToggle) {
        menuToggle.classList.remove('is-active');
        menuToggle.setAttribute('aria-expanded', 'false');
    }
}

function checkScreenSize() {
    if (window.innerWidth < MOBILE_BREAKPOINT) {
        switchToMobileView();
    } else {
        switchToDesktopView();
    }
}

if (menuToggle) {
    menuToggle.addEventListener('click', () => {
        if (bodyElement.classList.contains('mobile-view')) {
            menuToggle.classList.toggle('is-active');
            if (navMenu) navMenu.classList.toggle('active');
            const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true' || false;
            menuToggle.setAttribute('aria-expanded', !isExpanded);
        }
    });
}

checkScreenSize(); 

let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(checkScreenSize, 200);
});


document.addEventListener('DOMContentLoaded', () => {
    const tips = [
        {
            title: "Never Share Sensitive Information via Email",
            description: "Legitimate organizations will rarely ask for passwords, credit card numbers, or other sensitive data directly through email. If asked, visit their official website directly instead of clicking email links."
        },
        {
            title: "Check the Sender's Email Address Carefully",
            description: "Scammers often use email addresses that look similar to legitimate ones but may have subtle differences (e.g., 'support@paypa1.com' instead of 'support@paypal.com'). Hover over the sender's name to see the actual email address."
        },
        {
            title: "Beware of Urgent or Threatening Language",
            description: "Phishing emails often try to create a sense of urgency or fear to trick you into acting quickly without thinking (e.g., 'Your account will be suspended unless you click this link immediately!')."
        },
        {
            title: "Look for Generic Greetings",
            description: "Legitimate companies usually address you by your name. Be wary of emails with generic greetings like 'Dear Valued Customer' or 'Dear Sir/Madam'."
        },
        {
            title: "Don't Click Suspicious Links or Attachments",
            description: "Hover over links to see the actual URL before clicking. If it looks suspicious or doesn't match the supposed sender, don't click. Avoid opening attachments from unknown senders, as they can contain malware."
        },
        {
            title: "Verify Requests Through Other Channels",
            description: "If you receive an unexpected request for information or action, contact the organization directly using a phone number or website you know is legitimate, not the contact info provided in the suspicious email."
        }
    ];

    let currentTipIndex = 0;
    const tipTitleElement = document.getElementById('tipTitle');
    const tipDescriptionElement = document.getElementById('tipDescription');
    const nextTipBtn = document.getElementById('nextTipBtn');

    function displayTip() {
        if (tipTitleElement && tipDescriptionElement && tips.length > 0) {
            tipTitleElement.textContent = tips[currentTipIndex].title;
            tipDescriptionElement.textContent = tips[currentTipIndex].description;
        }
    }

    if (nextTipBtn) {
        nextTipBtn.addEventListener('click', () => {
            currentTipIndex = (currentTipIndex + 1) % tips.length;
            displayTip();
        });
    }
    displayTip();



    const emailCheckerForm = document.getElementById('emailCheckerForm');
    const emailInput = document.getElementById('emailInput');
    const emailCheckResultDiv = document.getElementById('emailCheckResult');
    const checkEmailBtn = document.getElementById('checkEmailBtn');


    const YOUR_PROJECT_ID = 'scamsparx'; 
    const YOUR_REGION = 'us-central1';    

    const CLOUD_FUNCTION_URL_DEPLOYED = `https://${YOUR_REGION}-${YOUR_PROJECT_ID}.cloudfunctions.net/checkMailboxlayerEmail`;
    const CLOUD_FUNCTION_URL_LOCAL = `http://127.0.0.1:5001/${YOUR_PROJECT_ID}/${YOUR_REGION}/checkMailboxlayerEmail`; // Emulators often use 127.0.0.1

    const IS_LOCAL_DEVELOPMENT = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    const CHECK_EMAIL_API_ENDPOINT = IS_LOCAL_DEVELOPMENT ? CLOUD_FUNCTION_URL_LOCAL : CLOUD_FUNCTION_URL_DEPLOYED;

    if (emailCheckerForm) {
        emailCheckerForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            const email = emailInput.value.trim();

            if (!email) {
                displayEmailCheckResult('Please enter an email address.', 'error');
                return;
            }

            displayEmailCheckResult('Checking email...', 'loading');
            if(checkEmailBtn) checkEmailBtn.disabled = true;

            try {
                const response = await fetch(CHECK_EMAIL_API_ENDPOINT, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ email: email }),
                });

                if (!response.ok) {
                    let errorMsg = `Server error: ${response.status}`;
                    try {
                        const errorData = await response.json();
                        errorMsg = errorData.message || errorMsg;
                    } catch (e) { }
                    throw new Error(errorMsg);
                }

                const data = await response.json();
                console.log('Response from Cloud Function (Mailboxlayer data):', data);

                if (data.success === false) {
                     displayEmailCheckResult(`API Error: ${data.error ? data.error.info : 'Unknown API error from Mailboxlayer.'}`, 'error');
                } else if (data.smtp_check && data.score >= 0.65) { 
                    let message = `Email appears to be SAFE (Deliverability Score: ${data.score.toFixed(2)}).`;
                    if (data.disposable) message += " However, it's a DISPOSABLE email address, which can be risky.";
                    if (data.free && !data.disposable) message += " It's a FREE email provider.";
                    displayEmailCheckResult(message, 'safe');
                } else if (data.disposable) {
                    displayEmailCheckResult(`Email is from a DISPOSABLE provider. Potentially UNSAFE (Score: ${data.score.toFixed(2)}).`, 'unsafe');
                } else if (!data.smtp_check) { // SMTP check failed
                    displayEmailCheckResult(`Email server could not be verified (SMTP check failed). Use with caution (Score: ${data.score.toFixed(2)}).`, 'unsafe');
                } else { // Lower score or other conditions
                    displayEmailCheckResult(`Email might be RISKY or have deliverability issues (Score: ${data.score.toFixed(2)}).`, 'unsafe');
                }

            } catch (error) {
                console.error('Error calling Cloud Function:', error);
                displayEmailCheckResult(`Could not check email. ${error.message}`, 'error');
            } finally {
                if(checkEmailBtn) checkEmailBtn.disabled = false;
            }
        });
    }

    function displayEmailCheckResult(message, type) {
        if (emailCheckResultDiv) {
            emailCheckResultDiv.textContent = message;
            emailCheckResultDiv.className = 'result-display ' + type; 
            emailCheckResultDiv.style.display = 'block';
        }
    }
});

