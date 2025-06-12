document.addEventListener('DOMContentLoaded', function() {
    preventZoom();
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

function goToMainApp() {
    if (navigator.vibrate) {
        navigator.vibrate(50);
    }
    
    console.log('Going to first goal screen');
    
    window.location.href = 'first-goal.html';
}

window.addEventListener('orientationchange', function() {
    setTimeout(function() {
        window.scrollTo(0, 0);
    }, 500);
});