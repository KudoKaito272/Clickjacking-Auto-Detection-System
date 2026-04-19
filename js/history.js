
const container = document.getElementById('fill-history');

chrome.storage.local.get(['RiskBrowse', 'collectDomain'], function(result) {
    let all = result.RiskBrowse;
    let domains = result.collectDomain;

    if (all && domains) {
        let RiskBrowseArray = all.split('\n').map(item => item.trim());
        let collectDomainArray = domains.split('\n').map(item => item.trim());
        let url = [];

        for (let i = 0; i < RiskBrowseArray.length; i++) {
            let domain = extractDomain(RiskBrowseArray[i]); // Extract domain once
            if (collectDomainArray.includes(domain)) {
                if (!url.includes(domain)){
                    url.push(domain);
                }
            }
        }

        createHistoryList(url); // Call this if there are matching domains
    } else {
        createNoHistory(); // Call this if either list is missing
    }
});

function createHistoryList(url){
    fulltext += "<div class='list-page'>";

    let c = 1;

    fulltext += "<div class='removeAll' id='removeAll'><p id='removeP' hidden>Delete All History</p></div>";
    
    for (i = 0; i < url.length; i++){
        fulltext += "<div class='list' id='list-" + c + "'>";

        fulltext += "<p class='the-list id='the-list-" + c + "'>" + url[i] + "</p>";

        fulltext += "<button class='the-button' id='scroll-below-" + c + "'>V</button>";

        fulltext += "</div>";

        fulltext += "<div class='hidden-list' id='list-" + c + "-opt' hidden>";

        fulltext += "<div id='whitelist-" + c + "' class='whitelist'>Whitelist this</div>";

        fulltext += "<div id='blacklist-" + c + "' class='blacklist'>Blacklist this</div>";

        fulltext += "<div id='remove-" + c + "' class='remove' hidden>Remove this</div>";

        fulltext += "</div>";

        c += 1;
    }

    fulltext += "</div>";

    container.innerHTML = fulltext;

    activatedList();

    activatedButton();
}

function activatedList(){
    // Select all buttons within the container
    const buttons = document.querySelectorAll('.the-button');

    // Add event listeners to all buttons
    buttons.forEach(button => {
        button.addEventListener('click', function() {
            // Get the ID from the button
            const buttonId = this.id;
            // const listId = buttonId.replace('scroll-below', 'list');
            const hiddenListId = buttonId.replace('scroll-below', 'list') + '-opt';

            // Select the related hidden list
            const hiddenList = document.querySelector(`#${hiddenListId}`);

            if (hiddenList) {
                // Toggle the visibility of the hidden list
                hiddenList.hidden = !hiddenList.hidden;
            }
        });
    });
}

function activatedButton(){
    // Select all elements with the class 'whitelist' and 'blacklist'
    const whitelistDivs = document.querySelectorAll('.whitelist');
    const blacklistDivs = document.querySelectorAll('.blacklist');
    const removeListDivs = document.querySelectorAll('.remove');
    const removeAll = document.querySelectorAll('#removeP');

    changeButtonColor();
    changeTextColor();

    // Add event listeners to all whitelist elements
    whitelistDivs.forEach(button => {
        button.addEventListener('click', function() {
            checkList('white', this.id);
            chrome.storage.local.remove(['SecureForNow']);
        });
    });

    // Add event listeners to all blacklist elements
    blacklistDivs.forEach(button => {
        button.addEventListener('click', function() {
            checkList('black', this.id);
            chrome.storage.local.remove(['SecureForNow']);
        });
    });

}

