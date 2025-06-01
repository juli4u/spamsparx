const navbar = document.getElementById('navbar'); // The <nav> element
const menuToggle = document.getElementById('mobile-menu');
const navMenu = document.getElementById('nav-menu');
const bodyElement = document.body; // Get the body element

const MOBILE_BREAKPOINT = 768; // Define your breakpoint in pixels

function switchToMobileView() {

    bodyElement.classList.add('mobile-view');
    navMenu.classList.remove('active');
    menuToggle.classList.remove('is-active');
    menuToggle.setAttribute('aria-expanded', 'false');
}

function switchToDesktopView() {
    bodyElement.classList.remove('mobile-view');
    navMenu.classList.remove('active');
    menuToggle.classList.remove('is-active');
    menuToggle.setAttribute('aria-expanded', 'false');
}

function checkScreenSize() {
    if (window.innerWidth < MOBILE_BREAKPOINT) {
        switchToMobileView();
    } else {
        switchToDesktopView();
    }
}


menuToggle.addEventListener('click', () => {
    if (bodyElement.classList.contains('mobile-view')) {
        menuToggle.classList.toggle('is-active');
        navMenu.classList.toggle('active'); 

        const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true' || false;
        menuToggle.setAttribute('aria-expanded', !isExpanded);
    }
});


checkScreenSize();

let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(checkScreenSize, 200);
});

document.addEventListener('DOMContentLoaded', () => {
    // --- Phishing Tips Functionality ---
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
        if (tipTitleElement && tipDescriptionElement) {
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

    // Display initial tip
    displayTip();

});