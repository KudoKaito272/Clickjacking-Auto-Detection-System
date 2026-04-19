
function changeWallpaper(type){
    let wallpaper = localStorage.getItem('wallpaper');
    let rate = 0.55;

    if (localStorage.getItem('Brightness') && localStorage.getItem('Brightness') !== ''){
        rate = localStorage.getItem('Brightness');
    }
    else {
        localStorage.setItem('Brightness', 0.55);
    }

    let rate_percent = (rate * 100).toFixed(0);

    try {
        chrome.storage.local.get('ColorCodeBackground', function(result){
            let ColorCode = 'rgb(27, 27, 27, 0.55)';
            if (result.ColorCodeBackground) {
                ColorCode = hexToRgb(result.ColorCodeBackground, rate);
            }
    
            if (wallpaper != null){
                if (wallpaper == 'no'){
                    // Wallpaper Changed
                    document.getElementById('wallpaper').style.backgroundImage = `linear-gradient(to top, ${ColorCode}100%, ${ColorCode}100%), url()`;
                    changeBackgroundColor();
        
                    // Setting Section
                    try {
                        document.getElementById('imagePreview').textContent = 'No Image Selected';
                        document.getElementById('imagePreview').style.backgroundImage = '';
                        document.getElementById('brightness').placeholder = `${rate_percent}%`;
                    }
                    catch(e) {
                        console.log("Just not this page...");
                    }
                }
                else{
                    // Wallpaper Changed
                    document.getElementById('wallpaper').style.backgroundImage = `linear-gradient(to top, ${ColorCode}100%, ${ColorCode}100%), url('${wallpaper}')`;
                    changeBackgroundColor();
        
                    // Setting Section
                    try {
                        document.getElementById('imagePreview').textContent = '';
                        document.getElementById('imagePreview').style.backgroundImage = `url('${wallpaper}')`;
                        document.getElementById('brightness').placeholder = `${rate_percent}%`;
                    }
                    catch(e) {
                        console.log("Just not this page...");
                    }
                }
                
            }
            else{
                // Wallpaper Changed
                document.getElementById('wallpaper').style.backgroundImage = `linear-gradient(to top, ${ColorCode}100%, ${ColorCode}100%), url('../images/default.jpg')`;
                changeBackgroundColor();
        
                // Setting Section
                try {
                    document.getElementById('imagePreview').textContent = '';
                    document.getElementById('imagePreview').style.backgroundImage = `url('../images/default.jpg')`;
                    document.getElementById('brightness').placeholder = `${rate_percent}%`;
                }
                catch(e) {
                    console.log("Just not this page...");
                }
            }
        });
    }
    catch (e){
        console.log('Just happen to clear storage..');
    }
    
    

    if (type == 'profile'){
        let profile = localStorage.getItem('profileImage');

        

        if(profile){
            document.getElementById('profilePreview').textContent = '';
            document.getElementById('profilePreview').style.backgroundImage = `url('${profile}')`;

        }
        else{
            // document.getElementById('profilePreview').textContent = 'No Image Selected';d
            document.getElementById('profilePreview').style.backgroundImage = '';
        }
        
    }

    if (type == 'backgroundProfile'){
        let background = localStorage.getItem('backgroundProfileImage');

        if(background){
            document.getElementById('backgroundProfile').style.backgroundImage = `url('${background}')`;

        }
        else{
            document.getElementById('backgroundProfile').style.backgroundImage = '';
        }
        
    }
}

// Background Color Navigation
function changeBackgroundColor(){
    chrome.storage.local.get('ColorCodeBackground', function(result){
        let ColorCode = result.ColorCodeBackground;

        if (!ColorCode){
            chrome.storage.local.set({'ColorCodeBackground' : '#1b1b1b'});
        }

        document.getElementById('nav-opt').style.backgroundColor = `${ColorCode}f2`;
        document.getElementById('wallpaper').style.backgroundColor = ColorCode;

        // Home Section
        try {
            document.getElementById('details-dashboard').style.backgroundColor = `${ColorCode}`;
        }
        catch(e){
            console.log("Just not this page...");
        }

        // Setting Section
        try {
            document.getElementById('color-code-background').placeholder = ColorCode;
        }
        catch(e){
            console.log("Just not this page...");
        }
    });
}

