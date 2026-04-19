let fulltext = "";

function askForPassword(container, id, list, currentpage){

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
    if (currentpage == 'history'){
        fulltext += "<a href='../ui/history.html'><div class='cancelButton'>Cancel</div></a>";
    }
    if (currentpage == 'whitelist'){
        fulltext += "<a href='../ui/whitelist.html'><div class='cancelButton'>Cancel</div></a>";
    }
    if (currentpage == 'blacklist'){
        fulltext += "<a href='../ui/blacklist.html'><div class='cancelButton'>Cancel</div></a>";
    }
    if (currentpage == 'setting'){
        fulltext += "<a href='../ui/setting.html'><div class='cancelButton'>Cancel</div></a>";
    }
    if (currentpage == 'home'){
        fulltext += "<a href='../ui/home.html'><div class='cancelButton'>Cancel</div></a>";
    }
    fulltext += "<div class='proceedButton' id='proceedButton'>OK</div>";
    fulltext += "</div></div></div></div></div>";

    container.innerHTML = fulltext;

    changeButtonColor();

    activatedTheButton(container, id, list, currentpage);
}

function activatedTheButton(container, id, list, currentpage){

    const proceed = document.querySelectorAll('.proceedButton');

    proceed.forEach(button => {
        button.addEventListener('click', function() {
            
            let user = localStorage.getItem('mailTo');
            let pass = document.getElementById('authorizePassword').value;

            if (!user){
                popupNotification('User empty..!', container, currentpage, null);
            }

            container.style.display = 'none';
            loadingScreen.classList.remove('hidden');
            loadingScreen.classList.add('visible');

            const data = {
                username: user,
                password: pass
            };

            checkPassword(data, container, id, list, currentpage);
        });
    });
}

function checkPassword(data, container, id, list, currentpage){
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
            correctPassword(container, id, list, currentpage);
        } 
        else {
            popupNotification(result.message, container, currentpage, null);
        }
    })
    .catch(error => {
        // Hide loading screen on error
        loadingScreen.classList.remove('visible');
        loadingScreen.classList.add('hidden');

        popupNotification('Fetch error: ' + error.message);  // Handle fetch errors
    });
}

function correctPassword(container, id, list, currentpage){
    if (currentpage == 'history'){
        if (list === 'black'){
            insertList(id, list);
            popupNotification('Change from Whitelist to Blacklist successfully..!', container, currentpage, null);
        }
        if (list === 'white'){
            insertList(id, list);
            popupNotification('Change from Blacklist to Whitelist successfully..!', container, currentpage, null);
        }
        if (list === 'newBlack'){
            insertList(id, 'black');
            popupNotification('This Website Domain is added into Blacklist..', container, currentpage, null);
        }
        if (list === 'newWhite'){
            insertList(id, 'white');
            popupNotification('This Website Domain is added into Whitelist..', container, currentpage, null);
        }
    }
    if (currentpage == 'whitelist'){
        if (list === 'remove'){
            removedList(id, list);
            popupNotification('Whitelist deleted successfully..!', container, currentpage, null);
        }
        if (list === 'black'){
            insertList(id, list);
            popupNotification('Change from Whitelist to Blacklist successfully..!', container, currentpage, null);
        }
        if (list == null){
            chrome.storage.local.remove(['whitelist']);
            popupNotification('All whitelist deleted successfully..!', container, currentpage, null);
        }
    }
    if (currentpage == 'blacklist'){
        if (list === 'remove'){
            removedList(id, list);
            popupNotification('Blacklist deleted successfully..!', container, currentpage, null);
        }
        if (list === 'white'){
            insertList(id, list);
            popupNotification('Change from Blacklist to Whitelist successfully..!', container, currentpage, null);
        }
        if (list == null){
            chrome.storage.local.remove(['blacklist']);
            popupNotification('All blacklist deleted successfully..!', container, currentpage, null);
        }
    }
    if (currentpage == 'setting'){
        
        // chrome.storage.local.get('action', function(result){
        //     if(result.action == 'whiteON'){
        //         const buttonWhitelist = document.getElementById('sw-4');
        //         const whitelistON = document.getElementById('slider-text-4');

        //         buttonWhitelist.checked = false;
        //         whitelistON.innerHTML = "disable";

        //         chrome.storage.local.set({ 'whiteON' : 'OFF' });
        //         localStorage.setItem('whiteOn', 'off');

        //         popupNotification('Turning off the Whitelist..', container, currentpage, 'wait');
        //     }
        //     if(result.action == 'blackON'){
        //         const buttonBlacklist = document.getElementById('sw-5');
        //         const blacklistON = document.getElementById('slider-text-5');

        //         buttonBlacklist.checked = false;
        //         blacklistON.innerHTML = "disable";

        //         chrome.storage.local.set({ 'blackON' : 'OFF' });
        //         localStorage.setItem('blackOn', 'off');
                
        //         popupNotification('Turning off the Blacklist..', container, currentpage, 'wait');
        //     }
        //     if(result.action == 'OnOff'){
        //         const On = document.getElementById('on-scan');

        //         On.style.backgroundColor = 'transparent';
        //         localStorage.setItem('scan', 'off');
        //         chrome.storage.local.set({'power' : 'OFF', 'status' : 'off', 'iframe' : 'null'});

        //         changeButtonColor();
                
        //         popupNotification('Turning off the CADS..', container, currentpage, 'wait');
        //     }

        //     else{
        //         popupNotification('All Data has been cleared successfully..!', notificationSlot, 'setting', 'next');

        //         // Example: Call the function to clear everything except 'iframe' and 'userSettings'
        //         clearLocalStorageExcept([
        //             'power'
        //             , 'notification'
        //             , 'whiteON'
        //             , 'blackON'
        //             , 'default_user'
        //             , 'default_pass'
        //             , 'user'
        //             , 'account'
        //             , 'ColorCodeBackground'
        //             , 'ColorCodeButton'
        //             , 'ColorCodeText'
        //             , 'IconColor'
        //             , 'ColorCodeGraph'
        //             , 'ColorCodeDashboard'
        //             , 'IconColor'
        //             , 'NotificationColor'
        //         ]);
        //     }
        // });
        

        if (list == 'whiteON'){
            const buttonWhitelist = document.getElementById('sw-4');
            const whitelistON = document.getElementById('slider-text-4');

            buttonWhitelist.checked = false;
            whitelistON.innerHTML = "disable";

            chrome.storage.local.set({ 'whiteON' : 'OFF' });
            localStorage.setItem('whiteOn', 'off');

            popupNotification('Turning off the Whitelist..', container, currentpage, 'wait');
        }
        if (list == 'blackON'){
            const buttonBlacklist = document.getElementById('sw-5');
            const blacklistON = document.getElementById('slider-text-5');

            buttonBlacklist.checked = false;
            blacklistON.innerHTML = "disable";

            chrome.storage.local.set({ 'blackON' : 'OFF' });
            localStorage.setItem('blackOn', 'off');
            
            popupNotification('Turning off the Blacklist..', container, currentpage, 'wait');
        }
        if (list == 'OnOff'){
            const On = document.getElementById('on-scan');

            On.style.backgroundColor = 'transparent';
            localStorage.setItem('scan', 'off');
            chrome.storage.local.set({'power' : 'OFF', 'status' : 'off', 'iframe' : 'null'});

            changeButtonColor();
            
            popupNotification('Turning off the CADS..', container, currentpage, 'wait');
        }
        if (list == 'ClearAll'){
            popupNotification('All Data has been cleared successfully..!', notificationSlot, 'setting', 'next');

            // Example: Call the function to clear everything except 'iframe' and 'userSettings'
            clearLocalStorageExcept([
                'power'
                , 'notification'
                , 'whiteON'
                , 'blackON'
                , 'default_user'
                , 'default_pass'
                , 'user'
                , 'account'
                , 'ColorCodeBackground'
                , 'ColorCodeButton'
                , 'ColorCodeText'
                , 'IconColor'
                , 'ColorCodeGraph'
                , 'ColorCodeDashboard'
                , 'IconColor'
                , 'NotificationColor'
            ]);
        }
        
    }
    chrome.storage.local.remove(['SecureForNow']);
}

