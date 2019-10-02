/**
 * Gets a cookie by name
 *
 * @param {String} name
 *
 * @returns {String} value
 */
window.getCookie = function getCookie(name) {
    let value = "; " + document.cookie;
    let parts = value.split("; " + name + "=");

    if(parts.length == 2) {
        return parts.pop().split(";").shift();
    }
}

/**
 * Copies string to the clipboard
 *
 * @param {String} string
 */
window.copyToClipboard = function copyToClipboard(string) {
    let text = document.createElement('TEXTAREA');

    text.innerHTML = string;

    document.body.appendChild(text);

    text.select();

    try {
        let success = document.execCommand('copy');

        if(!success) {
            UI.error('Your browser does not yet support copying to clipboard');
        }
    } catch(e) {
        UI.error(e.toString());
    }

    document.body.removeChild(text);
}

/**
 * Checks for updates
 */
window.updateCheck = async function updateCheck() {
    let update = await HashBrown.Service.RequestService.customRequest('get', '/api/server/update/check');
    
    if(update.isBehind) {
        UI.notifySmall('Update available', 'HashBrown can be updated to ' + update.remoteVersion + '. Please check the <a href="/readme">readme</a> for instructions.'); 
    }
}
