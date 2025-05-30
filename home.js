const navbar = document.getElementById('navbar');
const menuToggle = document.getElementById('mobile-menu');
const navMenu = document.getElementById('nav-menu');

const MOBILE_BREAKPOINT = 768; // Define your breakpoint in pixels

function switchToMobileView() {
    if (!navbar.classList.contains('navbar--mobile')) {
        navbar.classList.add('navbar--mobile');
        navMenu.classList.remove('active');
        menuToggle.classList.remove('is-active');
        menuToggle.setAttribute('aria-expanded', 'false');
    }
}

function switchToDesktopView() {
    if (navbar.classList.contains('navbar--mobile')) {
        navbar.classList.remove('navbar--mobile');
        navMenu.classList.remove('active');
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

menuToggle.addEventListener('click', () => {
    if (navbar.classList.contains('navbar--mobile')) {
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