
// Power ON/OFF Setting
try {
    const notificationSlot = document.getElementById('notificationSlot');

    const On = document.getElementById('on-scan');
    const Off = document.getElementById('off-scan');

    let scan = 'on';
    // localStorage.clear('n');
    chrome.storage.local.get('power', function(result){
        if(result.power == 'ON'){
            localStorage.setItem('scan', 'on');
        }
        else{
            localStorage.setItem('scan', 'off');
        }
    });

    if (localStorage.getItem('scan') == 'on'){
        Off.style.backgroundColor = 'transparent';
        scan = localStorage.getItem('scan');
    }
    if (localStorage.getItem('scan') == 'off'){
        On.style.backgroundColor = 'transparent';
        scan = localStorage.getItem('scan');
    }

    On.onclick = () => {
        if(scan == 'off'){
            scan = 'on';
            Off.style.backgroundColor = 'transparent';
            localStorage.setItem('scan', 'on');
            chrome.storage.local.set({'power' : 'ON', 'status' : 'on', 'iframe' : 'null'});
        }
        changeButtonColor();
    }

    Off.onclick = () => {
        if(scan == 'on'){
            chrome.storage.local.set({ 'action' : 'OnOff' });
            askForPassword(notificationSlot, null, 'OnOff', 'setting');
        }
        
    }

}
catch(e){
    console.log(e);
}

// Notification Setting
try {
    const max = document.getElementById('max-noti');
    const min = document.getElementById('min-noti');

    let n = 'max';
    if (localStorage.getItem('n') == 'max'){
        max.style.backgroundColor = 'blueviolet';
        min.style.backgroundColor = 'transparent';
        n = localStorage.getItem('n');
    }
    if (localStorage.getItem('n') == 'min'){
        max.style.backgroundColor = 'transparent';
        min.style.backgroundColor = 'blueviolet';
        n = localStorage.getItem('n');
    }
    if(!localStorage.getItem('n') || localStorage.getItem('n') == ''){
        localStorage.setItem('n', n);
    }

    max.onclick = () => {
        if(n == 'min'){
            n = 'max';
            max.style.backgroundColor = 'blueviolet';
            min.style.backgroundColor = 'transparent';
            localStorage.setItem('n', n);
            chrome.storage.local.set({ 'notification' : 'maximize' });
        }
        changeButtonColor();
    }

    min.onclick = () => {
        if(n == 'max'){
            n = 'min';
            max.style.backgroundColor = 'transparent';
            min.style.backgroundColor = 'blueviolet';
            localStorage.setItem('n', n);
            chrome.storage.local.set({ 'notification' : 'minimize' });
        }
        changeButtonColor();
    }

}
catch(e){
    console.log(e);
}


// Sensitivity Setting 
// try {
//     const safe = document.getElementById('sw-1');
//     const caution = document.getElementById('sw-2');
//     const risk = document.getElementById('sw-3');

//     let s = 0;
//     let c = 0;
//     let r = 0;

//     // Safe
//     if (localStorage.getItem('s') == null){
//         localStorage.setItem('s', 0);
//         safe.checked = true;
//         // document.getElementById('slider-text-1').style.backgroundColor = 'blueviolet';
//     }
//     else{
//         if (localStorage.getItem('s') == 0){
//             safe.checked = true;
//             document.getElementById('slider-text-1').innerHTML = "On";
//             // document.getElementById('slider-text-1').style.backgroundColor = 'blueviolet';
//         }
//         if (localStorage.getItem('s') == 1){
//             safe.checked = false;
//             document.getElementById('slider-text-1').innerHTML = "Off";
//             document.getElementById('slider-text-1').style.backgroundColor = 'rgb(255, 255, 255, 0.5)';
//         }
//     }
    
//     s = localStorage.getItem('s');

