document.addEventListener('DOMContentLoaded', function() {
    const nameInput = document.getElementById('petNameInput');
    const nextButton = document.querySelector('.next-button');
    
    setTimeout(() => {
        nameInput.focus();
    }, 500);
    
    nameInput.addEventListener('input', function() {
        const name = this.value.trim();
        if (name.length > 0) {
            nextButton.disabled = false;
        } else {
            nextButton.disabled = true;
        }
    });
    
    nameInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter' && this.value.trim().length > 0) {
            confirmName();
        }
    });
    
    nextButton.disabled = true;
});

function confirmName() {
    const nameInput = document.getElementById('petNameInput');
    const petName = nameInput.value.trim();
    
    if (petName.length === 0) return;
    
    localStorage.setItem('petName', petName);
    
    if (navigator.vibrate) {
        navigator.vibrate(50);
    }
    
    console.log(`Pet named: ${petName}`);
    
    window.location.href = 'ask-user-name.html';
}