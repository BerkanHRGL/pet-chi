document.addEventListener('DOMContentLoaded', function() {
    const meetUserSpeech = document.getElementById('meetUserSpeech');
    
    const userName = localStorage.getItem('userName') || 'friend';
    
    meetUserSpeech.textContent = `Aah ${userName}! Nice to meet you!`;
});

function goToExplanation() {
    if (navigator.vibrate) {
        navigator.vibrate(50);
    }
    
    console.log('Going to explanation screen!');
    
    window.location.href = 'intro-explanation.html';
}