//     safe.onclick = () => {
//         if(s == 1){
//             s -= 1
//             document.getElementById('slider-text-1').innerHTML = "On";
//             // document.getElementById('slider-text-1').style.backgroundColor = 'blueviolet';
//         }
//         else{
//             s += 1
//             document.getElementById('slider-text-1').innerHTML = "Off";
//             document.getElementById('slider-text-1').style.backgroundColor = 'rgb(255, 255, 255, 0.5)';
//         }
//         localStorage.setItem('s',s);

//         changeButtonColor();
//     }

//     // Cautions
//     if (localStorage.getItem('c') == null){
//         localStorage.setItem('c', 0);
//         caution.checked = true;
//         // document.getElementById('slider-text-2').style.backgroundColor = 'blueviolet';
//     }
//     else{
//         if (localStorage.getItem('c') == 0){
//             caution.checked = true;
//             document.getElementById('slider-text-2').innerHTML = "On";
//             // document.getElementById('slider-text-2').style.backgroundColor = 'blueviolet';
//         }
//         if (localStorage.getItem('c') == 1){
//             caution.checked = false;
//             document.getElementById('slider-text-2').innerHTML = "Off";
//             document.getElementById('slider-text-2').style.backgroundColor = 'rgb(255, 255, 255, 0.5)';
//         }
//     }
    
//     c = localStorage.getItem('c');

//     caution.onclick = () => {
//         if(c == 1){
//             c -= 1
//             document.getElementById('slider-text-2').innerHTML = "On";
//             // document.getElementById('slider-text-2').style.backgroundColor = 'blueviolet';
//         }
//         else{
//             c += 1
//             document.getElementById('slider-text-2').innerHTML = "Off";
//             document.getElementById('slider-text-2').style.backgroundColor = 'rgb(255, 255, 255, 0.5)';
//         }
//         localStorage.setItem('c',c);
        
//         changeButtonColor();
//     }

//     // Risk
//     if (localStorage.getItem('r') == null){
//         localStorage.setItem('r', 0);
//         risk.checked = true;
//         // document.getElementById('slider-text-3').style.backgroundColor = 'blueviolet';
//     }
//     else{
//         if (localStorage.getItem('r') == 0){
//             risk.checked = true;
//             document.getElementById('slider-text-3').innerHTML = "On";
//             // document.getElementById('slider-text-3').style.backgroundColor = 'blueviolet';
//         }
//         if (localStorage.getItem('r') == 1){
//             risk.checked = false;
//             document.getElementById('slider-text-3').innerHTML = "Off";
//             document.getElementById('slider-text-3').style.backgroundColor = 'rgb(255, 255, 255, 0.5)';
//         }
//     }
    
//     r = localStorage.getItem('r');

//     risk.onclick = () => {
//         if(r == 1){
//             r -= 1
//             document.getElementById('slider-text-3').innerHTML = "On";
//             // document.getElementById('slider-text-3').style.backgroundColor = 'blueviolet';
//         }
//         else{
//             r += 1
//             document.getElementById('slider-text-3').innerHTML = "Off";
//             document.getElementById('slider-text-3').style.backgroundColor = 'rgb(255, 255, 255, 0.5)';
//         }
//         localStorage.setItem('r',r);
        
//         changeButtonColor();
//     }
    
// }
// catch (e){
//     console.log(e);
// }




// Dark Mode Theme button function
// try{
//     const LightMode = document.getElementById('light');
//     const DarkMode = document.getElementById('dark');

//     let i = 'dark';
//     // localStorage.clear('i');
//     if (localStorage.getItem('i') == 'light'){
//         LightMode.style.backgroundColor = 'blueviolet';
//         DarkMode.style.backgroundColor = 'transparent';
//         i = localStorage.getItem('i');
//     }
//     if (localStorage.getItem('i') == 'dark'){
//         LightMode.style.backgroundColor = 'transparent';
//         DarkMode.style.backgroundColor = 'blueviolet';
//         i = localStorage.getItem('i');
//     }

//     LightMode.onclick = () => {
//         if(i == 'dark'){
//             i = 'light';
//             LightMode.style.backgroundColor = 'blueviolet';
//             DarkMode.style.backgroundColor = 'transparent';
//             localStorage.setItem('i',i);
//             page_change();
//         }
//     }

