//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// clickjacking-auto-detection-system.com
// cads2024.com

// Current Active Tab URL
chrome.tabs.onActivated.addListener(handleTabChange);
chrome.tabs.onUpdated.addListener(handleTabUpdate);

// Function to handle tab changes
function handleTabChange(activeInfo) {
  chrome.storage.local.get('power', function(result) {
    if (result.power == 'ON') {
      chrome.tabs.get(activeInfo.tabId, function(tab) {
        if (tab.url && (tab.url.startsWith('http://') || tab.url.startsWith('https://'))) {
          processTab(tab.url, activeInfo.tabId);
        }
      });
    } 
    else {
      resetStatus();
    }
  });
}

// Function to handle tab updates
function handleTabUpdate(tabId, changeInfo, tab) {
  if (changeInfo.status === 'complete') {
    chrome.storage.local.get('power', function(result) {
      if (result.power == 'ON'){
        if (tab.url && (tab.url.startsWith('http://') || tab.url.startsWith('https://'))) {
          processTab(tab.url, tabId);
        } 
      }
      else {
        resetStatus();
      }
    });
  }
}

// Process the tab URL
function processTab(url, tabId) {
  console.log("Processing URL: ", url);
  chrome.storage.local.set({ 'url': url });
  fetchHeaders(url);
  extractIframeLinks(tabId, url);
}

// Reset status if power is off
function resetStatus() {
  chrome.storage.local.set({
    'url': 'source: n/a',
    'securityLevel': 'n/a',
    'status': 'off'
  });
}

// Fetch headers for a given URL
async function fetchHeaders(url) {
  try {
    await fetchWithMethod(url, 'HEAD');
  } catch (error) {
    console.log('Error fetching headers (method: HEAD), falling back to GET:', error);
    try {
      await fetchWithMethod(url, 'GET');
    } catch (getError) {
      console.log('Error fetching headers (method: GET):', getError);
    }
  }
}

async function fetchWithMethod(url, method) {
  const response = await fetch(url, { method });
  
  if (response.ok) {
    const headers = {};
    response.headers.forEach((value, name) => {
      headers[name] = value;
    });
    const time = getCurrentDateTime();
    chrome.storage.local.set({[`${url}_headers`]: headers, [`${url}_time`]: time });
    chrome.storage.local.get([`${url}_headers`, `${url}_time`], function(result){
      console.log("Here's the result of the test:", result[`${url}_time`], result[`${url}_headers`]);
    });
    console.log(headers);
    collectDomain(url);
    checkHeader(url, headers);
  } 
  else {
    console.log(`Failed to fetch (method: ${method}): ${response.status}`);
  }
}

