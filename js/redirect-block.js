
function extractDomain(url) {
    let domain;
    // Remove protocol (http, https, etc.) by splitting at "://"
    if (url.indexOf("://") > -1) {
        domain = url.split('/')[2];
    } else {
        domain = url.split('/')[0];
    }
    // Remove port number if present (e.g., nagios.com:3000)
    domain = domain.split(':')[0];
    return domain.toLowerCase().trim();
}

chrome.storage.local.get('url', function(result) {
    domain = extractDomain(result.url);
    document.getElementById('url').innerText = domain;
});

chrome.storage.local.get('securityLevel', function(result){
    document.getElementById('security-level').innerText = result.securityLevel;
});

const back = document.getElementById('back');

back.onclick = () => {
    window.history.go(-2);
};

chrome.storage.local.get('NotificationColor', function(result){
    if (result.NotificationColor){
        if (result.NotificationColor === 'White'){
            document.getElementById('mode-color').style.backgroundColor = '#fff';
            document.getElementById('mode-color').style.color = 'black';
            document.getElementById('back').style.borderColor = 'black';

            document.querySelector('.decription').style.color = '#7f7f7f';
        }
        if (result.NotificationColor === 'Black'){
            document.getElementById('mode-color').style.backgroundColor = '#1b1b1b';
            document.getElementById('mode-color').style.color = '#fff';
            document.getElementById('back').style.borderColor = '#fff';

            document.querySelector('.decription').style.color = '#f0f0f0e3';
        }   
    }
    else{
        document.getElementById('mode-color').style.backgroundColor = '#fff';
        document.getElementById('mode-color').style.color = 'black';
        document.getElementById('back').style.borderColor = 'black';

        document.querySelector('.decription').style.color = '#7f7f7f';
    }
});