function popupNotification(message, container, currentpage, whatNext){

    fulltext += "<div class='alertMessage'>";
    fulltext += "<div class='alertPopupBox'>";
    fulltext += "<div class='popupBox'>";
    fulltext += "<div class='titlePopup'>Notification</div>";
    fulltext += "<div class='para' id='messageHere'>" + message + "</div>";
    fulltext += "<div class='buttonLayout'>";
    if (currentpage == 'history'){
        fulltext += "<a href='../ui/history.html' class='ok' id='ok'><div>OK</div></a>";
    }
    if (currentpage == 'whitelist'){
        fulltext += "<a href='../ui/whitelist.html' class='ok' id='ok'><div>OK</div></a>";
    }
    if (currentpage == 'blacklist'){
        fulltext += "<a href='../ui/blacklist.html' class='ok' id='ok'><div>OK</div></a>";
    }
    if (currentpage == 'setting'){
        if (whatNext === 'wait'){
            fulltext += "<a href='../ui/setting.html' class='ok' id='ok'><div>OK</div></a>";
        }
        if (whatNext === 'next'){
            fulltext += "<a href='../ui/home.html' class='ok' id='ok'><div>OK</div></a>";
        }
    }
    if (currentpage == 'home'){
        fulltext += "<a href='../ui/home.html' class='ok' id='ok'><div>OK</div></a>";
    }
    
    fulltext += "</div></div></div></div>";

    container.innerHTML = fulltext;

    changeButtonColor();
}

function clearLocalStorageExcept(exceptions) {
    // Retrieve all storage items
    chrome.storage.local.get(null, (items) => {
        if (chrome.runtime.lastError) {
            console.error('Error retrieving local storage:', chrome.runtime.lastError);
            return;
        }

        // Create a new object with only the items you want to keep
        let itemsToKeep = {};
        for (let key in items) {
            if (exceptions.includes(key)) {
                itemsToKeep[key] = items[key]; // Keep these items
            }
        }

        // Clear everything
        chrome.storage.local.clear(() => {
            if (chrome.runtime.lastError) {
                console.error('Error clearing local storage:', chrome.runtime.lastError);
                return;
            }

            console.log('Local storage cleared successfully, except for:', exceptions);

            // Restore the items that should be kept
            chrome.storage.local.set(itemsToKeep, () => {
                if (chrome.runtime.lastError) {
                    console.error('Error restoring kept items:', chrome.runtime.lastError);
                } else {
                    console.log('Kept items restored successfully.');
                }
            });
        });
    });
}

