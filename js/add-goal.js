document.addEventListener('DOMContentLoaded', function() {
    preventZoom();
    setupGoalInput();
    updatePetMoodOnAddGoal(); 
    
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

function updatePetMoodOnAddGoal() {
    const petSprite = document.getElementById('petSprite');
    const progress = JSON.parse(localStorage.getItem('currentProgress')) || {completed: 0, total: 0};
    
    petSprite.classList.remove('happy', 'sad', 'neutral');
    
    const completionRate = progress.total > 0 ? progress.completed / progress.total : 0;
    
    if (completionRate >= 0.8) {
        petSprite.src = 'imgs/petchi-happy.png';
        petSprite.classList.add('happy');
    } else if (completionRate <= 0.2 && progress.total > 0) {
        petSprite.src = 'imgs/petchi-sad.png';
        petSprite.classList.add('sad');
    } else {
        petSprite.src = 'imgs/petchi-neutral.png';
        petSprite.classList.add('neutral');
    }
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
    
    const completedGoals = existingGoals.filter(goal => goal.completed).length;
    const totalGoals = existingGoals.length;
    localStorage.setItem('currentProgress', JSON.stringify({completed: completedGoals, total: totalGoals}));
    
    console.log('Goal added:', newGoal);
    console.log('Total goals:', existingGoals.length);
    
    window.location.href = 'homepage.html';
}

window.addEventListener('orientationchange', function() {
    setTimeout(function() {
        window.scrollTo(0, 0);
    }, 500);
});