// Text Color
function changeTextColor(){
    chrome.storage.local.get('ColorCodeText', function(result){
        let ColorCode = result.ColorCodeText;

        if (!ColorCode){
            chrome.storage.local.set({'ColorCodeText' : '#ffffff'});
        }

        let name = document.getElementsByClassName('name');

        // Navigation Panel
        for (let z = 0; z < name.length; z++) {
            name[z].style.color = ColorCode;
        }
        // Text Color
        document.getElementById('body').style.color = ColorCode;


        // History
        try {
            document.querySelectorAll('.the-button').forEach(button => {
                button.style.color = `${ColorCode}`;
            });
        }
        catch(e){
            console.log("Just not this page...");
        }


        // Setting Section
        try {
            document.getElementById('color-code-text').placeholder = ColorCode;
        }
        catch(e){
            console.log("Just not this page...");
        }
        // Theme Color Code
        try {
            document.querySelectorAll('.color-code').forEach(input => {
                input.style.setProperty('--placeholder-color', ColorCode);
                input.style.color = `${ColorCode}`;
            });
        }
        catch(e){
            console.log("Just not this page...");
        }
        try {
            document.querySelectorAll('.okchange').forEach(input => {
                input.style.border = `1px solid ${ColorCode}`;
            });
        }
        catch(e){
            console.log("Just not this page...");
        }
    });
}

