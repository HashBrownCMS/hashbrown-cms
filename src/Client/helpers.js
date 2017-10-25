window.Promise = require('bluebird');
window.marked = require('marked');
window.toMarkdown = require('to-markdown');

const ProjectHelper = require('Client/Helpers/ProjectHelper');
const User = require('Common/Models/User');

/**
 * Checks if the currently logged in user is admin
 *
 * @returns {Boolean} Is admin
 */
window.currentUserIsAdmin = function isCurrentUserAdmin() {
    return User.current.isAdmin;
}

/**
 * Checks if the currently logged in user has a certain scope
 *
 * @param {String} scope
 *
 * @returns {Boolean} Has scope
 */
window.currentUserHasScope = function currentUsr(scope) {
    return User.current.hasScope(ProjectHelper.currentProject, scope);
}

/**
 * Handles a required parameter
 */
window.requiredParam = function requiredParam(name) {
    throw new Error('Parameter "' + name + '" is required');
}

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
            UI.errorModal('Your browser does not yet support copying to clipboard');
        }
    } catch(e) {
            UI.errorModal(e.toString());
    }

    document.body.removeChild(text);
}

/**
 * Clears the workspace
 */
window.clearWorkspace = function clearWorkspace() {
    $('.workspace').empty();
};

/**
 * Sets workspace content
 */
window.populateWorkspace = function populateWorkspace($html, classes) {
    let $workspace = $('.page--environment__space--editor');

    $workspace.empty();
    $workspace.attr('class', 'page--environment__space--editor');
    
    _.append($workspace, $html);

    if(classes) {
        $workspace.addClass(classes);
    }
};

// Get package file
window.app = require('package.json');

// Language
window.language = localStorage.getItem('language') || 'en';
