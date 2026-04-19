

// In the background script or a content script of your Chrome extension
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "getData") {
        // Retrieve data from chrome.storage
        chrome.storage.local.get(['collectURL', "whitelist", "blacklist"], (result) => {
            // Respond with the retrieved data
            sendResponse({
                collectURL: result.collectURL,
                whitelist: result.whitelist,
                blacklist: result.blacklist
            });
        });
        return true; // Indicates that the response will be sent asynchronously
    }
});

let fulltext = "";

chrome.storage.local.get('account', function(result){

    let account = result.account;
    
    if(!account){
        if (!localStorage.getItem('otp') || localStorage.getItem('otp') === '') { 
            window.location.href = '../ui/welcome.html';

        }
        else{
            window.location.href = '../ui/otp.html';
        }
    }
    else{
        localStorage.removeItem('otp');
    }
    
});

// Button button
const details = document.getElementById('details-button');
const back = document.getElementById('back-to-dashboard');
const more_details = document.getElementById('details-dashboard');
const details_page = document.getElementById('details-page');
const ONorOFF = document.getElementById('change-piechart');

let active_detail = 0

details.onclick = () =>{
    if(active_detail == 0){
        active_detail += 1;
        more_details.style.marginLeft = '-380px';
        changeButtonColor();
    }
}

back.onclick = () =>{
    if(active_detail == 1){
        active_detail -= 1;
        more_details.style.marginLeft = '-780px';
        changeButtonColor();
    }
}

ONorOFF.onclick = () => {
    chrome.storage.local.get(['power'], function(result) {
        if (result.power == 'ON'){
            askForPassword('OnOff', null);
        }
        if (result.power == 'OFF'){
            chrome.storage.local.set({
                'power': 'ON',
                'url': 'source: n/a',
                'securityLevel': 'n/a',
                'status': 'on'
            });
            chrome.storage.local.remove(['SecureForNow', 'theURL']);
            window.location.href = '../ui/home.html';
        }
    });
    
}


chrome.storage.local.get(['status', 'securityLevel', 'url'], function(result) {
    // Process all at once
    if (result.status && result.securityLevel && result.url) {
        updateStatus(result.status);
        updateStatusIcon(result.status);
        updateSecurityLevel(result.securityLevel);
        updateUrl(result.url);

    }
    else {
        updateStatus('N/A');
        updateStatusIcon('n/a');
        updateSecurityLevel('n/a');
        updateUrl('n/a');
    }
});

// Status on Pie Chart
function updateStatus(result){
    if(result == 'off'){
        document.getElementById("status").innerText = "OFF";
        document.getElementById("change-piechart").style.border = "40px groove rgb(247, 119, 172)";
    }
    if(result == 'on'){
        document.getElementById("status").innerText = "ON";
        document.getElementById("change-piechart").style.border = "40px groove rgb(36, 254, 225)";
    }
    if(result == "safe"){
        document.getElementById("status").innerText = "Safe";
        document.getElementById("change-piechart").style.border = "40px groove rgb(0, 150, 0)";
    }
    if(result == "caution"){
        document.getElementById("status").innerText = "Caution";
        document.getElementById("change-piechart").style.border = "40px groove rgb(200, 125, 20)";
    }
    if(result == "risk"){
        document.getElementById("status").innerText = "Risk";
        document.getElementById("change-piechart").style.border = "40px groove rgb(200, 20, 20)";
    }
    if(result == "n/a"){
        document.getElementById("status").innerText = "N/A";
        document.getElementById("change-piechart").style.border = "40px groove rgb(128, 0, 128)";
    }
}


// Security Level
function updateSecurityLevel(result) {
    // Insert URL into the DOM
    if(result){
        document.getElementById('security-level').innerText = "Security Level: " + result;
    }
    else{
        document.getElementById('security-level').innerText = "Security Level: n/a";
    }
}