// Button Color
function changeButtonColor(type){
    chrome.storage.local.get('ColorCodeButton', function(result){
        let ColorCode = result.ColorCodeButton;

        if (!ColorCode){
            chrome.storage.local.set({'ColorCodeButton' : '#8a2be2'});
        }
        
        // Home Section
        // Homepage Button
        try{
            const clickjack = document.getElementById('clickjack');
            const additional = document.getElementById('additional');
            const border = document.getElementsByClassName('coreVulnerabillity');
            
            additional.style.backgroundColor = 'transparent';

            clickjack.style.backgroundColor = `${ColorCode}b3`;
            for (let z = 0; z < border.length; z++) {
                border[z].style.border = `1px solid ${ColorCode}`;
            }

            if (type == 'add'){
                clickjack.style.backgroundColor = 'transparent';
                additional.style.backgroundColor = ColorCode;
            }
            if (type == 'click'){
                additional.style.backgroundColor = 'transparent';
                clickjack.style.backgroundColor = ColorCode;
            }
            
        }
        catch(e){
            console.log("Just not this page...");
        }


        // Dashboard Section


        // History Section
        try {
            const removeP = document.getElementById('removeP');
            const listDivs = document.getElementsByClassName('list');
            const whitelist = document.getElementsByClassName('whitelist');
            const blacklist = document.getElementsByClassName('blacklist');
            const remove = document.getElementsByClassName('remove');

            removeP.style.border = `1px solid ${ColorCode}`;
            for (let z = 0; z < listDivs.length; z++) {
                listDivs[z].style.borderBottom = `1px solid ${ColorCode}`;
                listDivs[z].style.borderLeft = `1px solid ${ColorCode}`;
                whitelist[z].style.borderBottom = `1px solid ${ColorCode}`;
                whitelist[z].style.borderLeft = `1px solid ${ColorCode}`;
                blacklist[z].style.borderBottom = `1px solid ${ColorCode}`;
                blacklist[z].style.borderLeft = `1px solid ${ColorCode}`;
                remove[z].style.borderBottom = `1px solid ${ColorCode}`;
                remove[z].style.borderLeft = `1px solid ${ColorCode}`;
            }
        }
        catch(e) {
            console.log("Just not this page...");
        }


        // Whitelist Section
        try {
            const removeP = document.getElementById('removeP');
            const listDivs = document.getElementsByClassName('list');
            const blacklist = document.getElementsByClassName('blacklist');
            const remove = document.getElementsByClassName('remove');

            removeP.style.border = `1px solid ${ColorCode}`;
            for (let z = 0; z < listDivs.length; z++) {
                listDivs[z].style.borderBottom = `1px solid ${ColorCode}`;
                listDivs[z].style.borderLeft = `1px solid ${ColorCode}`;
                blacklist[z].style.borderBottom = `1px solid ${ColorCode}`;
                blacklist[z].style.borderLeft = `1px solid ${ColorCode}`;
                remove[z].style.borderBottom = `1px solid ${ColorCode}`;
                remove[z].style.borderLeft = `1px solid ${ColorCode}`;
            }
        }
        catch(e) {
            console.log("Just not this page...");
        }


        // Blacklist Section
        try {
            const removeP = document.getElementById('removeP');
            const listDivs = document.getElementsByClassName('list');
            const whitelist = document.getElementsByClassName('whitelist');
            const remove = document.getElementsByClassName('remove');

            removeP.style.border = `1px solid ${ColorCode}`;
            for (let z = 0; z < listDivs.length; z++) {
                listDivs[z].style.borderBottom = `1px solid ${ColorCode}`;
                listDivs[z].style.borderLeft = `1px solid ${ColorCode}`;
                whitelist[z].style.borderBottom = `1px solid ${ColorCode}`;
                whitelist[z].style.borderLeft = `1px solid ${ColorCode}`;
                remove[z].style.borderBottom = `1px solid ${ColorCode}`;
                remove[z].style.borderLeft = `1px solid ${ColorCode}`;
            }
        }
        catch(e) {
            console.log("Just not this page...");
        }


        // Log Report Section
        try {
            document.querySelectorAll('.titleItem').forEach(list => {
                list.style.backgroundColor = `${ColorCode}80`;
            });
        }
        catch(e) {
            console.log("Just not this page...");
        }


        // Profile Section
        try {
            document.querySelectorAll('.profile-button').forEach((button, index) => {
                button.style.backgroundColor = `${ColorCode}f2`;
            });
        }
        catch(e) {
            console.log("Just not this page...");
        }


        // Setting Section
        try {
            document.getElementById('color-code-button').placeholder = ColorCode;
        }
        catch(e){
            console.log("Just not this page...");
        }
        // Scanning (On/Off) Button
        try{
            const On = document.getElementById('on-scan');
            const Off = document.getElementById('off-scan');
            const box = document.getElementsByClassName('box');

            // On
            if (localStorage.getItem('scan') == 'on'){
                On.style.backgroundColor = `${ColorCode}b3`;
            }
            // Off
            if (localStorage.getItem('scan') == 'off'){
                Off.style.backgroundColor = `${ColorCode}b3`;
            }
            for (let z = 0; z < box.length; z++) {
                box[z].style.border = `1px groove ${ColorCode}`;
            }
        }
        catch(e){
            console.log("Just not this page...");
        }
        //Notification Button
        try{
            const max = document.getElementById('max-noti');
            const min = document.getElementById('min-noti');
            const box = document.getElementsByClassName('box');

            if (localStorage.getItem('n') == 'max'){
                max.style.backgroundColor = `${ColorCode}b3`;
            }
            if (localStorage.getItem('n') == 'min'){
                min.style.backgroundColor = `${ColorCode}b3`;
            }
            for (let z = 0; z < box.length; z++) {
                box[z].style.border = `1px groove ${ColorCode}`;
            }
        }
        catch(e) {
            console.log("Just not this page...");
        }
        // Sensitivity Button
        try {
            // Safe
            if (localStorage.getItem('s') == null){
                document.getElementById('slider-text-1').style.backgroundColor = `${ColorCode}b3`;
            }
            else{
                if (localStorage.getItem('s') == 0){
                    document.getElementById('slider-text-1').style.backgroundColor = `${ColorCode}b3`;
                }
                if (localStorage.getItem('s') == 1){
                    document.getElementById('slider-text-1').style.backgroundColor = 'rgb(255, 255, 255, 0.5)';
                }
            }
            // Cautions
            if (localStorage.getItem('c') == null){
                document.getElementById('slider-text-2').style.backgroundColor = `${ColorCode}b3`;
            }
            else{
                if (localStorage.getItem('c') == 0){
                    document.getElementById('slider-text-2').style.backgroundColor = `${ColorCode}b3`;
                }
                if (localStorage.getItem('c') == 1){
                    document.getElementById('slider-text-2').style.backgroundColor = 'rgb(255, 255, 255, 0.5)';
                }
            }
            // Risk
            if (localStorage.getItem('r') == null){
                document.getElementById('slider-text-3').style.backgroundColor = `${ColorCode}b3`;
            }
            else{
                if (localStorage.getItem('r') == 0){
                    document.getElementById('slider-text-3').style.backgroundColor = `${ColorCode}b3`;
                }
                if (localStorage.getItem('r') == 1){
                    document.getElementById('slider-text-3').style.backgroundColor = 'rgb(255, 255, 255, 0.5)';
                }
            }
        }
        catch(e) {
            console.log("Just not this page...");
        }
        // Advance Setting Button
        try {
            if (localStorage.getItem('whiteOn') == 'on'){
                document.getElementById('slider-text-4').style.backgroundColor = `${ColorCode}b3`;
            }
            else{
                document.getElementById('slider-text-4').style.backgroundColor = 'rgb(255, 255, 255, 0.5)';
            }
            if (localStorage.getItem('blackOn') == 'on'){
                document.getElementById('slider-text-5').style.backgroundColor = `${ColorCode}b3`;
            }
            else{
                document.getElementById('slider-text-5').style.backgroundColor = 'rgb(255, 255, 255, 0.5)';
            }
        }
        catch(e) {
            console.log("Just not this page...");
        }
        // Clear All Data Button
        try {
            document.getElementById('clearAll').style.backgroundColor = `${ColorCode}b3`;
        }
        catch(e) {
            console.log("Just not this page...");
        }
        // Log Out Button
        try {
            document.getElementById('logout').style.backgroundColor = `${ColorCode}b3`;
        }
        catch(e) {
            console.log("Just not this page...");
        }


        // Notification Section
        try{
            const ProccedButton = document.getElementById('proceedButton');
            ProccedButton.style.backgroundColor = ColorCode;
        }
        catch(e){
            console.log("Just not this page...");
        }
    
        try{
            const okButton = document.getElementById('ok');
            okButton.style.backgroundColor = ColorCode;
        }
        catch(e){
            console.log("Just not this page...");
        }
    });
}

