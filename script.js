document.addEventListener('DOMContentLoaded', function() {
    preventZoom();
    
    // Check if user has already completed setup
    checkUserSetup();
});

function preventZoom() {
    document.addEventListener('gesturestart', function(e) {
        e.preventDefault();
    });
    
    let lastTouchEnd = 0;
    document.addEventListener('touchend', function(event) {
        const now = (new Date()).getTime();
        if (now - lastTouchEnd <= 300) {
            event.preventDefault();
        }
        lastTouchEnd = now;
    }, false);
}

function checkUserSetup() {
    const petName = localStorage.getItem('petName');
    const userName = localStorage.getItem('userName');
    
    if (petName && userName) {
        console.log('User already setup, going to homepage');
        window.location.href = 'homepage.html';
    } else {
        console.log('New user, showing startup sequence');
        showStartupScreen();
    }
}

function showStartupScreen() {
    const startupScreen = document.getElementById('startupScreen');
    const welcomeScreen = document.getElementById('welcomeScreen');
    
    startupScreen.classList.add('active');
    
    setTimeout(() => {
        startupScreen.classList.remove('active');
        setTimeout(() => {
            welcomeScreen.classList.add('active');
        }, 500);
    }, 2000);
}

window.addEventListener('orientationchange', function() {
    setTimeout(function() {
        window.scrollTo(0, 0);
    }, 500);
});

function startJourney() {
    if (navigator.vibrate) {
        navigator.vibrate(50);
    }
    
    console.log('Starting journey!');
    
    window.location.href = 'name-pet.html';
}