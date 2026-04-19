

const websiteUrlElement = document.getElementById('website-url');
const dateTimeBrowsedElement = document.getElementById('date-time-browsed');
const xfoHeaderElement = document.getElementById('xfo-header');
const cspHeaderElement = document.getElementById('csp-header');
const clickjackingStatusElement = document.getElementById('clickjacking-status');
const listStatusElement = document.getElementById('list-status');
const counter = document.getElementById('countermeasure');
const headersElement = document.getElementById('http-headers');
const iframeSourceElement = document.getElementById('iframe');
const iframeProofElement = document.getElementById('iframe-proof');
const iframeAlertElement = document.getElementById('no-iframe-alert');
const iframeMessageElement = document.getElementById('iframe-message');

// Fetch stored data from the extension

chrome.storage.local.get('poc', function(result) {

    // Display the website URL
    if (result.poc) {
        websiteUrlElement.innerHTML = result.poc;
        iframeSourceElement.innerHTML = `
            <h2>Visual Proof (Website Loaded in iFrame)</h2>
            <iframe id="iframe-proof" src="${result.poc}" sandbox='allow-scripts'></iframe>
            <div id="no-iframe-alert" class="alert" style="display: none;">This website does not allow embedding in an iframe (Clickjacking Protection Enabled).</div>
            <div id="iframe-message" class="message"></div>
        `;

        checkList(result.poc);

        let url = result.poc;
        chrome.storage.local.get([`${url}_headers`, `${url}_time`, `${url}_iframeSource`], function(evt){
            dateTimeBrowsedElement.innerHTML = evt[`${url}_time`];
            let headers = evt[`${url}_headers`];

            headersElement.innerText = '';

            xfoHeaderElement.innerHTML = `<a class="tooltip">Missing XFO Header<span class="tooltiptext">Vulnerable from Clikcjacking</span>`;
            cspHeaderElement.innerHTML = `<a class="tooltip">Missing CSP Header<span class="tooltiptext">Vulnerable to Clikcjacking</span>`;

            let xfo = 0;
            let csp = 0;

            for (let key in headers) {
                headersElement.innerText += `${key} : ${headers[key]}\n`;

                // From X-Frame-Options Key
                if (key.startsWith('x-frame-options')){
                    if (headers[key].toLowerCase().includes("sameorigin") || headers[key].toLowerCase().includes("deny")) {
                        xfoHeaderElement.innerHTML = `<a class="tooltip">${headers[key]}<span class="tooltiptext">Safe from Clikcjacking</span>`;
                        xfo = 1
                    }
                    if (headers[key].toLowerCase().includes("allow from")) {
                        xfoHeaderElement.innerHTML = `<a class="tooltip">${headers[key]}<span class="tooltiptext">Vulnerable to Clickjacking</span>`;
                    }
                }
                // From Content-Security-Policy Key
                if (key.startsWith('content-security-policy')){
                    // (CSP) frame-ancestor
                    if (headers[key].includes("frame-ancestor")){
                        cspHeaderElement.innerHTML = `<a class="tooltip">Frame-ancestors<span class="tooltiptext">Safe from Clikcjacking</span>`;
                        
                    }
                    else{
                        cspHeaderElement.innerHTML = `<a class="tooltip">Missing Frame-ancestors attribute`;
                    }
                }
            }

            if (xfo == 1 || csp == 1){
                clickjackingStatusElement.innerHTML = `<a class="tooltip">Safe<span class="tooltiptext">Safe from Clikcjacking</span>`;
                counter.innerText = 'Already Secure';
            }
            if (xfo == 0 && csp == 0){
                clickjackingStatusElement.innerHTML = `<a class="tooltip">Risk<span class="tooltiptext">Vulnerable to Clikcjacking</span>`;
                counter.innerText = 'Please implement " X-Frame-Options: SAMEORIGIN @ DENY " or " Content-Security-Policy : frame-ancestor \'self\' ".';
            }

            console.log(evt[`${url}_iframeSource`]);
            document.getElementById('iframe-source').innerHTML = evt[`${url}_iframeSource`];

            tooltipON();
        });
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

function checkList(url){
    url = extractDomain(url);

    chrome.storage.local.get(['whitelist', 'blacklist'], function(result) {
        let whitelist = result.whitelist;
        let blacklist = result.blacklist;

        let whitelistArray = [];
        let blacklistArray = [];

        if (whitelist){
            whitelistArray = whitelist.split('\n').map(item => item.trim());

            if (whitelistArray.includes(url)) {
                listStatusElement.innerHTML = 'Website is Whitelisted by User';
            }
            else {
                listStatusElement.innerHTML = 'Not in any whitelist or blacklist';
            }
        }
        if (blacklist){
            blacklistArray = blacklist.split('\n').map(item => item.trim());

            if (blacklistArray.includes(url)) {
                listStatusElement.innerHTML = 'Website is Blacklisted by User';
            }
            else {
                listStatusElement.innerHTML = 'Not in any whitelist or blacklist';
            }
        }
        else {
            listStatusElement.innerHTML = 'Not in any whitelist or blacklist';
        }
    });
}


document.getElementById('button').onclick = () => {
    window.print();
}