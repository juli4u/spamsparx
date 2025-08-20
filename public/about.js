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