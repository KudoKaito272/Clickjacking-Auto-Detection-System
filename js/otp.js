
// otp.html
try {
    document.querySelectorAll('.box').forEach((input, index, inputs) => {
        input.addEventListener('input', () => {
            // Move to next input if length is 1
            if (input.value.length === 1) {
                if (index < inputs.length - 1) {
                    inputs[index + 1].focus();
                }
            } else if (input.value.length === 0 && index > 0) {
                // Move to previous input if current input is empty
                inputs[index - 1].focus();
            }
        });
    });
    
    
    document.getElementById('resend').onclick = () => {
        localStorage.setItem('otp', createOTP());
        sendOTP('resend');
    }
    
    document.getElementById('change').onclick = () => {
        loadingNow(1000,'../ui/login.html');
    }

    document.getElementById('login').addEventListener('submit', function(event) {
        event.preventDefault(); // Prevent the form from refreshing the page

        let data = '';
        let otp = localStorage.getItem('otp');
    
        document.querySelectorAll('.box').forEach(input => {
            data += input.value;
        });

        if (data === otp){
            let account = localStorage.getItem('mailTo');
            let OnOff = localStorage.getItem('OnOff');

            chrome.storage.local.set({'account' : account});
            chrome.storage.local.set({'power' : OnOff});
            chrome.storage.local.set({'notification' : 'maximize'});
            chrome.storage.local.set({ 'whiteON' : 'ON' });
            chrome.storage.local.set({ 'blackON' : 'ON' });
            chrome.storage.local.set({ 'action' : 'Ready' });

            if (OnOff == 'ON'){
                localStorage.setItem('scan', 'on');
                chrome.storage.local.set({'status' : 'on'});
                chrome.storage.local.set({'iframe' : 'null'});
            }
            if (OnOff == 'OFF'){
                localStorage.setItem('scan', 'off');
                chrome.storage.local.set({'status' : 'off'});
                chrome.storage.local.set({'iframe' : 'null'});
            }
            loadingNow(1000);
            setTimeout(function() {
                popupNotification(`Welcome to Clickjacking Auto Detection System CADS, ${localStorage.getItem('user')}`, '../ui/home.html');
            },1000);
        }
        else{
            loadingNow(2000);
            setTimeout(function() {
                popupNotification('The OTP you entered does not match the one sent. Please try again..','');
            },1000);
        }
    });
}
catch(e){
    console.log('Just noot here..')
}
