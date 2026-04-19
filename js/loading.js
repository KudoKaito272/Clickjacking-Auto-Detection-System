
const loadingScreen = document.getElementById('loading-screen');

function loadingNow(timer,afterThat) {

    loadingScreen.classList.remove('hidden');
    loadingScreen.classList.add('visible');
    
    // Hide the loading screen after 3 seconds
    setTimeout(function() {
        loadingScreen.classList.remove('visible');
        loadingScreen.classList.add('hidden');

        if (afterThat){
            window.location.href = afterThat;
        }
        
    }, timer);
}

// Call the loadingNow function
// loadingNow(2000);