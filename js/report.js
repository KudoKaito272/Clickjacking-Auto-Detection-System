
const container = document.getElementById('fill-report');
let fulltext = '';

function createNoHistory(){
    fulltext = `
        <div class='no-error'>
            <div class='empty'><img src='' id='icon-error'></div>
            <div class='empty'><h2>No Report to be shown.</h2></div>
            <div class='empty'><p>You've never browse through any website while using this web extension.</p>
        </div>
    `;
    container.innerHTML = fulltext;
    changeIconColor();
}


chrome.storage.local.get(['collectURL', 'collectDomain'], function(result){
    let URLs = result.collectURL;
    let collectDomain = result.collectDomain;  

    if(URLs && collectDomain){

        let URLsArray = URLs.split('\n').map(item => item.trim());
        let domainsArray = collectDomain.split('\n').map(item => item.trim());

        let totalDomainsProcessed = 0;
        let totalDomainsToProcess = domainsArray.length;

        domainsArray.forEach((domain) => {
            let count = 0;

            URLsArray.forEach((website) => {
                let websiteDomain = extractDomain(website);

                if (domain === websiteDomain){

                    chrome.storage.local.get([`${website}_headers`], function(result){

                        if (count == 0){
                            container.innerHTML += '<div class="titleItem">' + domain + '</div>';
                            count += 1;
                        }

                        let headers = result[`${website}_headers`];
                
                        let sL = 0;
                        let sLevel = '';
                        let pushForward = '<div class="pushForward"><div>Type of Security Measurement:</div>';
                        let note = '<div id="Note"><div>Notes:</div>';
                        
                        for (let key in headers) {
                            // From X-Frame-Options Key
                            if (key.toLowerCase() == 'x-frame-options') {
                                if (headers[key].toLowerCase().includes('sameorigin')){
                                    pushForward += '<div>~ X-Frame-Options: <i>SAMEORIGIN</i></div>';
                                    sL += 1;
                                    note += '<div>This website is protected against clickjacking attacks by implementing the X-Frame-Options header (SAMEORIGIN).</div>';
                                }
                                if (headers[key].toLowerCase().includes('deny')){
                                    pushForward += '<div>~ X-Frame-Options: <i>DENY</i></div>';
                                    sL += 1;
                                    note += '<div>This website is protected against clickjacking attacks by implementing the X-Frame-Options header (DENY).</div>';
                                }
                            }

                            // From Content-Security-Policy Key
                            if (key.toLowerCase() === 'content-security-policy') {
                                // (CSP) frame-ancestor
                                if (headers[key].toLowerCase().includes('frame-ancestor')) {
                                    pushForward += '<div>~ Content-Security-Policy: <i>frame-ancestor</i></div>';
                                    sL += 1;
                                    note += '<div>This website is protected against clickjacking attacks by implementing the Content-Security-Policy (CSP) directive `frame-ancestors`.</div>';
                                }
                                // (CSP) sandbox
                                if (headers[key].toLowerCase().includes('sandbox')) {
                                    pushForward += '<div>~ Content-Security-Policy: <i>sandbox</i></div>';
                                    sL += 1;
                                    note += '<div>This website is protected against clickjacking attacks by implementing the Content-Security-Policy (CSP) `sandbox` directive.</div>';
                                }
                            }
                        }

                        if (sL > 0){
                            sLevel += '<div id="SecurityLevel">Security Level: <i>Secure</i></div><div id="Clickjacking">Clickjacking Vulnerability: <i>Secure</i></div>';
                        }
                        else {
                            sLevel += '<div id="SecurityLevel">Security Level: <i>Risk</i></div><div id="Clickjacking">Clickjacking Vulnerability: <i>Risk</i></div>';
                            pushForward += '<div><i>Non-Existence</i></div>';
                            note += '<div>This website does not implement any protections against clickjacking attacks. It is recommended to adopt security measures such as the X-Frame-Options header or Content-Security-Policy (CSP) directives like `frame-ancestors` to mitigate these vulnerabilities.</div>';
                        }

                        note += '</div>';
                        pushForward += '</div>';
                
                        if (sL > 0){
                            container.innerHTML += `
                            <div class="listItem" id='green' hidden>${website}</div>
                            <div class="detailsItem" id='green' hidden>
                                <div class="details">
                                    <div id"fullURL>Full URL: <a class="urlColor" href="${website}" target="_blank">${website}</a></div>
                                    ${website.startsWith('https://') ? '<div id="WebProtocols">Web Protocols: <i>HTTPS</i></div>' : '<div id="WebProtocols">Web Protocols: <i>HTTP</i></div>'}
                                    ${sLevel}
                                    ${pushForward}
                                    ${note}
                                </div>
                            </div>
                        `;
                        }
                        else{
                            container.innerHTML += `
                            <div class="listItem" id='red' hidden>${website}</div>
                            <div class="detailsItem" id='red' hidden>
                                <div class="details">
                                    <div id"fullURL>Full URL: <a class="urlColor" href="${website}" target="_blank">${website}</a></div>
                                    ${website.startsWith('https://') ? '<div id="WebProtocols">Web Protocols: <i>HTTPS</i></div>' : '<div id="WebProtocols">Web Protocols: <i>HTTP</i></div>'}
                                    ${sLevel}
                                    ${pushForward}
                                    ${note}
                                </div>
                            </div>
                        `;
                        }
                        

                        // Call last() once all domains are processed
                        if (totalDomainsProcessed == totalDomainsToProcess) {
                            last();
                            changeButtonColor();
                        }
                    });
                }
            });
            // Increment counter when a website is processed
            totalDomainsProcessed++;
        });
        document.getElementById('goSeeLogReport').style.display = 'flex';
    }
    else {
        document.getElementById('goSeeLogReport').style.display = 'none';
        createNoHistory();
    }
});


// Extract Domain from URL
function extractDomain(url) {
    let domain;
    // Remove protocol (http, https, etc.) by splitting at "://"
    if (url.indexOf("://") > -1) {
        domain = url.split('/')[2];
    } else {
        domain = url.split('/')[0];
    }
    // Remove port number if present (e.g., example.com:3000)
    domain = domain.split(':')[0];
    return domain.toLowerCase().trim();
}

// Get all title items
function last(){
    const titleItems = document.querySelectorAll('.titleItem');

    titleItems.forEach(titleItem => {
        titleItem.addEventListener('click', () => {

            // Get the next sibling of the clicked titleItem
            let nextElement = titleItem.nextElementSibling;

            // Iterate through siblings to find all listItems
            while (nextElement) {
                if (nextElement.classList.contains('listItem')) {
                    // Toggle the visibility of the current listItem
                    nextElement.hidden = !nextElement.hidden; // Show or hide the listItem
                    let theNext = nextElement.nextElementSibling;
                    if (nextElement.hidden){
                        theNext.hidden = true;
                    }
                } else if (nextElement.classList.contains('titleItem')) {
                    // Stop if we reach a detailsItem
                    break;
                }
                nextElement = nextElement.nextElementSibling; // Move to the next sibling
            }
        });
    });

    // Add click event listeners to all listItems
    const listItems = document.querySelectorAll('.listItem');
    listItems.forEach(listItem => {
        listItem.addEventListener('click', () => {
            const detailsItem = listItem.nextElementSibling; // The corresponding detailsItem
            if (detailsItem) {
                // Toggle the visibility of the detailsItem
                detailsItem.hidden = !detailsItem.hidden;
            }
        });
    });
}
