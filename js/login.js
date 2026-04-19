

document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent the form from refreshing the page

    const user = document.getElementById('inp-user').value;
    const pass = document.getElementById('inp-pass').value;
    const code = document.getElementById('inp-act').value;

    const OnOff = document.getElementById('on-off').checked;
    localStorage.setItem('OnOff', 'OFF');

    if (OnOff){
        localStorage.setItem('OnOff', 'ON');
    }

    if (user && pass && code) {
        login(user, pass, code);
    }
});

function login(user, pass, code) {
    const OTP_Code = createOTP();

    loadingScreen.classList.remove('hidden');
    loadingScreen.classList.add('visible');

    const data = {
        username: user,
        password: pass,
        code, code
    };

    // Make the fetch request
    fetch('https://cads2024.com/php/verifyPassword.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams(data)  // Convert data to URL-encoded format
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`Server error: ${response.status}`);  // Throw error if response is not OK
        }
        return response.json();  // Parse JSON response
    })
    .then(result => {
        // Hide loading screen on error
        loadingScreen.classList.remove('visible');
        loadingScreen.classList.add('hidden');

        // Handle the response from the server
        if (result.status) {
            localStorage.setItem('otp',OTP_Code);
            localStorage.setItem('user', result.username);
            localStorage.setItem('activationCode', code);
            localStorage.setItem('mailTo', result.email);
            sendOTP();
        } 
        else {
            popupNotification('Wrong Email or Password: ' + result.message, '');
        }
    })
    .catch(error => {
        // Hide loading screen on error
        loadingScreen.classList.remove('visible');
        loadingScreen.classList.add('hidden');

        popupNotification('Fetch error: ' + error.message, '');  // Handle fetch errors
    });
}