// Icon Color
function changeIconColor(tick, type){
    chrome.storage.local.get('IconColor', function(result){
        let Color = result.IconColor;

        if (!Color){
            chrome.storage.local.set({'IconColor' : 'White'});
        }

        let targetId = '';

        let icon = document.getElementsByClassName('icon');

        const WhiteIconSources = [
            "../images/dm-more.png",
            "../images/dm-home.png",
            "../images/dm-dashboard.png",
            "../images/dm-history.png",
            "../images/dm-whitelist.png",
            "../images/dm-blacklist.png",
            "../images/dm-report.png",
            "../images/dm-profile.png",
            "../images/dm-setting.png",
            "../images/dm-back.png"
        ];

        const BlackIconSources = [
            "../images/more.png",
            "../images/home.png",
            "../images/dashboard.png",
            "../images/history.png",
            "../images/whitelist.png",
            "../images/blacklist.png",
            "../images/report.png",
            "../images/profile.png",
            "../images/setting.png",
            "../images/back.png"
        ];
        if (Color == 'White'){
            for (let z = 0; z < icon.length && z < WhiteIconSources.length; z++) {
                icon[z].src = WhiteIconSources[z];
            }

            targetId = 'icon-white';
        }
        if (Color == 'Black'){
            for (let z = 0; z < icon.length && z < BlackIconSources.length; z++) {
                icon[z].src = BlackIconSources[z];
            }

            targetId = 'icon-black';
        }

        // Home Section
        try {
            if (Color == 'Black'){
                if (type == 'yes'){
                    tick.src = '../images/yes.png';
                }
                if (type == 'no'){
                    tick.src = '../images/no.png';
                }
                if (type == 'na'){
                    tick.src = '../images/na.png';
                }
            }
            if (Color == 'White'){
                if (type == 'yes'){
                    tick.src = '../images/dm-yes.png';
                }
                if (type == 'no'){
                    tick.src = '../images/dm-no.png';
                }
                if (type == 'na'){
                    tick.src = '../images/na.png';
                }
            }
            
        }
        catch(e) {
            console.log("Just not this page...");
        }


        // History Section
        try {
            const icon = document.getElementById('icon-history');

            if (Color == 'Black'){
                icon.src = '../images/empty.png';
            }
            if (Color == 'White'){
                icon.src = '../images/dm-empty.png';
            }
        }
        catch(e) {
            console.log("Just not this page...");
        }


        // Blacklist Section
        try {
            const icon = document.getElementById('icon-history');

            if (Color == 'Black'){
                icon.src = '../images/empty.png';
            }
            if (Color == 'White'){
                icon.src = '../images/dm-empty.png';
            }
        }
        catch(e) {
            console.log("Just not this page...");
        }
        

        // Whitelist
        try {
            const icon = document.getElementById('icon-history');

            if (Color == 'Black'){
                icon.src = '../images/empty.png';
            }
            if (Color == 'White'){
                icon.src = '../images/dm-empty.png';
            }
        }
        catch(e) {
            console.log("Just not this page...");
        }

        // Report Section
        try {
            const icon = document.getElementById('icon-error');

            if (Color == 'Black'){
                icon.src = '../images/empty.png';
            }
            if (Color == 'White'){
                icon.src = '../images/dm-empty.png';
            }
        }
        catch(e) {

        }

        // Profile Section
        try {
            const icon = document.getElementById('edit-icon');

            if (Color == 'Black'){
                icon.src = '../images/edit.png';
            }
            if (Color == 'White'){
                icon.src = '../images/dm-edit.png';
            }
        }
        catch(e) {

        }

        
        // Setting Section
        try{
            let ChangeIconColor = document.querySelectorAll('.icon-option');

            ChangeIconColor.forEach(button => {
                if (button.id == targetId){
                    chrome.storage.local.get('ColorCodeButton', function(result){
                        button.style.backgroundColor = `${result.ColorCodeButton}b3`;
                    });
                }
            });
        }
        catch(e){
            console.log("Just not this page...");
        }

    });
}

