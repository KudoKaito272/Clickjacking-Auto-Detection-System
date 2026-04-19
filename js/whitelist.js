
const container = document.getElementById('fill-whitelist');

chrome.storage.local.get('whitelist', function(result){
    let whitelist = result.whitelist;

    if(whitelist){
        let whitelistArray = whitelist.split('\n').map(item => item.trim()); 
        createHistoryList(whitelistArray);

    }
    else{
        createNoHistory();
    }
});

function createHistoryList(url){
    fulltext += "<div class='list-page'>";

    let c = 1;

    fulltext += "<div class='removeAll' id='removeAll'><p id='removeP'>Clear Whitelist</p></div>";
    
    for (i = 0; i < url.length; i++){
        fulltext += "<div class='list' id='list-" + c + "'>";

        fulltext += "<p class='the-list id='the-list-" + c + "'>" + url[i] + "</p>";

        fulltext += "<button class='the-button' id='scroll-below-" + c + "'>V</button>";

        fulltext += "</div>";

        fulltext += "<div class='hidden-list' id='list-" + c + "-opt' hidden>";

        fulltext += "<div id='blacklist-" + c + "' class='blacklist'>Blacklist this</div>";

        fulltext += "<div id='remove-" + c + "' class='remove'>Remove this</div>"

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
    const removeDivs = document.querySelectorAll('.remove');
    const blacklistDivs = document.querySelectorAll('.blacklist');
    const removeAll = document.querySelectorAll('#removeP');

    changeButtonColor();
    changeTextColor();

    // Add event listeners to all whitelist elements
    blacklistDivs.forEach(button => {

        button.addEventListener('click', function() {
            // insertList(this.id, 'black');
            askForPassword(container, this.id, 'black', 'whitelist');
        });
    });

    // Add event listeners to all blacklist elements
    removeDivs.forEach(button => {
        button.addEventListener('click', function() {
            // removedList(this.id, 'remove');
            askForPassword(container, this.id, 'remove', 'whitelist');
        });
    });

    removeAll.forEach(button => {
        button.addEventListener('click', function() {
            // insertList(this.id,'removeAll');
            askForPassword(container, null, null, 'whitelist');
        });
    });

}

function insertList(id, list){
    url = getURL(id, list);
    
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

function removedList(id, list){

    url = getURL(id, list);

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

function getURL(id, list){
    if (list === 'remove'){
        // Find the corresponding .the-list text for each button
        const listId = id.replace('remove-', 'list-'); // Get the list ID from whitelist ID
        const listText = document.querySelector(`#${listId} .the-list`).innerText; // Select the text
        console.log(listText); // Display the innerText
        return listText;
    }
    if (list === 'black'){
        // Find the corresponding .the-list text for each button
        const listId = id.replace('blacklist-', 'list-'); // Get the list ID from whitelist ID
        const listText = document.querySelector(`#${listId} .the-list`).innerText; // Select the text
        console.log(listText); // Display the innerText
        return listText;
    }
}


function createNoHistory(){
    fulltext += "<div class='no-history'>";
    fulltext += "<div class='empty'><img src='../images/dm-empty.png' id='icon-history'></div>" ;
    fulltext += "<div class='empty'><h2>You'll find your whitelists here.</h2></div>";
    fulltext += "<div class='empty'><p>You can see the unsafe pages that you've whitelisted here.</p></div>";
    fulltext += "</div>";

    container.innerHTML = fulltext;
    changeIconColor();
}
