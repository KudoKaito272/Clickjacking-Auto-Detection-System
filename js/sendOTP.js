
function sendOTP(type){
    const otp = localStorage.getItem('otp');

    // Default Mail Setting
    const sender = 'mail@cads2024.com';
    const user = localStorage.getItem('user');
    let receiver = localStorage.getItem('mailTo') || '';
    const subject = 'OTP Verification Code';
    const message = `${otp}`;

    const data = {
        from_email: sender,  // sender is dynamic
        to_name: user,     // Can be dynamic if needed
        to_email: receiver,  // Use dynamic receiver email
        subject: subject,
        message: message
    };

    // loadingScreen.style.display = 'block';
    loadingScreen.classList.remove('hidden');
    loadingScreen.classList.add('visible');

    // Make the fetch request
    fetch('https://cads2024.com/php/otp.php', {
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
        if (result.status === 'success') {
            if (type === 'resend'){
                popupNotification('OTP is being resend to your registered email..', '');
            }
            else{
                popupNotification('OTP was been send to your registered email..!', '../ui/otp.html');
            }
            // window.location.href = '../ui/otp.html';  // Redirect on successful login
        } else {
            popupNotification('Error sending email: ' + result.message, '');
        }
    })
    .catch(error => {
        // Hide loading screen on error
        // loadingScreen.style.display = 'none';
        loadingScreen.classList.remove('visible');
        loadingScreen.classList.add('hidden');

        popupNotification('Fetch error: ' + error.message, '');  // Handle fetch errors
    });
}

function createOTP() {
    // Generate a random number between 100000 and 999999
    let otp = Math.floor(100000 + Math.random() * 900000);
    return otp;
}

const container = document.getElementById('page');
let fulltext = "";

function popupNotification(message, whereNow) {
    fulltext += "<div class='alertMessage'>";
    fulltext += "<div class='alertPopupBox'>";
    fulltext += "<div class='popupBox'>";
    fulltext += "<div class='titlePopup'>Notification</div>";
    fulltext += "<div class='para' id='messageHere'>" + message + "</div>";
    fulltext += "<div class='buttonLayout'>";
    fulltext += `<a href='${whereNow}' class='ok'><div>OK</div></a>`;
    fulltext += "</div></div></div></div>";

    container.innerHTML = fulltext;
}