//     DarkMode.onclick = () => {
//         if(i == 'light'){
//             i = 'dark';
//             LightMode.style.backgroundColor = 'transparent';
//             DarkMode.style.backgroundColor = 'blueviolet';
//             localStorage.setItem('i',i);
//             page_change();
//         }
//     }
// }
// catch(e){
//     console.log(e);
//     localStorage.setItem('i', 'dark');
// }
// finally {
//     page_change();
// }

// Theme Color
// try{
//     const purple = document.getElementById('purple');
//     const blue = document.getElementById('blue');
//     const gold = document.getElementById('gold');

//     let circle = document.getElementsByClassName('circle');

//     // localStorage.clear('i');
//     if (localStorage.getItem('i') == 'purple'){
//         circle[0].style.border = "1px solid rgb(50, 0, 100)";
//     }
//     if (localStorage.getItem('i') == 'blue'){
//         circle[1].style.border = "1px solid rgb(0, 60, 128)";
//     }
//     if (localStorage.getItem('i') == 'gold'){
//         circle[1].style.border = "1px solid rgb(128, 117, 0)";
//     }

//     purple.onclick = () => {
//         circle[0].style.border = "1px solid rgb(50, 0, 100)";
//         localStorage.setItem('i','purple');
//         page_change();
//         changeButtonColor();
//     }

//     blue.onclick = () => {
//         circle[1].style.border = "1px solid rgb(0, 60, 128)";
//         localStorage.setItem('i','blue');
//         page_change();
//         changeButtonColor();
//     }

//     gold.onclick = () => {
//         circle[1].style.border = "1px solid rgb(128, 117, 0)";
//         localStorage.setItem('i','gold');
//         page_change();
//         changeButtonColor();
//     }

// }
// catch(e){
//     // localStorage.setItem('i', 'purple');
//     page_change();
//     changeButtonColor();
// }
// finally{
//     page_change();
//     changeButtonColor();
// }
function checkColorCode(color){
    if (!color.startsWith('#')){
        color = "#" + color;
    }

    return color;
}


