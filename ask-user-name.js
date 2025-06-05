document.addEventListener('DOMContentLoaded', function() {
    const userNameInput = document.getElementById('userNameInput');
    const nextButton = document.querySelector('.next-button');
    const tommySpeech = document.getElementById('tommySpeech');
    
    const petName = localStorage.getItem('petName') || 'Tommy';
    
    tommySpeech.textContent = `${petName}... that feels just right! Now tell me, what's your name, friend?`;
    
    setTimeout(() => {
        userNameInput.focus();
    }, 500);
    
    // Enable/disable next button based on input
    userNameInput.addEventListener('input', function() {
        const name = this.value.trim();
        if (name.length > 0) {
            nextButton.disabled = false;
        } else {
            nextButton.disabled = true;
        }
    });
    
    userNameInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter' && this.value.trim().length > 0) {
            confirmUserName();
        }
    });
    
    nextButton.disabled = true;
});

function confirmUserName() {
    const userNameInput = document.getElementById('userNameInput');
    const userName = userNameInput.value.trim();
    
    if (userName.length === 0) return;
    
    localStorage.setItem('userName', userName);
    
    if (navigator.vibrate) {
        navigator.vibrate(50);
    }
    
    console.log(`User name: ${userName}`);
    
    // Navigate to meet user screen
    window.location.href = 'meet-user.html';
}