// Get URL Displayed
function updateUrl(result) {
    // Insert URL into the DOM
    if(result){
        document.getElementById('url').innerHTML = "<p class='dashboard-info' id='copy-text'>" + result + "</p>";
    }
    else{
        document.getElementById('url').innerHTML = "<p class='dashboard-info' id='copy-text'>Source: n/a</p>";
    }
    // Call the function to set up the click event after the content has been added
    setupCopyFunction();
}

// Function to copy text on click
function setupCopyFunction() {
    // Directly attach the click event listener
    const copyText = document.getElementById('copy-text');
    
    // Ensure the element exists before attaching the event
    if (copyText) {
        copyText.addEventListener('click', function() {
            const text = copyText.textContent;

            // Use the Clipboard API to copy the text
            navigator.clipboard.writeText(text).then(function() {
                console.log('Text copied to clipboard:', text);
                popupNotification('Text copied: ' + text);
            }).catch(function(error) {
                console.error('Error copying text:', error);
            });
        });
    }
}



// 
function updateStatusIcon(result) {
    const finalResult = document.querySelectorAll('.this-result');
    const ticks = document.querySelectorAll('#tick');
    if (result == 'n/a' || result == 'off' || result == 'on'){
        finalResult.forEach((slot) => {
            slot.innerText = "Result: N/A";
        });
        ticks.forEach((tick) => {
            changeIconColor(tick, 'na');
        });
    }
    else{
        let ticking = ['na','na','na','na','na','na','na','na','na','na','na','na','na','na','na','na','na','na'];

        // Fetching the ticking object from storage
        chrome.storage.local.get('ticking').then((result) => {
            if (result.ticking){
                ticking = result.ticking;
            }

            ticks.forEach((tick, index) => {
                changeIconColor(tick, ticking[index]);
            });

            finalResult.forEach((slot, index) => {
                let isSecure = false;

                switch (index) {
                    // Clickjacking
                    case 0:
                        isSecure = (ticking[0] === 'yes' || ticking[1] === 'yes');
                        break;
                    // XSS
                    case 1:
                        isSecure = (ticking[3] === 'yes' || ticking[4] === 'yes' || ticking[5] === 'yes' || ticking[6] === 'yes' || ticking[7] === 'yes' || ticking[8] === 'yes');
                        break;
                    // Prevent Data Leaks
                    case 2:
                        isSecure = (ticking[9] === 'yes' || ticking[10] === 'yes' || ticking[11] === 'yes');
                        break;
                    // Mixed Content Protection
                    case 3:
                        isSecure = (ticking[12] === 'yes' || ticking[13] === 'yes');
                        break;
                    // HSTS max-age
                    case 4:
                        isSecure = (ticking[14] === 'yes');
                        break;
                    // HSTS includeSubDomains
                    case 5:
                        isSecure = (ticking[15] === 'yes');
                        break;
                    // HSTS preload
                    case 6:
                        isSecure = (ticking[16] === 'yes');
                        break;
                    // X-Content-Type-Options
                    case 7:
                        isSecure = (ticking[17] === 'yes');
                        break;

                    default:
                        isSecure = false; // Default case
                }

                slot.innerText = isSecure ? "Result: Secure" : "Result: Not Secure";
            });
        });
    }
}

const clickjack = document.getElementById('clickjack');
const additional = document.getElementById('additional');

var clickjackSection = document.getElementById('Clickjack');
var additionalSection = document.getElementById('Additional');

clickjack.onclick = () =>{
    if (clickjackSection.hidden){
        clickjackSection.hidden = false; // Show Clickjack section
        additionalSection.hidden = true; // Hide Additional section

        changeButtonColor('click');
    }
}

additional.onclick = () =>{
    if (additionalSection.hidden){
        additionalSection.hidden = false; // Show Additional section
        clickjackSection.hidden = true; // Hide Clickjack section
        
        changeButtonColor('add');
    }
}