function checkList(type, id){

    url = getURL(id, type);

    if (type === 'white'){

        chrome.storage.local.get('blacklist', function(result) {
            // Get the Blacklist
            let blacklist = result.blacklist;
        
            // Check if blacklist is empty or not
            if(blacklist){
                // Convert blacklist string to an array by splitting on newline
                let blacklistArray = blacklist.split('\n').map(item => item.trim()); 
        
                // Check if the URL is already in the blacklist
                if (blacklistArray.includes(url)) {
                    askForPassword(container, id, type, 'history');
                }
                else{
                    chrome.storage.local.get('whitelist', function(result) {
                        // Get the whitelist
                        let whitelist = result.whitelist;
                    
                        // Check if whitelist is empty or not
                        if(whitelist){
                            // Convert whitelist string to an array by splitting on newline
                            let whitelistArray = whitelist.split('\n').map(item => item.trim()); 
                    
                            // Check if the URL is already in the whitelist
                            if (whitelistArray.includes(url)) {
                                popupNotification("This Website Domain is already inside Whitelist..", container, 'history');
                            }
                            else{
                                askForPassword(container, id, 'newWhite', 'history');
                            }
                        }
                        else{
                            askForPassword(container, id, 'newWhite', 'history');
                        }
                    });
                }
            }
            else{
                chrome.storage.local.get('whitelist', function(result) {
                    // Get the whitelist
                    let whitelist = result.whitelist;
                
                    // Check if whitelist is empty or not
                    if(whitelist){
                        // Convert whitelist string to an array by splitting on newline
                        let whitelistArray = whitelist.split('\n').map(item => item.trim()); 
                
                        // Check if the URL is already in the whitelist
                        if (whitelistArray.includes(url)) {
                            popupNotification("This Website Domain is already inside Whitelist..", container, 'history');
                        }
                        else{
                            askForPassword(container, id, 'newWhite', 'history');
                        }
                    }
                    else{
                        askForPassword(container, id, 'newWhite', 'history');
                    }
                });
            }
        });
    }

    if (type === 'black'){
        chrome.storage.local.get('whitelist', function(result) {
            // Get the whitelist
            let whitelist = result.whitelist;
        
            // Check if whitelist is empty or not
            if(whitelist){
                // Convert whitelist string to an array by splitting on newline
                let whitelistArray = whitelist.split('\n').map(item => item.trim()); 
        
                // Check if the URL is already in the whitelist
                if (whitelistArray.includes(url)) {
                    askForPassword(container, id, type, 'history');
                }
                else{
                    chrome.storage.local.get('blacklist', function(result) {
                        // Get the blacklist
                        let blacklist = result.blacklist;
                    
                        // Check if blacklist is empty or not
                        if(blacklist){
                            // Convert blacklist string to an array by splitting on newline
                            let blacklistArray = blacklist.split('\n').map(item => item.trim()); 
                    
                            // Check if the URL is already in the blacklist
                            if (blacklistArray.includes(url)) {
                                popupNotification("This Website Domain is already inside Blacklist..", container, 'history');
                            }
                            else{
                                askForPassword(container, id, 'newBlack', 'history');
                            }
                        }
                        else{
                            askForPassword(container, id, 'newBlack', 'history');
                        }
                    });
                }
            }
            else{
                chrome.storage.local.get('blacklist', function(result) {
                    // Get the blacklist
                    let blacklist = result.blacklist;
                
                    // Check if blacklist is empty or not
                    if(blacklist){
                        // Convert blacklist string to an array by splitting on newline
                        let blacklistArray = blacklist.split('\n').map(item => item.trim()); 
                
                        // Check if the URL is already in the blacklist
                        if (blacklistArray.includes(url)) {
                            popupNotification("This Website Domain is already inside Blacklist..", container, 'history');
                        }
                        else{
                            askForPassword(container, id, 'newBlack', 'history');
                        }
                    }
                    else{
                        askForPassword(container, id, 'newBlack', 'history');
                    }
                });
            }
        });
        
    }
}   

function insertList(id, list){

    url = getURL(id, list);

    if(list === 'white'){
        
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

        removedList(id, list);
    }
    
    if (list === 'black') {
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

        removedList(id, list);
    }
}

function removedList(id, list){

    url = getURL(id, list);

    if (list == 'white'){
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
    if (list === 'black'){
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

function getURL(id, list){
    if (list === 'white'){
        // Find the corresponding .the-list text for each button
        const listId = id.replace('whitelist-', 'list-'); // Get the list ID from whitelist ID
        const listText = document.querySelector(`#${listId} .the-list`).innerText; // Select the text
        console.log(listText); // Display the innerText
        return listText;
    }
    if (list === 'black'){
        // Find the corresponding .the-list text for each button
        const listId = id.replace('blacklist-', 'list-'); // Get the list ID from blacklist ID
        const listText = document.querySelector(`#${listId} .the-list`).innerText; // Select the text
        console.log(listText); // Display the innerText
        return listText;
    }
    if (list === 'remove'){
        // Find the corresponding .the-list text for each button
        const listId = id.replace('remove-', 'list-'); // Get the list ID from remove ID
        const listText = document.querySelector(`#${listId} .the-list`).innerText; // Select the text
        console.log(listText); // Display the innerText
        return listText;
    }
    
}

function createNoHistory(){
    fulltext += "<div class='no-history'>";
    fulltext += "<div class='empty'><img src='' id='icon-history'></div>";
    fulltext += "<div class='empty'><h2>You'll find your history here.</h2></div>";
    fulltext += "<div class='empty'><p>You can see the unsafe pages that you've visited here.</p></div>";
    fulltext += "</div>";

    container.innerHTML = fulltext;

    changeIconColor();
}

// Extract Domain from URL
function extractDomain(url) {
    let domain;
    if (url.indexOf("://") > -1) {
        domain = url.split('/')[2];
    } else {
        domain = url.split('/')[0];
    }
    return domain.split(':')[0].toLowerCase().trim();
}