document.addEventListener('DOMContentLoaded', function() {
    preventZoom();
    loadPetName();
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

function loadPetName() {
    const petName = localStorage.getItem('petName') || 'Tommy';
    
    const introTitle = document.getElementById('introTitle');
    const introDescription = document.getElementById('introDescription');
    
    if (introTitle) {
        introTitle.textContent = `The better you do, the happier ${petName} gets!`;
    }
    
    if (introDescription) {
        introDescription.textContent = `${petName} loves watching you succeed! Add tasks to your list and complete them to see his mood brighten.`;
    }
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