function iframeIt(){
    chrome.storage.local.get( 'iframe', function(result){
        let iframe = result.iframe || '';
    
        document.getElementById('iframeHere').style.cursor = 'not-allowed';
        document.getElementById('iframeHere').style.userSelect = 'none';
    
        if (iframe.startsWith('chrome')){
            document.getElementById('iframeHere').innerHTML = "<iframe src='null' allowfullscreen hidden></iframe>";
        }
        else{
            document.getElementById('iframeHere').innerHTML = "<iframe src='" + iframe + "' 'allow-scripts' hidden></iframe>";
        }

        const loadingScreen = document.getElementById('loading-screen');

        loadingScreen.classList.remove('hidden');
        loadingScreen.classList.add('visible');

        let checkIframe = document.querySelector('#iframeHere iframe');

        // Debugging: Check if iframe is found
        if (checkIframe) {
            console.log("Iframe found:", iframe);

            // Add onload event handler
            checkIframe.onload = function() {
                console.log("Iframe loaded successfully!");
                // Hide loading screen once iframe is loaded
                loadingScreen.classList.remove('visible');
                loadingScreen.classList.add('hidden');
            };
        } 
        else {
            console.error("Iframe not found!");
        }

    });
}


const poc = document.getElementById('poc');

poc.onclick = () => {
    
    chrome.storage.local.get('url', function(evt){
        chrome.storage.local.set({'poc' : evt.url});

        console.log("Sending URL to POC: ", evt.url);

        window.open('poc.html', '_blank'); // Opens in a new tab
    });
    
};



// const buttonToList = document.querySelectorAll('.buttonToListOption');

// Fetch the URL from storage once
chrome.storage.local.get('url', function(evt) {
    const storedUrl = evt.url; // Store the URL for use in the button clicks

    // Check if storedUrl is available
    
    if (storedUrl) {
        document.getElementById('buttonToListOption-blacklist').onclick = () => {
            checkList(extractDomain(storedUrl), 'black'); // Use the stored URL
        }
        document.getElementById('buttonToListOption-whitelist').onclick = () => {
            checkList(extractDomain(storedUrl), 'white'); // Use the stored URL
        }
    }
});

// Extract Domain from URL
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

const container = document.getElementById('notificationSlot');

function checkList(url, type){

    chrome.storage.local.get(['whitelist', 'blacklist'], function(result) {
        let whitelist = result.whitelist;
        let blacklist = result.blacklist;

        let whitelistArray = [];
        let blacklistArray = [];

        if (whitelist){
            whitelistArray = whitelist.split('\n').map(item => item.trim());
        }
        if (blacklist){
            blacklistArray = blacklist.split('\n').map(item => item.trim());
        }

        if (type == 'black'){
            // Check if whitelist is empty or not
            if(whitelist){
                // Check if the URL is already in the whitelist
                if (whitelistArray.includes(url)) {
                    askForPassword(type, url);
                }
                else{
                    // Check if blacklist is empty or not
                    if(blacklist){
                        // Check if the URL is already in the blacklist
                        if (blacklistArray.includes(url)) {
                            popupNotification("This Website Domain is already inside Blacklist..");
                        }
                        else{
                            askForPassword(type, url);
                        }
                    }
                    else{
                        askForPassword(type, url);
                    }
                }
            }
            else {
                // Check if blacklist is empty or not
                if(blacklist){
                    // Check if the URL is already in the blacklist
                    if (blacklistArray.includes(url)) {
                        popupNotification("This Website Domain is already inside Blacklist..");
                    }
                    else{
                        askForPassword(type, url);
                    }
                }
                else{
                    askForPassword(type, url);
                }
            }
        }
        if (type === 'white'){
            // Check if blacklist is empty or not
            if(blacklist){
                // Check if the URL is already in the blacklist
                if (blacklistArray.includes(url)) {
                    askForPassword(type, url);
                }
                else{
                    if(whitelist){
                        // Check if the URL is already in the blacklist
                        if (whitelistArray.includes(url)) {
                            popupNotification("This Website Domain is already inside Whitelist..");
                        }
                        else{
                            askForPassword(type, url);
                        }
                    }
                    else{
                        askForPassword(type, url);
                    }
                }
            }
            else{
                if(whitelist){
                    // Check if the URL is already in the blacklist
                    if (whitelistArray.includes(url)) {
                        popupNotification("This Website Domain is already inside Whitelist..");
                    }
                    else{
                        askForPassword(type, url);
                    }
                }
                else{
                    askForPassword(type, url);
                }
            }
        }
        
    });
}

