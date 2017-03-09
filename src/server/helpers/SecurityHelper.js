'use strict';

let credentials = {
    key: null,
    cert: null
};

let fs = require('fs');
let execSync = require('child_process').execSync;

class SecurityHelper {
    /**
     * Loads private key and certificate
     *
     * @param {String} siteName
     *
     * @returns {Promise} Result
     */
    static loadCredentials(siteName = 'localhost') {
        if(!fs.existsSync(appRoot + '/ssl')) {
            fs.mkdirSync(appRoot + '/ssl');
        }
        
        execSync('openssl genrsa -out ' + appRoot + '/ssl/server.key');
        execSync('openssl req -new -key ' + appRoot + '/ssl/server.key -out ' + appRoot + '/ssl/server.csr -subj "/C=DK/ST=Copenhagen/L=Copenhagen/O=Putaitu Productions/OU=Development/CN=' + siteName + '"');
        execSync('openssl x509 -req -in ' + appRoot + '/ssl/server.csr -signkey ' + appRoot + '/ssl/server.key -out ' + appRoot + '/ssl/server.crt');
        
        credentials.key = fs.readFileSync(appRoot + '/ssl/server.key', 'UTF-8');
        credentials.cert = fs.readFileSync(appRoot + '/ssl/server.crt', 'UTF-8');
    }

    /**
     * Gets the private key and certificate
     *
     * @returns {Object} Key and cert
     */
    static getCredentials() {
        if(!credentials.key || !credentials.cert) {
            this.loadCredentials();
        }

        return credentials;
    }
}

module.exports = SecurityHelper;
