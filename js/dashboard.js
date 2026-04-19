
chrome.storage.local.get(['SafeBrowse', 'RiskBrowse', 'collectURL'], function(result){
    let safe = result.SafeBrowse ? result.SafeBrowse.split('\n').length : 0; // safe is an integer
    let risk = result.RiskBrowse ? result.RiskBrowse.split('\n').length : 0; // risk is an integer
    let total = safe + risk; // total is also an integer

    SafetyPercent(total, safe, risk);
    graphMostVisisted(result.collectURL, total);
});


function TotalBrowse(total, secure, risk, percent){
    if (percent >= 80){
        document.getElementById('insTotal').innerHTML = `<a class="tooltip">${total}<span class="tooltiptext">Secure</span>`;
    }
    
    if (percent >= 40 && percent < 80){
        document.getElementById('insTotal').innerHTML = `<a class="tooltip">${total}<span class="tooltiptext">Caution</span>`;
    }

    if (percent < 40){
        document.getElementById('insTotal').innerHTML = `<a class="tooltip">${total}<span class="tooltiptext">Risky</span>`;
    }

    if(percent == -1){
        document.getElementById('insTotal').innerHTML = `<a class="tooltip">${total}<span class="tooltiptext">NaN</span>`;
    }
    
    document.getElementById('Amount1').innerText = secure;
    document.getElementById('Amount2').innerText = risk;

    const donut = document.getElementById('DonutTotal');

    percent = parseFloat(percent);

    if (percent > 0){
        donut.style.background = "conic-gradient(#43ce43 0% " + percent + "%, #ef5350 " + percent + "% 100%)";
    }
    if (percent == 0){
        donut.style.background = "#ef5350";
    }
    if (percent == -1){
        donut.style.background = "white";
    }

    tooltipON();
}

function SafetyPercent(total, secure, risk){
    let color = document.getElementById('ChangeColorBaseOnPercent');
    let paste = '';
    let securityLevel = '';
    let percent = (parseFloat(secure)/parseFloat(total)) * 100;

    percent = percent.toFixed(2);

    if (percent >= 80){
        securityLevel = 'Secure';
    }
    
    if (percent >= 40 && percent < 80){
        securityLevel = 'Caution';
    }

    if (percent < 40){
        securityLevel = 'Risky';
    }

    if(percent == "NaN"){
        percent = -1;
        securityLevel = "NaN";
        paste += "<p>0% " + securityLevel + "</p>";
    }
    else{
        paste += "<p id='white'>" + percent + "% " + securityLevel + "</p>";
    }

    if (securityLevel == 'Secure'){
        paste += "<img src='../images/secure.png'>";

        color.style.background = "linear-gradient(to right, rgb(27, 137, 27)0%, rgb(67, 206, 67)100%)";
        color.style.borderColor = "green";
    }

    if (securityLevel == 'Caution'){
        paste += "<img src='../images/caution.png'>";

        color.style.background = "linear-gradient(to right, rgb(174, 140, 17)0%, rgb(237, 187, 69)100%)";
        color.style.borderColor = "rgb(153, 115, 2)";
    }

    if (securityLevel == 'Risky'){
        paste += "<img src='../images/risky.png'>";

        color.style.background = "linear-gradient(to right, rgb(174, 19, 17)0%, rgb(237, 72, 69)100%)";
        color.style.borderColor = "rgb(153, 2, 2)";
    }

    if(securityLevel == "NaN"){
        paste += "<img src='../images/nan.png'>";

        color.style.background = "linear-gradient(to right, rgb(46, 46, 62)0%, rgb(43, 43, 55)100%)";
        color.style.borderColor = "rgb(255, 255, 255)";
    }

    document.getElementById('insPercent').innerHTML = paste;

    TotalBrowse(total, secure, risk, percent);
}



function graphMostVisisted(allWebsite, totalWebsite){

    let text = '';
    let graph = '';

    let hereGraph = document.getElementById('hereGraph');

    let allWebsiteArray = [];

    if (allWebsite){
        allWebsiteArray = allWebsite.split('\n').map(item => item.trim());
    }

    chrome.storage.local.get('collectDomain', function(result){
        let collectDomain = result.collectDomain;  
    
        if(collectDomain){
            let collectDomainArray = collectDomain.split('\n').map(item => item.trim()); 
            
            // Initialize an object to store counts for each domain
            let domainCount = {};

            
            for (let website of allWebsiteArray) {
                let websiteDomain = extractDomain(website);

                for (let domain of collectDomainArray){
                    if (domain === websiteDomain){
                        if (domainCount[domain]) {
                            domainCount[domain]++;
                        } 
                        else {
                            domainCount[domain] = 1;
                        }
                    }
                }
            }

            // Sort the domains by count in descending order
            let sortedDomainCount = Object.entries(domainCount).sort((a, b) => b[1] - a[1]);

            // Display only the top 4 domains
            let topDomains = sortedDomainCount.slice(0, 4);

            // Loop to generate HTML for the top 4 domains

            text = '<div id="sidegraph">';
            graph = '<div id="graph">';
            for (let i = 0; i < topDomains.length; i++) {
                let domainName = topDomains[i][0];  // The domain name
                let domainVisits = topDomains[i][1];  // The number of visits

                // Construct the HTML for the sidegraph and bar graph
                text += '<div id="side-' + (i + 1) + '" class="sidegraph-style"><p>' + domainName + '</p></div>';
                graph += '<div id="bar-' + (i + 1) + '" class="graph-style">' + domainVisits + '</div>'; // Adjust the height dynamically

                // Calculate the percentage for the width
                let graphPercent = (totalWebsite > 0) ? (domainVisits / topDomains[0][1]) * 100 : 0;  // Avoid division by zero

                // Now set the width after the HTML has been added to the DOM
                // Use a setTimeout to ensure the elements are created before trying to set their styles
                setTimeout(() => {
                    document.getElementById('bar-' + (i + 1)).style.width = graphPercent + '%'; // Set width with unit
                    changeGraphColor();
                }, 0);
            }
            text += '</div>';
            graph += '</div>';
            hereGraph.innerHTML = text + graph;

        }
        else{
            hereGraph.innerHTML = '';
            console.log('Empty BROO...');
        }
    });
}

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


chrome.storage.local.get(['whitelist', 'blacklist'], function(result){
    let whitelist = result.whitelist;
    let blacklist = result.blacklist;

    if (whitelist){
        let count = whitelist.split('\n').length;

        if (count == 0){
            count = 1;
        }

        document.getElementById('listWhite').innerHTML = '<h1>' + count + '</h1><p>Whitelist</p>';
    }
    else{
        document.getElementById('listWhite').innerHTML = '<h1>0</h1><p>Whitelist</p>';
    }

    if (blacklist){
        let count = blacklist.split('\n').length;

        if (count == 0){
            count = 1;
        }

        document.getElementById('listBlack').innerHTML = '<h1>' + count + '</h1><p>Blacklist</p>';
    }
    else{
        document.getElementById('listBlack').innerHTML = '<h1>0</h1><p>Blacklist</p>';
    }
});
