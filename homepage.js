document.addEventListener('DOMContentLoaded', function() {
    preventZoom();
    loadPetData();
    loadGoalsProgress();
    updatePetMood();
    
    // Enable scrolling for homepage
    document.body.classList.add('homepage-active');
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

function loadPetData() {
}

function loadGoalsProgress() {
    const goals = JSON.parse(localStorage.getItem('goals')) || [];
    const completedGoals = goals.filter(goal => goal.completed).length;
    const totalGoals = goals.length;
    
    updateProgressDisplay(completedGoals, totalGoals);
    displayGoalsList(goals);
}

function updateProgressDisplay(completed, total) {
    const progressFill = document.getElementById('progressFill');
    const progressText = document.getElementById('progressText');
    
    const percentage = total > 0 ? (completed / total) * 100 : 0;
    
    progressFill.style.width = percentage + '%';
    progressText.textContent = `${completed}/${total}`;
    
    localStorage.setItem('currentProgress', JSON.stringify({completed, total}));
}

function updatePetMood() {
    const petSprite = document.getElementById('petSprite');
    const progress = JSON.parse(localStorage.getItem('currentProgress')) || {completed: 0, total: 3};
    
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

function displayGoalsList(goals) {
    const goalsList = document.getElementById('goalsList');
    goalsList.innerHTML = '';
    
    const incompleteGoals = goals.filter(goal => !goal.completed);
    
    incompleteGoals.forEach(goal => {
        const goalItem = document.createElement('div');
        goalItem.className = 'goal-item';
        
        goalItem.innerHTML = `
            <p class="goal-text">${goal.text}</p>
            <div class="goal-checkbox" onclick="toggleGoal(${goal.id})">
                <!-- Empty checkbox since these are all incomplete -->
            </div>
        `;
        
        goalsList.appendChild(goalItem);
    });
}

function toggleGoal(goalId) {
    if (navigator.vibrate) {
        navigator.vibrate(30);
    }
    
    const goals = JSON.parse(localStorage.getItem('goals')) || [];
    
    const goalIndex = goals.findIndex(goal => goal.id === goalId);
    if (goalIndex !== -1) {
        goals[goalIndex].completed = !goals[goalIndex].completed;
        
        localStorage.setItem('goals', JSON.stringify(goals));
        
        if (goals[goalIndex].completed) {
            const checkbox = event.target;
            checkbox.innerHTML = '<span class="checkmark">✓</span>';
            checkbox.classList.add('completed');
            
            setTimeout(() => {
                loadGoalsProgress();
                updatePetMood();
            }, 300);
        } else {
            loadGoalsProgress();
            updatePetMood();
        }
    }
}

function addNewGoal() {
    if (navigator.vibrate) {
        navigator.vibrate(50);
    }
    
    console.log('Adding new goal');
    
    window.location.href = 'add-goal.html';
}

function refreshProgress() {
    loadGoalsProgress();
    updatePetMood();
}

window.addEventListener('storage', function(e) {
    if (e.key === 'goals') {
        refreshProgress();
    }
});

window.addEventListener('orientationchange', function() {
    setTimeout(function() {
        window.scrollTo(0, 0);
    }, 500);
});

window.petchiApp = {
    refreshProgress: refreshProgress,
    updatePetMood: updatePetMood
};