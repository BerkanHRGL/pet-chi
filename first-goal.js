document.addEventListener('DOMContentLoaded', function() {
    preventZoom();
    loadUserName();
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

function loadUserName() {
    const userName = localStorage.getItem('userName') || getUrlParameter('name') || 'Berkan';
    const petName = localStorage.getItem('petName') || getUrlParameter('petName') || 'Tommy';
    
    const greetingText = document.getElementById('greetingText');
    greetingText.textContent = `Alright ${userName}, let's start by adding your first goal!`;
    
    const tipText = document.querySelector('.tip-text');
    tipText.textContent = `Tip: Start with something small and easy, even "drink a glass of water" counts! ${petName} loves celebrating any win!`;
}

function getUrlParameter(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}

function proceedToGoalInput() {
    if (navigator.vibrate) {
        navigator.vibrate(50);
    }
    
    console.log('Proceeding to goal input screen');
    

    window.location.href = 'homepage.html';
}

window.addEventListener('orientationchange', function() {
    setTimeout(function() {
        window.scrollTo(0, 0);
    }, 500);
});