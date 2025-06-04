document.addEventListener('DOMContentLoaded', function() {
    preventZoom();
    
    showStartupScreen();
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