function checkHeader(url, headers) {
  let stat = '';

  let ticking = {
    clickjacking: 'no',
    cspFrameAncestor: 'no',
    cspSandbox: 'no',
    cspDefaultSrc: 'no',
    cspScriptSrc: 'no',
    cspObjectSrc: 'no',
    cspTrustedTypes: 'no',
    cspRequireTrustedTypes: 'no',
    xssProtection: 'no',
    cspConnectSrc: 'no',
    cspBaseUri: 'no',
    cspFormAction: 'no',
    cspUpgradeInsecure: 'no',
    cspBlockMixedContent: 'no',
    hstsMaxAge: 'no',
    hstsIncludeSubDomains: 'no',
    hstsPreload: 'no',
    xContentTypeOptions: 'no',
  };

  // Detect Vulnerability for Clickjacking
  for (let key in headers) {
    // From X-Frame-Options Key
    if (key.startsWith('x-frame-options')){
      if (headers[key].toLowerCase().includes("sameorigin") || headers[key].toLowerCase().includes("deny")) {
        console.log('yes x-frame-options');

        ticking.clickjacking = 'yes';
      }
    }
    // From Content-Security-Policy Key
    if (key.startsWith('content-security-policy')){
      // (CSP) frame-ancestor
      if (headers[key].includes("frame-ancestor")){
        console.log('yes frame-ancestor');

        ticking.cspFrameAncestor = 'yes';
      }
      // (CSP) sandbox
      if (headers[key].includes("sandbox")){
        console.log('yes sandbox');

        ticking.cspSandbox = 'yes';
      }
      // (CSP) default-src
      if (headers[key].includes("default-src 'self'")) {
        console.log("yes default-src 'self'");

        ticking.cspDefaultSrc = 'yes';
      }
      // (CSP) script-src
      if (headers[key].includes("script-src")) {
        console.log("yes script-src");

        ticking.cspScriptSrc = 'yes';
      }
      // (CSP) object-src
      if (headers[key].includes("object-src 'none'")) {
        console.log("yes object-src 'none'");

        ticking.cspObjectSrc = 'yes';
      }
      // (CSP) trusted-types
      if (headers[key].includes("trusted-types 'self'")) {
        console.log("yes trusted-types 'self'");

        ticking.cspTrustedTypes = 'yes';
      }
      // (CSP) require-trusted-types-for
      if (headers[key].includes("require-trusted-types-for")) {
        console.log("yes require-trusted-types-for 'script'");

        ticking.cspRequireTrustedTypes = 'yes';
      }
      // (CSP) connect-src
      if (headers[key].includes("connect-src 'self'")) {
        console.log("yes connect-src 'self'");

        ticking.cspConnectSrc = 'yes';
      }
      // (CSP) base-uri
      if (headers[key].includes("base-uri 'self'")) {
        console.log("yes base-uri 'self'");

        ticking.cspBaseUri = 'yes';
      }
      // (CSP) form-action
      if (headers[key].includes("form-action 'self'")) {
        console.log("yes form-action 'self'");

        ticking.cspFormAction = 'yes';
      }
      // (CSP) upgrade-insecure-requests
      if (headers[key].includes("upgrade-insecure-requests")) {
        console.log("yes upgrade-insecure-requests");

        ticking.cspUpgradeInsecure = 'yes';
      }
      // (CSP) block-all-mixed-content
      if (headers[key].includes("block-all-mixed-content")) {
        console.log("yes block-all-mixed-content");

        ticking.cspBlockMixedContent = 'yes';
      }

    }
    // X-XSS-Protection
    if (key.startsWith('x-xss-protection')) {
      ticking.xssProtection = 'yes';
    }
    // Strict-Transport-Security
    if (key.startsWith('strict-transport-security')) {
      // Protocol Downgrade Attacks
      // (HSTS) max-age
      if (headers[key].includes("max-age")) {
        console.log("yes max-age");

        ticking.hstsMaxAge = 'yes';
      }
      // Cookie Hijacking
      // (HSTS) includeSubDomains
      if (headers[key].includes("includeSubDomains")) {
        console.log("yes Cookie Hijacking protection");

        ticking.hstsIncludeSubDomains = 'yes';
      }
      // Man-in-the-Middle (MITM) Attacks
      // (HSTS) preload
      if (headers[key].includes("preload")) {
        console.log("yes Man-in-the-Middle (MITM) Attacks protection");

        ticking.hstsPreload = 'yes';
      }
    }
    // X-Content-Type-Options
    if (key.startsWith('x-content-type-options')){
      // MIME Sniffing
      // nosniff
      if (headers[key].includes("nosniff")){
        console.log("yes MIME Sniffing protection");
        
        ticking.xContentTypeOptions = 'yes';
      }
    }
  }

  // Determine security level
  if (ticking.clickjacking === 'yes' || ticking.cspFrameAncestor === 'yes') {
    chrome.storage.local.set({ 'status': 'safe', 'securityLevel': 'Safe' });
    SafeBrowse(url);
    stat = 'Safe';
  } 
  else {
    chrome.storage.local.set({ 'status': 'risk', 'securityLevel': 'High Risk' });
    RiskBrowse(url);
    stat = 'Risk';
  }

  // Store the results
  const tickingKeys = [
    'clickjacking',
    'cspFrameAncestor',
    'cspSandbox',
    'cspDefaultSrc',
    'cspScriptSrc',
    'cspObjectSrc',
    'cspTrustedTypes',
    'cspRequireTrustedTypes',
    'xssProtection',
    'cspConnectSrc',
    'cspBaseUri',
    'cspFormAction',
    'cspUpgradeInsecure',
    'cspBlockMixedContent',
    'hstsMaxAge',
    'hstsIncludeSubDomains',
    'hstsPreload',
    'xContentTypeOptions',
  ];

  const tickingIndex = tickingKeys.map(key => ticking[key]);

  chrome.storage.local.set({'ticking': tickingIndex});
  console.log(tickingIndex);

  cheking_list(url, stat);
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

// Checking the URL if its in white or black list
function cheking_list(url, stat){
  console.log("Checking list");

  let domain_to_check = extractDomain(url);

  chrome.storage.local.get(['SecureForNow', 'whitelist', 'blacklist', 'whiteON', 'blackON', 'notification'], function(result){
    let Secure4Now = result.SecureForNow;
    let Whitelist = result.whitelist;
    let Blacklist = result.blacklist;
    let Notification = result.notification || 'maximize';

    if (Secure4Now) {
      // Assuming Secure4Now is a string with domains separated by newlines or some other delimiter.
      let Secure4NowArray = Secure4Now.split('\n').map(item => item.trim()); // Split the string into an array
  
      // Check if the domain_to_check is included in the array
      if (Secure4NowArray.includes(domain_to_check)) {
          console.log("Secure for Now");
          return;
      }
    }

    if (result.whiteON === 'ON' && Whitelist){
      let whitelistArray = Whitelist.split('\n').map(item => item.trim());

      if (whitelistArray.includes(domain_to_check)) {
        return;
      }
    }

    if (result.blackON === 'ON' && Blacklist){
      let blacklistArray = Blacklist.split('\n').map(item => item.trim());

      if (blacklistArray.includes(domain_to_check)) {
        console.log("URL is in the blacklist, redirecting to block page.");
        maximize('blacklist');
        return;
      }
    }

    if (stat == 'Risk'){
      chrome.storage.local.set({ 'theURL' : url });
      DefaultSetting(Notification);
      return;
    }
    
  });
}

function DefaultSetting(stat){
  // checking status notfication
  if (stat == 'maximize'){
    maximize('unsafe');
  }
  if (stat == 'minimize'){
    minimize();
  }
}

// Notification on the max-scale (redirect page)
function maximize(stat){
  // checking status notfication
  if (stat == 'unsafe'){
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
      chrome.tabs.update(tabs[0].id, { url: "redirect.html" });
    });
  }
  if (stat == 'blacklist'){
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
      chrome.tabs.update(tabs[0].id, { url: "redirect-block.html" });
    });
  }
}

