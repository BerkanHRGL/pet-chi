document.addEventListener('DOMContentLoaded', function() {
    preventZoom();
    setupGoalInput();
    
    setTimeout(() => {
        document.getElementById('goalInput').focus();
    }, 500);
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

function setupGoalInput() {
    const goalInput = document.getElementById('goalInput');
    const addButton = document.getElementById('addButton');
    
    goalInput.addEventListener('input', function() {
        const goalText = this.value.trim();
        addButton.disabled = goalText.length === 0;
    });
    
    goalInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter' && this.value.trim().length > 0) {
            addGoal();
        }
    });
}

function addGoal() {
    const goalInput = document.getElementById('goalInput');
    const goalText = goalInput.value.trim();
    
    if (goalText.length === 0) return;
    
    if (navigator.vibrate) {
        navigator.vibrate(50);
    }
    
    const existingGoals = JSON.parse(localStorage.getItem('goals')) || [];
    
    const newGoal = {
        id: Date.now(), 
        text: goalText,
        completed: false,
        dateAdded: new Date().toISOString().split('T')[0] 
    };
    

    existingGoals.push(newGoal);
    
    localStorage.setItem('goals', JSON.stringify(existingGoals));
    
    console.log('Goal added:', newGoal);
    console.log('Total goals:', existingGoals.length);
    
    window.location.href = 'homepage.html';
}

window.addEventListener('orientationchange', function() {
    setTimeout(function() {
        window.scrollTo(0, 0);
    }, 500);
});