try{
    const notificationSlot = document.getElementById('notificationSlot');

    let ChangeColorCodeBackground = document.getElementById('color-code-click-background');
    let ChangeColorCodeButton = document.getElementById('color-code-click-button');
    let ChangeColorCodeText = document.getElementById('color-code-click-text');
    let ChangeIconColor = document.querySelectorAll('.icon-option');
    let ChangeColorCodeDashboard = document.getElementById('color-code-click-dashboard');
    let ChangeColorCodeGraph = document.getElementById('color-code-click-graph');
    let ChangeNotification = document.querySelectorAll('.notification-option');
    let Brightness = document.getElementById('color-code-click-brightness');

    // Regular expression to validate hex color codes
    const hexColorRegex = /^#([0-9A-F]{3}){1,2}$/i;

    ChangeColorCodeBackground.onclick = () => {
        loadingNow(1000);
        let Color = checkColorCode(document.getElementById('color-code-background').value);
        
        if (Color != ""){
            if (hexColorRegex.test(Color)) {
                chrome.storage.local.set({'ColorCodeBackground' : Color});
                setTimeout(function() {
                    popupNotification('Change Background Color Code..', notificationSlot, 'setting', 'wait');
                },1000);
            } 
            else {
                setTimeout(function() {
                    popupNotification('Invalid Color Code..', notificationSlot, 'setting', 'wait');
                },1000);
            }
        }
    }

    ChangeColorCodeButton.onclick = () => {
        loadingNow(1000);
        let Color = checkColorCode(document.getElementById('color-code-button').value);
        
        if (Color != ""){
            if (hexColorRegex.test(Color)) {
                chrome.storage.local.set({'ColorCodeButton' : Color});
                setTimeout(function() {
                    popupNotification('Change Button Color Code..', notificationSlot, 'setting', 'wait');
                },1000);
            } 
            else {
                setTimeout(function() {
                    popupNotification('Invalid Color Code..', notificationSlot, 'setting', 'wait');
                },1000);
            }
        }
    }

    ChangeColorCodeText.onclick = () => {
        loadingNow(1000);
        let Color = checkColorCode(document.getElementById('color-code-text').value);
        
        if (Color != ""){
            if (hexColorRegex.test(Color)) {
                chrome.storage.local.set({'ColorCodeText' : Color});
                setTimeout(function() {
                    popupNotification('Change Text Color Code..', notificationSlot, 'setting', 'wait');
                },1000);
            } 
            else {
                setTimeout(function() {
                    popupNotification('Invalid Color Code..', notificationSlot, 'setting', 'wait');
                },1000);
            }
        }
    }

    ChangeIconColor.forEach(button => {
        button.addEventListener('click', function() {
            loadingNow(1000);

            if (this.id === 'icon-black') {
                chrome.storage.local.set({'IconColor' : 'Black'});
            } 
            if (this.id === 'icon-white') {
                chrome.storage.local.set({'IconColor' : 'White'});
            }
            setTimeout(function() {
                popupNotification('Icon Color has been changed..', notificationSlot, 'setting', 'wait');
            },1000);
        });
    });

    ChangeColorCodeDashboard.onclick = () => {
        loadingNow(1000);
        let Color = checkColorCode(document.getElementById('color-code-dashboard').value);
        
        if (Color != ""){
            if (hexColorRegex.test(Color)) {
                chrome.storage.local.set({'ColorCodeDashboard' : Color});
                setTimeout(function() {
                    popupNotification('Change Dashboard Color Code..', notificationSlot, 'setting', 'wait');
                },1000);
            } 
            else {
                setTimeout(function() {
                    popupNotification('Invalid Color Code..', notificationSlot, 'setting', 'wait');
                },1000);
            }
        }
    }

    ChangeColorCodeGraph.onclick = () => {
        loadingNow(1000);
        let Color = checkColorCode(document.getElementById('color-code-graph').value);
        
        if (Color != ""){
            if (hexColorRegex.test(Color)) {
                chrome.storage.local.set({'ColorCodeGraph' : Color});
                setTimeout(function() {
                    popupNotification('Change Graph Color Code..', notificationSlot, 'setting', 'wait');
                },1000);
            } 
            else {
                setTimeout(function() {
                    popupNotification('Invalid Color Code..', notificationSlot, 'setting', 'wait');
                },1000);
            }
        }
    }

    ChangeNotification.forEach(button => {
        button.addEventListener('click', function() {
            loadingNow(1000);

            if (this.id === 'notification-black') {
                chrome.storage.local.set({'NotificationColor' : 'Black'});
            } 
            if (this.id === 'notification-white') {
                chrome.storage.local.set({'NotificationColor' : 'White'});
            }
            setTimeout(function() {
                popupNotification('Notification Color has been changed..', notificationSlot, 'setting', 'wait');
            },1000);
        });
    });

    Brightness.onclick = () => {
        loadingNow(1000);
        let Rate = document.getElementById('brightness').value;

        if (Rate != ""){
            try {
                // Parse the value as a float
                if (!isNaN(parseFloat(Rate))) {
                    if (parseFloat(Rate) > 100){
                        Rate = 100;
                    }
                    let brightness = (parseFloat(Rate)/100).toFixed(2);
                    localStorage.setItem('Brightness', brightness);
                    setTimeout(function() {
                        popupNotification('Background dimness has been changed to ' + Rate + "%", notificationSlot, 'setting', 'wait');
                    }, 1000);
                } 
                else {
                    setTimeout(function() {
                        popupNotification('Invalid inputs. Please enter a numeric value.', notificationSlot, 'setting', 'wait');
                    }, 1000);
                }
            } 
            catch(e) {
                setTimeout(function() {
                    popupNotification('Please put a numbers only.', notificationSlot, 'setting', 'wait');
                }, 1000);
            }
        }
    }
}
catch(e){
    // page_change();
    changeButtonColor();
    changeTextColor();
    changeIconColor();
    changeBackgroundColor();
    changeGraphColor();
    changeWallpaper();
    changeDashboardColor();
}
finally{
    // page_change();
    changeButtonColor();
    changeTextColor();
    changeIconColor();
    changeBackgroundColor();
    changeGraphColor();
    changeWallpaper();
    changeDashboardColor();
}