function insertList(url, type){
    if(type === 'white' || type == 'newWhite'){
        chrome.storage.local.get('whitelist', function(result){
            // Get the Whitelist
            let whitelist = result.whitelist;  
      
            // Check if whitelist is empty or not
            if(whitelist){
                // Convert Whitelist string to an array by splitting on newline
                let whitelistArray = whitelist.split('\n').map(item => item.trim()); 
        
                // Check if the URL is already in the Whitelist
                if (!whitelistArray.includes(url)) {
                    // If the URL is not in the Whitelist, append it
                    whitelistArray.push(url);
        
                    // Convert the array back to a string with newlines
                    let updatedWhitelist = whitelistArray.join('\n');
        
                    // Save the updated Whitelist back to storage
                    chrome.storage.local.set({ 'whitelist': updatedWhitelist });
                }
            }
            else{
                chrome.storage.local.set({ 'whitelist': url });
            }
        });
        removedList(url, type);
    }
    if (type == 'black' || type == 'newBlack'){
        chrome.storage.local.get('blacklist', function(result) {
            // Get the Blacklist
            let blacklist = result.blacklist;
        
            // Check if blacklist is empty or not
            if(blacklist){
                // Convert blacklist string to an array by splitting on newline
                let blacklistArray = blacklist.split('\n').map(item => item.trim()); 
        
                // Check if the URL is already in the blacklist
                if (!blacklistArray.includes(url)) {
                    // If the URL is not in the blacklist, append it
                    blacklistArray.push(url);
            
                    // Convert the array back to a string with newlines
                    let updatedBlacklist = blacklistArray.join('\n');
            
                    // Save the updated blacklist back to storage
                    chrome.storage.local.set({ 'blacklist': updatedBlacklist });
                } 
            }
            else{
                chrome.storage.local.set({ 'blacklist': url });
            }
        });
        removedList(url, type);
    }
}

function removedList(url, type){
    if (type == 'white'){
        chrome.storage.local.get('blacklist', function(result) {
            // Get the blacklist
            let blacklist = result.blacklist;
        
            if (blacklist) {
                // Convert blacklist string to an array by splitting on newline
                let blacklistArray = blacklist.split('\n').map(item => item.trim());
        
                // Check if the URL is in the blacklist
                const index = blacklistArray.indexOf(url);
                
                // If the URL is found in the Blacklist, remove it
                if (index !== -1) {
                    blacklistArray.splice(index, 1);  // Remove the domain from the array
                }
        
                // Convert the array back to a string with newlines
                let updatedBlacklist = blacklistArray.join('\n');
        
                // Save the updated Blacklist back to storage
                chrome.storage.local.set({ 'blacklist': updatedBlacklist });
            }
        });
    }
    if (type === 'black'){
        chrome.storage.local.get('whitelist', function(result) {
            // Get the Whitelist
            let whitelist = result.whitelist;
        
            if (whitelist) {
                // Convert Whitelist string to an array by splitting on newline
                let whitelistArray = whitelist.split('\n').map(item => item.trim());
        
                // Check if the URL is in the Whitelist
                const index = whitelistArray.indexOf(url);
                
                // If the URL is found in the Whitelist, remove it
                if (index !== -1) {
                    whitelistArray.splice(index, 1);  // Remove the domain from the array
                }
        
                // Convert the array back to a string with newlines
                let updatedWhitelist = whitelistArray.join('\n');
        
                // Save the updated Whitelist back to storage
                chrome.storage.local.set({ 'whitelist': updatedWhitelist });
            }
        });
    }
}