// Dashboard Color
function changeDashboardColor(){
    chrome.storage.local.get('ColorCodeDashboard', function(result){
        let ColorCode = result.ColorCodeDashboard;

        if (!ColorCode){
            chrome.storage.local.set({'ColorCodeDashboard' : '#2e2e3e'});
        }

        // Dashboard Section
        try {
            document.querySelector('.TotalBrowse').style.backgroundColor = ColorCode;
            document.querySelector('.TextInsideDonutChart').style.backgroundColor = ColorCode;
            document.getElementById('listWhite').style.backgroundColor = ColorCode;
            document.getElementById('listBlack').style.backgroundColor = ColorCode;
            document.querySelector('.mostVisitedGraph').style.backgroundColor = ColorCode; 
        }
        catch(e) {
            console.log("Just not this page...");
        }

        // Setting Section 
        try {
            document.getElementById('color-code-dashboard').placeholder = ColorCode;
        }
        catch(e){
            console.log("Just not this page...");
        }
    });
}

// Graph
function changeGraphColor(){
    chrome.storage.local.get('ColorCodeGraph', function(result){
        let ColorCode = result.ColorCodeGraph;

        if (!ColorCode){
            chrome.storage.local.set({'ColorCodeGraph' : '#8a2be2'});
        }

        // Dashboard Section
        try {
            // Apply background gradient to all bars
            const bars = document.getElementsByClassName('graph-style');
            for (let j = 0; j < bars.length; j++) {
                bars[j].style.background = `linear-gradient(to top, ${ColorCode}f2 10%, ${ColorCode} 90%)`;
            }
        }
        catch(e) {
            console.log("Just not this page...");
        }

        // Setting Section 
        try {
            document.getElementById('color-code-graph').placeholder = ColorCode;
        }
        catch(e){
            console.log("Just not this page...");
        }
    });
}

// Redirct Color
function changeNotificationPageColor(){
    chrome.storage.local.get('NotificationColor', function(result){
        let Color = result.NotificationColor;
        let targetId = '';

        if (Color){
            if (Color == 'White'){
                targetId = 'notification-white';
            }
            if (Color == 'Black'){
                targetId = 'notification-black';
            }
        }
        else{
            chrome.storage.local.set({'NotificationColor' : 'White'});
            targetId = 'notification-white';
        }
        
        // Setting Section
        try{
            let ChangeNotificationColor = document.querySelectorAll('.notification-option');

            ChangeNotificationColor.forEach(button => {
                if (button.id === targetId){
                    chrome.storage.local.get('ColorCodeButton', function(result){
                        button.style.backgroundColor = `${result.ColorCodeButton}b3`;
                    });
                }
            });
        }
        catch(e){
            console.log("Just not this page...");
        }

    });
}

function hexToRgb(hex, rate) {
    // Remove the hash at the start if it's there
    hex = hex.replace(/^#/, '');

    // Parse the red, green, and blue values
    let r = parseInt(hex.slice(0, 2), 16);
    let g = parseInt(hex.slice(2, 4), 16);
    let b = parseInt(hex.slice(4, 6), 16);

    return `rgb(${r}, ${g}, ${b}, ${rate})`; // Return in the format rgb(r, g, b)
}

changeWallpaper();
changeButtonColor();
changeTextColor();
changeIconColor();
changeBackgroundColor();
changeGraphColor();
changeWallpaper();
changeDashboardColor();
changeNotificationPageColor();