// Turn ON/OFF for whitelist and blacklist Setting
try {
    const notificationSlot = document.getElementById('notificationSlot');

    // Whitelist
    const buttonWhitelist = document.getElementById('sw-4');
    const whitelistON = document.getElementById('slider-text-4');
    let ON_OFF_white = 'on';

    chrome.storage.local.get('whiteON', function(result){
        if(result.whiteON == 'OFF'){
            localStorage.setItem('whiteOn', 'off');
        }
        else{
            localStorage.setItem('whiteOn', 'on');
        }
    });

    if (localStorage.getItem('whiteOn') == 'on'){
        buttonWhitelist.checked = true;
        whitelistON.innerHTML = "enable";
        ON_OFF_white = localStorage.getItem('whiteOn');
    }
    if (localStorage.getItem('whiteOn') == 'off'){
        buttonWhitelist.checked = false;
        whitelistON.innerHTML = "disable";
        ON_OFF_white = localStorage.getItem('whiteOn');
    }

    buttonWhitelist.onclick = () => {
        if(ON_OFF_white == 'off'){
            ON_OFF_white = 'on';
            buttonWhitelist.checked = true;
            whitelistON.innerHTML = "enable";
            chrome.storage.local.set({ 'whiteON' : 'ON' });
            localStorage.setItem('whiteOn', ON_OFF_white);
        }
        else{
            // chrome.storage.local.set({ 'action' : 'whiteON' });
            askForPassword(notificationSlot, null, 'whiteON', 'setting');
        }

        changeButtonColor();
        chrome.storage.local.remove(['SecureForNow', 'theURL']);
    }

}
catch(e){
    console.log(e);
}

try{
    const notificationSlot = document.getElementById('notificationSlot');

    // Blacklist
    const buttonBlacklist = document.getElementById('sw-5');
    const blacklistON = document.getElementById('slider-text-5');
    let ON_OFF_black = 'on';

    chrome.storage.local.get('blackON', function(result){
        if(result.blackON == 'OFF'){
            localStorage.setItem('blackOn', 'off');
        }
        else{
            localStorage.setItem('blackOn', 'on');
        }
    });

    ON_OFF_black = localStorage.getItem('blackOn');

    if (ON_OFF_black == 'on'){
        buttonBlacklist.checked = true;
        blacklistON.innerHTML = "enable";
    }
    if (ON_OFF_black == 'off'){
        buttonBlacklist.checked = false;
        blacklistON.innerHTML = "disable";
    }

    buttonBlacklist.onclick = () => {
        if(ON_OFF_black == 'off'){
            ON_OFF_black = 'on';
            buttonBlacklist.checked = true;
            blacklistON.innerHTML = "enable";
            chrome.storage.local.set({ 'blackON' : 'ON' });
            localStorage.setItem('blackOn', ON_OFF_black);
        }
        else{
            // chrome.storage.local.set({ 'action' : 'blackON' });
            askForPassword(notificationSlot, null, 'blackON', 'setting');
        }

        changeButtonColor();
        chrome.storage.local.remove(['SecureForNow', 'theURL']);
    }

}
catch(e){
    console.log(e);
}

// Clear All Data
try {
    const clearAll = document.getElementById('clearAll');
    const notificationSlot = document.getElementById('notificationSlot');

    clearAll.onclick = () => {
        chrome.storage.local.set({ 'action' : 'clear' });
        
        // chrome.storage.local.remove(['TotalBrowse', 'SafeBrowse', 'iframe', 'collectDomain']);
        chrome.storage.local.get('collectDomain', function(result){
            if(result.collectDomain){
                loadingNow(1500);
                setTimeout(function() {
                    askForPassword(notificationSlot, null, 'ClearAll', 'setting');
                },1000);
            }
            else{
                loadingNow(1000);
                setTimeout(function() {
                    popupNotification('All Data has already been cleared', notificationSlot, 'setting', 'wait');
                },1000);
            }
        });
        
    }
}
catch(e){
    console.log(e);
}