function askForPassword(list, url){
    fulltext = '';

    fulltext += "<div class='alertMessage'>";
    fulltext += "<div class='alertBox'>";
    fulltext += "<div class='imageLock'><img src='../images/password.png'></div>";
    fulltext += "<div class='askPassword'>";
    fulltext += "<div class='askBox'>";
    fulltext += "<div class='askBox'>";
    fulltext += "<div class='title'>Security Measurement</div>";
    fulltext += "<div class='para'>Please enter the authorize Password</div>";
    fulltext += "<div class='Password'>Password: <input type='password' id='authorizePassword'></div>";
    fulltext += "<div class='buttonLayout'>";
    fulltext += "<a href='../ui/home.html'><div class='cancelButton'>Cancel</div></a>";
    fulltext += "<div class='proceedButton' id='proceedButton'>OK</div>";
    fulltext += "</div></div></div></div></div>";

    container.innerHTML = fulltext;

    changeButtonColor();

    activatedTheButton(list, url);
}

function activatedTheButton(list, url){

    const proceed = document.querySelectorAll('.proceedButton');

    proceed.forEach(button => {
        button.addEventListener('click', function() {
            
            let user = localStorage.getItem('mailTo');
            let pass = document.getElementById('authorizePassword').value;

            if (!user){
                popupNotification('User empty..!');
            }

            container.style.display = 'none';
            loadingScreen.classList.remove('hidden');
            loadingScreen.classList.add('visible');

            const data = {
                username: user,
                password: pass
            };

            checkPassword(data, list, url);
        });
    });
}

function checkPassword(data, list, url){
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
        container.style.display = 'block';
        loadingScreen.classList.remove('visible');
        loadingScreen.classList.add('hidden');

        // Handle the response from the server
        if (result.status) {
            correctPassword(list, url);
        } 
        else {
            popupNotification(result.message);
        }
    })
    .catch(error => {
        // Hide loading screen on error
        loadingScreen.classList.remove('visible');
        loadingScreen.classList.add('hidden');

        popupNotification('Fetch error: ' + error.message);  // Handle fetch errors
    });
}

function correctPassword(list, url){

    if (list === 'black'){
        insertList(url, list);
        popupNotification('Change from Whitelist to Blacklist successfully..!');
    }
    if (list === 'white'){
        insertList(url, list);
        popupNotification('Change from Blacklist to Whitelist successfully..!');
    }
    if (list === 'newBlack'){
        insertList(url, 'black');
        popupNotification('This Website Domain is added into Blacklist..');
    }
    if (list === 'newWhite'){
        insertList(url, 'white');
        popupNotification('This Website Domain is added into Whitelist..');
    }
    if (list === 'OnOff'){
        chrome.storage.local.set({
            'power': 'OFF',
            'url': 'source: n/a',
            'securityLevel': 'n/a',
            'status': 'off'
        });
        popupNotification('Turning off the CADS...');
        chrome.storage.local.remove(['theURL']);
    }
    
    chrome.storage.local.remove(['SecureForNow']);
}

function popupNotification(message){

    fulltext += "<div class='alertMessage'>";
    fulltext += "<div class='alertPopupBox'>";
    fulltext += "<div class='popupBox'>";
    fulltext += "<div class='titlePopup'>Notification</div>";
    fulltext += "<div class='para' id='messageHere'>" + message + "</div>";
    fulltext += "<div class='buttonLayout'>";
    fulltext += "<a href='../ui/home.html' class='ok' id='ok'><div>OK</div></a>";
    
    fulltext += "</div></div></div></div>";

    container.innerHTML = fulltext;

    changeButtonColor();
}