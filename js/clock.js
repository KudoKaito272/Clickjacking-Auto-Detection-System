function updateClock() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');

    document.getElementById('hours').textContent = hours;
    document.getElementById('minutes').textContent = minutes;

    // Toggle the colon's visibility
    const colon = document.getElementById('colon');
    colon.style.visibility = colon.style.visibility === 'visible' ? 'hidden' : 'visible';
}

// Update clock every second
setInterval(updateClock, 1000);

// Initial call to display clock immediately on load
updateClock();