// Log Out / Sign Out
try {
    const notificationSlot = document.getElementById('notificationSlot');
    const logout = document.getElementById('logout');

    logout.onclick = () => {
        loadingNow(3000);

        setTimeout(function() {
            popupNotification("You've successfully Log Out...", notificationSlot, 'setting', 'next');
        },2000);

        // localStorage.removeItem('account');
        // localStorage.removeItem('user');
        // localStorage.removeItem('profileImage');
        // chrome.storage.local.remove(['account'], function() {
        //     console.log('Specified items have been removed.');
        // });
        // chrome.storage.local.set({ 'power' : 'OFF' });
        // chrome.storage.local.set({'status' : 'off'});
        // chrome.storage.local.set({ 'notification' : 'maximize' });

        localStorage.clear();
        chrome.storage.local.clear();
        // chrome.storage.local.set({ 'otpCode' : 'test' });
    }
}
catch(e){
    console.log(e);
}

try {
    const notificationSlot = document.getElementById('notificationSlot');

    const clearWallpaper = document.getElementById('clearWallpaper');
    const dropArea = document.getElementById('input-image');
    const fileInput = document.getElementById('fileInput');

    const imagePreview = document.getElementById('imagePreview');

    clearWallpaper.onclick = () => {
        loadingNow(700);

        imagePreview.textContent = 'No Image Selected';
        imagePreview.style.backgroundImage = '';

        if (localStorage.getItem('wallpaper') !== 'no'){
            localStorage.setItem('wallpaper', 'no');
            
            setTimeout(function(){
                popupNotification("Wallpaper Removed..", notificationSlot, 'setting', 'wait');
            },1000);
        }
        else {
            setTimeout(function(){
                popupNotification("No Wallpaper to be removed..", notificationSlot, 'setting', 'wait');
            },1000);
        }
        
    }

    // Prevent default behaviors (prevent file from being opened)
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        dropArea.addEventListener(eventName, preventDefaults, false);
    });

    // Highlight drop area when item is dragged over it
    ['dragenter', 'dragover'].forEach(eventName => {
        dropArea.addEventListener(eventName, highlight, false);
    });

    // Remove highlight when item is dragged away
    ['dragleave', 'drop'].forEach(eventName => {
        dropArea.addEventListener(eventName, unhighlight, false);
    });

    // Handle dropped files
    dropArea.addEventListener('drop', handleDrop, false);

    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    function highlight() {
        dropArea.classList.add('hover');
    }

    function unhighlight() {
        dropArea.classList.remove('hover');
    }

    function handleDrop(e) {
        const dt = e.dataTransfer;
        const files = dt.files;
        handleFiles(files);
    }

    // This function will handle files for both drag-and-drop and input selection
    function handleFiles(files) {
        const file = files[0];

        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = function(event) {
                localStorage.setItem('wallpaper',event.target.result)
                changeWallpaper();
                popupNotification("Uploading Wallpaper..", notificationSlot, 'setting', 'wait');
            };
            reader.readAsDataURL(file);
        } else {
            alert("Please select a valid image file.");
        }
    }

    // Handle file selection and load image
    fileInput.addEventListener('change', (event) => {
        const file = event.target.files[0];

        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = function(event) {
                localStorage.setItem('wallpaper',event.target.result)
                changeWallpaper();
                popupNotification("Uploading Wallpaper..", notificationSlot, 'setting', 'wait');
            };

            // Read the selected image as a data URL
            reader.readAsDataURL(file);
        } 
        else {
            alert("Please select a valid image file.");
            imagePreview.textContent = 'No Image Selected'; // Reset if not valid
            imagePreview.style.backgroundImage = ''; // Clear background
        }
    });
}
catch(e){
    console.log(e);
}
