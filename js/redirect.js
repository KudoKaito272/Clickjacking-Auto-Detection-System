

// chrome.storage.local.get('url', function(result) {
//     let the_url = extractDomain(result.url);
//     chrome.storage.local.set({ 'SecureForNow' : the_url });

//     document.getElementById('insert_here').innerHTML = `
//         <div class="button" id="back">
//             Back
//         </div>
//         <div class="button" id="${the_url}">
//             Click to Continue
//         </div>`;

//     document.querySelectorAll('.button').forEach((button, index) => {
//         if (index === 1) {
//             button.onclick = () => {
//                 window.history.go(-1);
//             };
//         }
//     });
// });

// function SecureForNow(url) {

//     chrome.storage.local.get('SecureForNow', function(result) {
  
//         let secureForNow = result.SecureForNow;

//         if (secureForNow){
//             let secureForNowArray = secureForNow.split('\n').map(item => item.trim());

//             if (!secureForNowArray.includes(url)) {
//                 secureForNowArray.push(url);
//                 let updatedSecureForNow = secureForNowArray.join('\n');
//                 chrome.storage.local.set({ 'SecureForNow' : updatedSecureForNow });
//             }
//             else{
//                 console.log("Already marked in SecureForNow");
//             }
//         }

//         else{
//             chrome.storage.local.set({ 'SecureForNow' : url });
//         }
//     });
// }

// function SecureForNow(url) {
//     chrome.storage.local.get('SecureForNow', function(result) {
//         let secureForNow = result.SecureForNow || [];  // Default to empty array if no value exists

//         let currentTime = Date.now();  // Get the current timestamp

//         // Remove any expired URLs (older than 30 minutes)
//         secureForNow = secureForNow.filter(item => currentTime - item.timestamp <= 30 * 60 * 1000);

//         // Check if the URL is already in the array
//         let existingIndex = secureForNow.findIndex(item => item.url === url);

//         if (existingIndex === -1) {
//             // If the URL isn't already marked, add it with the current timestamp
//             secureForNow.push({ url: url, timestamp: currentTime });
//             console.log(`URL added to 'SecureForNow': ${url}`);
//         } else {
//             console.log("URL already marked in SecureForNow");
//         }

//         // Update the 'SecureForNow' storage with the new array
//         chrome.storage.local.set({ 'SecureForNow': secureForNow });

//         // Optionally: Reset the 30-minute timeout
//         setClearTimeout();
//     });
// }

// // Function to clear 'SecureForNow' after 30 minutes
// function clearSecureForNow() {
//     chrome.storage.local.remove('SecureForNow', function() {
//         console.log("The 'SecureForNow' item has been cleared from storage.");
//     });
// }

// // Variable to store the timeout ID
// let timeoutId;

// // Function to set the timeout
// function setClearTimeout() {
//     // Clear the existing timeout (if any)
//     if (timeoutId) {
//         clearTimeout(timeoutId);
//         console.log("Previous timeout cleared.");
//     }

//     // Set a new timeout to clear 'SecureForNow' after 30 minutes
//     timeoutId = setTimeout(() => {
//         clearSecureForNow();
//     }, 30 * 60 * 1000); // 30 minutes in milliseconds
// }

const go = document.getElementById('go');
const back = document.getElementById('back');

function extractDomain(url) {
    let domain;
    if (url.indexOf("://") > -1) {
        domain = url.split('/')[2];
    } 
    else {
        domain = url.split('/')[0];
    }
    return domain.split(':')[0].toLowerCase().trim();
}

go.onclick = () => {

    // SecureForNow(document.getElementById('url').textContent);

    chrome.storage.local.get('url', function(result) {
        let the_url = extractDomain(result.url);
        chrome.storage.local.set({ 'SecureForNow' : the_url });
    });
    window.history.go(-1);
};


back.onclick = () => {
    window.history.go(-2);
};

chrome.storage.local.get(['NotificationColor', 'theURL', 'securityLevel'], function(result){
    if (result.NotificationColor){
        if (result.NotificationColor === 'White'){
            document.getElementById('mode-color').style.backgroundColor = '#fff';
            document.getElementById('mode-color').style.color = 'black';
            document.getElementById('go').style.borderColor = 'black';
            document.getElementById('back').style.borderColor = 'black';

            document.querySelector('.decription').style.color = '#7f7f7f';
        }
        if (result.NotificationColor === 'Black'){
            document.getElementById('mode-color').style.backgroundColor = '#1b1b1b';
            document.getElementById('mode-color').style.color = '#fff';
            document.getElementById('go').style.borderColor = '#fff';
            document.getElementById('back').style.borderColor = '#fff';

            document.querySelector('.decription').style.color = '#f0f0f0e3';
        }   
    }
    else{
        document.getElementById('mode-color').style.backgroundColor = '#fff';
        document.getElementById('mode-color').style.color = 'black';
        document.getElementById('go').style.borderColor = 'black';
        document.getElementById('back').style.borderColor = 'black';

        document.querySelector('.decription').style.color = '#7f7f7f';
    }

    domain = extractDomain(result.theURL);
    
    document.getElementById('url').innerText = domain;

    document.getElementById('security-level').innerText = result.securityLevel;
});