import { initializeApp } from "https://www.gstatic.com/firebasejs/11.8.0/firebase-app.js";
import { getFirestore, collection, addDoc, serverTimestamp, query, where, getDocs } from "https://www.gstatic.com/firebasejs/11.8.0/firebase-firestore.js";
const firebaseConfig = {
  apiKey: "AIzaSyBhmrEsXvFIZMRYJAh3WDBkv7C-yBNUCgs",
  authDomain: "scamsparx.firebaseapp.com",
  projectId: "scamsparx",
  storageBucket: "scamsparx.firebasestorage.app",
  messagingSenderId: "762029392450",
  appId: "1:762029392450:web:4d8af3772ddb59f957e3db",
  measurementId: "G-98XFDS7V6L"
};

let app;
let db; 

try {
    app = initializeApp(firebaseConfig);
    db = getFirestore(app); 
    if (!db) {
        throw new Error("Firestore could not be initialized. Firebase app might not be ready or config is incorrect.");
    }
    console.log("Firebase and Firestore initialized successfully.");
} catch (e) {
    console.error("CRITICAL: Error initializing Firebase or Firestore:", e);

    const initErrorDiv = document.getElementById('newsletterMessage') || document.body; // Fallback to body
    initErrorDiv.innerHTML = `<p style="color: red; text-align: center; padding: 10px; border: 1px solid red; background-color: #ffe0e0;">
        Error: Could not connect to the subscription service. Please try again later or contact support.
    </p>`;
    
    const tempSignUpBtn = document.getElementById('newsletterSignUpBtn');
    if (tempSignUpBtn) {
        tempSignUpBtn.textContent = 'Service Unavailable';
        tempSignUpBtn.disabled = true;
    }

}


document.addEventListener('DOMContentLoaded', () => {
    const newsletterForm = document.getElementById('newsletterForm');
    const newsletterEmailInput = document.getElementById('newsletterEmail');
    const newsletterMessageDiv = document.getElementById('newsletterMessage');
    const newsletterSignUpBtn = document.getElementById('newsletterSignUpBtn');


    if (!db && newsletterSignUpBtn) {
        newsletterSignUpBtn.textContent = 'Service Unavailable';
        newsletterSignUpBtn.disabled = true;
        return; 
    }


    if (newsletterForm) {
        newsletterForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            const email = newsletterEmailInput.value.trim();

            displayNewsletterMessage('', ''); 

            if (!email) {
                displayNewsletterMessage('Please enter an email address.', 'error');
                return;
            }

            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailPattern.test(email)) {
                displayNewsletterMessage('Please enter a valid email address format.', 'error');
                return;
            }

            if (newsletterSignUpBtn) {
                newsletterSignUpBtn.disabled = true;
                newsletterSignUpBtn.textContent = 'Processing...';
            }
            displayNewsletterMessage('Subscribing...', 'loading');

            try {
                const subscribersCollectionRef = collection(db, "newsletterSubscribers");


                const dataToWrite = {
                    email: email,
                    subscribedAt: serverTimestamp()
                };
                console.log("Data being sent to Firestore for create:", JSON.stringify(dataToWrite, null, 2));
 
                await addDoc(subscribersCollectionRef, dataToWrite);

                console.log("Email added to Firestore newsletterSubscribers:", email);
                displayNewsletterMessage('Thank you for subscribing! We will keep you updated.', 'success');
                newsletterEmailInput.value = '';

            } catch (error) {
                console.error('Error subscribing to newsletter:', error);
                let errorMessage = 'Subscription failed. Please try again later.';
                if (error.code) {
                    switch (error.code) {
                        case 'permission-denied':
                            errorMessage = 'Subscription failed: Permission denied.';
                            break;
                        case 'unavailable':
                            errorMessage = 'Subscription failed: The service is temporarily unavailable.';
                            break;
                        default:
                            errorMessage = `Subscription failed: ${error.message || 'An unknown error occurred.'}`;
                    }
                }
                displayNewsletterMessage(errorMessage, 'error');
            } finally {
                if (newsletterSignUpBtn) {
                    newsletterSignUpBtn.disabled = false;
                    newsletterSignUpBtn.textContent = 'Sign up';
                }
                if (newsletterMessageDiv.classList.contains('loading') &&
                    !newsletterMessageDiv.classList.contains('success') &&
                    !newsletterMessageDiv.classList.contains('error')) {
                    displayNewsletterMessage('', '');
                }
            }
        });
    } else {
        console.warn("Newsletter form with ID 'newsletterForm' not found.");
    }

    function displayNewsletterMessage(message, type) {
        if (newsletterMessageDiv) {
            newsletterMessageDiv.textContent = message;
            newsletterMessageDiv.classList.remove('success', 'error', 'loading');
            if (type) {
                newsletterMessageDiv.classList.add(type);
            }
            newsletterMessageDiv.style.display = message ? 'block' : 'none';
        } else {
            console.warn("Newsletter message display element with ID 'newsletterMessage' not found.");
        }
    }
});