// Notification on the min-scale (mini-notification)
function minimize(){
  chrome.notifications.create({
    type: 'basic',
    iconUrl: '/images/CADS.png', // Path to your extension icon
    title: 'Potential risk of Clickjacking',
    message: 'This Website is Not Secure..!\n\nSuggestion: Stop Browsing.'
  });
}

function SafeBrowse(url){
  chrome.storage.local.get('SafeBrowse', function(result) {
    let SafeBrowse = result.SafeBrowse;

    if (SafeBrowse){
      let SafeBrowseArray = SafeBrowse.split('\n').map(item => item.trim());
  
      if (!SafeBrowseArray.includes(url)) {
        SafeBrowseArray.push(url);
        let updatedSafeBrowse = SafeBrowseArray.join('\n');
        chrome.storage.local.set({ 'SafeBrowse' : updatedSafeBrowse });
      }
      else{
        console.log("Already marked");
      }
    }

    else{
      chrome.storage.local.set({ 'SafeBrowse' : url });
    }
  });
}

// Function to store all unsecure URLs
function RiskBrowse(url) {

  chrome.storage.local.get('RiskBrowse', function(result) {

    let RiskBrowse = result.RiskBrowse;

    if (RiskBrowse){
      let RiskBrowseArray = RiskBrowse.split('\n').map(item => item.trim());
  
      if (!RiskBrowseArray.includes(url)) {
        RiskBrowseArray.push(url);
        let updatedRiskBrowse = RiskBrowseArray.join('\n');
        chrome.storage.local.set({ 'RiskBrowse' : updatedRiskBrowse });
      }
      else{
        console.log("Already marked");
      }
    }

    else{
      chrome.storage.local.set({ 'RiskBrowse' : url });
    }
  });
}

// Collect All Domains Browsed by User
function collectDomain(urlFull){
  let url = extractDomain(urlFull);

  chrome.storage.local.get(['collectDomain', 'collectURL'], function(result){
    let collectDomain = result.collectDomain;
    let collectURL = result.collectURL;

    if(collectDomain){
      let collectDomainArray = collectDomain.split('\n').map(item => item.trim()); 

      if (!collectDomainArray.includes(url)) {
        collectDomainArray.push(url);

        let updatedCollectDomain = collectDomainArray.join('\n');

        chrome.storage.local.set({ 'collectDomain': updatedCollectDomain });
      }
    }
    else{
      chrome.storage.local.set({ 'collectDomain': url });
    }
    console.log("Collected Domains from storage:\n"+collectDomain);

    if(collectURL){
      let collectURLArray = collectURL.split('\n').map(item => item.trim()); 

      if (!collectURLArray.includes(urlFull)) {
        collectURLArray.push(urlFull);

        let updatedCollectURL = collectURLArray.join('\n');

        chrome.storage.local.set({ 'collectURL': updatedCollectURL });
      }
      else {
        // Array to hold URL-timestamp pairs for sorting
        let urlTimestampArray = [];

        // Retrieve timestamps for each URL and store them in the array
        Promise.all(
          collectURLArray.map(url => 
            new Promise(resolve => {
              chrome.storage.local.get([`${url}_time`], function(result) {
                let timestamp = Date.parse(result[`${url}_time`]);
                urlTimestampArray.push({ url, timestamp });
                resolve();
              });
            })
          )
        ).then(() => {
          // Sort URLs by their timestamps in descending order
          urlTimestampArray.sort((a, b) => b.timestamp - a.timestamp);

          // Extract sorted URLs
          let sortedURLs = urlTimestampArray.map(item => item.url);

          // Update collectURL in storage with sorted URLs
          chrome.storage.local.set({ 'collectURL': sortedURLs.join('\n') });
        });

        chrome.storage.local.get('collectURL', function(evt){
          console.log(evt.collectURL);
        });
      }
      
    }
    else{
      chrome.storage.local.set({ 'collectURL': urlFull });
    }
  });
}

