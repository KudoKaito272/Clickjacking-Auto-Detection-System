
// Function to clear specific values from storage on page reload
window.onload = function() {
    // Clear specific storage items
    chrome.storage.local.remove(['start', 'end', 'level', 'domain'], function() {
        console.log('Cleared start, end, and level from storage on page reload.');
        // Optionally, you can call checkDatesReady here if you want to refresh the table right after clearing
        checkDatesReady();
        DomainFilter();
    });
};

const from = document.getElementById("dateFrom");
const to = document.getElementById("dateTo");
const select = document.getElementById('riskFilter');
const selectDomain = document.getElementById('domainFilter');
const row = document.getElementById('insert_log_table');
let full = '';
let domainFill = '';

function checkDatesReady() {
    chrome.storage.local.get(['collectURL', 'start', 'end', 'level', 'domain'], function(evt) {
        let urls = evt.collectURL;

        if (urls) {
            let urlsArray = urls.split('\n').map(item => item.trim()).filter(item => item);

            // Create a mapping of URLs to their stored timestamps
            let urlTimestampMap = {};

            const fetchUrlTimestamps = (url) => {
                return new Promise((resolve) => {
                    chrome.storage.local.get([`${url}_time`], function(result) {
                        let storedTimestamp = Date.parse(result[`${url}_time`]);
                        if (!isNaN(storedTimestamp)) {
                            urlTimestampMap[url] = storedTimestamp;
                        }
                        resolve();
                    });
                });
            };

            // Fetch timestamps for all URLs
            Promise.all(urlsArray.map(fetchUrlTimestamps)).then(() => {
                // Process timestamps if either start or end is present
                let startTimestamp = evt.start ? Date.parse(evt.start) : null;
                let endTimestamp = evt.end ? Date.parse(evt.end) : getCurrentDateTime();
                let level = evt.level || '--';
                let domain = evt.domain || '--';

                // Filter URLs based on start and end timestamps
                let filteredUrls 
                
                if (evt.start || evt.end) {
                    filteredUrls= Object.entries(urlTimestampMap).filter(([url, timestamp]) => {
                        // Case 1: Both start and end are set, include URLs in this range
                        if (startTimestamp && endTimestamp) {
                            return startTimestamp <= timestamp && timestamp <= endTimestamp;
                        }
                        // Case 2: Only start is set, include URLs from start onward
                        else if (startTimestamp) {
                            return startTimestamp <= timestamp;
                        }
                        // Case 3: Only end is set, include URLs up to end date
                        else if (endTimestamp) {
                            return timestamp <= endTimestamp;
                        }
                        // No filters applied, include all URLs
                        return true;
                    });
    
                    // Sort filtered URLs based on their timestamps (descending order for latest entries first)
                    filteredUrls.sort((a, b) => b[1] - a[1]);
                }
                else{
                    // If no filters are applied, show all URLs
                    filteredUrls = urlsArray.map(url => [url, urlTimestampMap[url]]);
                }

                // Clear the current table (if any) before displaying new results
                clearTable();

                // Create the table for sorted URLs
                filteredUrls.forEach(([url]) => {
                    createTable(url, level, domain);
                });
            });
        }
    });
}

function clearTable() {
    if (row) {
        row.innerHTML = ''; // Clear all rows in the table body
    }
}

function DomainFilter() {
    chrome.storage.local.get('collectDomain', function(list) {
        // Clear `domainFill` before adding options
        domainFill = '<option value="--">--</option>';

        // Convert stored domains into an array, removing whitespace
        let domainsArray = list.collectDomain.split('\n').map(item => item.trim());

        // Use a Set to handle unique domains
        let uniqueDomains = new Set();

        domainsArray.forEach((domain) => {
            // Check if domain is already in the Set
            if (!uniqueDomains.has(domain)) {
                uniqueDomains.add(domain); // Add to the Set
                domainFill += `<option value="${extractDomain(domain)}">${extractDomain(domain)}</option>`;
            }
        });

        selectDomain.innerHTML = domainFill;
    });
}

function createTable(url, level, domain){
    let time = '';
    let xfo = 'None';
    let csp = 'None';
    let riskLevel = 'Risky';

    chrome.storage.local.get([`${url}_headers`, `${url}_time`], function(result){
        console.log("Log.js:", result[`${url}_time`], result[`${url}_headers`]);

        time = result[`${url}_time`] || ''; // Use a default if not found
        let header = result[`${url}_headers`] || {}; // Use a default if not found

        for (let key in header) {
            if (key.startsWith('x-frame-options')){
                xfo = header[key];
                
                if (header[key].toLowerCase().includes("sameorigin") || header[key].toLowerCase().includes("deny")) {
                    riskLevel = 'Safe';
                }
                
            }
            // From Content-Security-Policy Key
            if (key.startsWith('content-security-policy')){
                // csp = header[key];
                csp = '';
                
                if (header[key].includes("frame-ancestor")){
                    riskLevel = 'Safe';
                }

                // Split CSP header by semicolon
                const directives = header[key].split(';');
                for (let directive of directives) {
                    directive = directive.trim(); // Remove any extra whitespace

                    csp += directive + '<br>';
                }
            }
        }

        // Build the row only if it meets the filtering criteria
        if ((level === '--' || level === riskLevel) && (domain === '--' || domain === extractDomain(url))) {
            full += `
                <tr>
                    <td>${time}</td>
                    <td class='url'>${url}</td>
                    <td>${xfo}</td>
                    <td class="csp">${csp}</td>
                    <td class="${riskLevel}">${riskLevel}</td>
                    <td><a class="see-poc" id='${url}'>${extractDomain(url)}</a></td>
                </tr>
            `;
        }

        row.innerHTML = full;
        sync();
    });

    full = '';
    domainFill = '';
}


function sync(){
    document.querySelectorAll('.see-poc').forEach(button => {
        button.addEventListener('click', function() {
            // Get the ID from the button
            const buttonId = this.id;
            chrome.storage.local.set({'poc' : buttonId});
            window.open('poc.html', '_blank');
        });
    });
}

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

function getCurrentDateTime() {
    const now = new Date();
    const date = now.toLocaleDateString();
    const time = now.toLocaleTimeString();
    return `${date} ${time}`;
}

// Update display on date selection with callback to run `checkDatesReady`
from.addEventListener("input", function() {
    const selectedDate = from.value;
    chrome.storage.local.set({ 'start': selectedDate }, checkDatesReady); // Call checkDatesReady after setting the start date
});

to.addEventListener("input", function() {
    const selectedDate = to.value;
    chrome.storage.local.set({ 'end': selectedDate }, checkDatesReady); // Call checkDatesReady after setting the end date
});

select.addEventListener("change", function() { // Use "change" for <select>
    const level = select.value; // Use the selected value from "from"
    chrome.storage.local.set({ 'level': level }, checkDatesReady); // Call checkDatesReady after setting the start date
});

selectDomain.addEventListener("change", function() { // Use "change" for <select>
    const dom = selectDomain.value; // Use the selected value from "from"
    chrome.storage.local.set({ 'domain': dom }, checkDatesReady); // Call checkDatesReady after setting the start date
});

document.getElementById('clear').onclick = () => {
    chrome.storage.local.remove(['start', 'end', 'level', 'domain'], () => {
        checkDatesReady();
    });
};

// Initial check to display data when the script loads
checkDatesReady();