// Function to extract iframe links
function extractIframeLinks(tabId, save_url) {
  chrome.scripting.executeScript({
    target: { tabId: tabId },
    func: (save_url) => {
      const iframes = document.querySelectorAll('iframe');
      let results = 'Potential iFrame Source\nThe following links navigate to different domains than the current page:\n\n';
      
      const processedLinks = new Set();
  
      function isValidUrl(string) {
          try {
              new URL(string);
              return true;
          } catch (e) {
              try {
                  new URL(string, window.location.origin);
                  return true;
              } catch (e) {
                  return false;
              }
          }
      }

      function getFullUrl(urlString) {
          try {
              return new URL(urlString).href;
          } catch (e) {
              try {
                  return new URL(urlString, window.location.origin).href;
              } catch (e) {
                  return urlString;
              }
          }
      }

      // Process each iframe's src attribute
      iframes.forEach((iframe) => {
          const src = iframe.src;
          if (src && !processedLinks.has(src) && isValidUrl(src)) {
              const fullSrc = getFullUrl(src);
              const text = iframe.title || src;
              
              try {
                  if (new URL(fullSrc).origin !== window.location.origin) {
                      results += `Link: ${fullSrc}\nText: ${text}\n\n`;
                      processedLinks.add(fullSrc);
                  }
              } catch (e) {
                  console.log('Invalid iframe src:', src);
              }
          }

          // Check for data-src attribute
          const dataSrc = iframe.getAttribute('data-src');
          if (dataSrc && !processedLinks.has(dataSrc) && isValidUrl(dataSrc)) {
              const fullDataSrc = getFullUrl(dataSrc);
              const text = iframe.title || dataSrc;
              
              try {
                  if (new URL(fullDataSrc).origin !== window.location.origin) {
                      results += `Link: ${fullDataSrc}\nText: ${text}\n\n`;
                      processedLinks.add(fullDataSrc);
                  }
              } catch (e) {
                  console.log('Invalid data-src:', dataSrc);
              }
          }
      });
      
      // Get regular links
      const links = document.querySelectorAll('a');
      links.forEach(link => {
          const href = link.href;
          if (href && !processedLinks.has(href) && isValidUrl(href)) {
              const fullHref = getFullUrl(href);
              const text = link.textContent.trim() || link.title || href;
              
              try {
                  if (new URL(fullHref).origin !== window.location.origin) {
                      results += `Link: ${fullHref}\nText: ${text}\n\n`;
                      processedLinks.add(fullHref);
                  }
              } catch (e) {
                  console.log('Invalid href:', href);
              }
          }
      });

      // return results; // You can store or handle results here
      chrome.storage.local.set({[`${save_url}_iframeSource`] : results});
    },
    args: [save_url] // Pass save_url as an argument
  });
}

function getCurrentDateTime() {
  const now = new Date();
  const date = now.toLocaleDateString();
  const time = now.toLocaleTimeString();
  return `${date} ${time}`;
}


// background.js
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "getData") {
    chrome.storage.local.get(['collectURL', 'whitelist', 'blacklist'], (result) => {

      let total = 0;
      let blacklistCount = 0;
      let whitelistCount = 0;

      if (result.collectURL){
        total = result.collectURL.split('\n').length;
      }

      if (result.blacklist){
        blacklistCount = result.blacklist.split('\n').length;
      }

      if (result.whitelist){
        whitelistCount = result.whitelist.split('\n').length;
      }
      // Send back the data
      sendResponse({
          collectURL: total,
          whitelist: whitelistCount,
          blacklist: blacklistCount
      });
    });
    // Return true to indicate that sendResponse will be called asynchronously
    return true;
  }
});


// Clear SecureForNow when Chrome starts or the extension is loaded
chrome.runtime.onStartup.addListener(() => {
  chrome.storage.local.remove('SecureForNow', function() {
      console.log("The 'SecureForNow' item has been cleared on browser start.");
  });
});

// Optionally, clear SecureForNow when the extension is installed or updated
chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.remove('SecureForNow', function() {
      console.log("The 'SecureForNow' item has been cleared on extension install.");
  });
});