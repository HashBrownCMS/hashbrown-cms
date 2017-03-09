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

    /**
     * Starts the letsencrypt handler
     *
     * @returns {Object} Let's encrypt handler
     */
    static startLetsEncrypt() {
        if(!fs.existsSync(appRoot + '/config/ssl.json')) { return null; }

        let config = require('../../../config/ssl.json'); 

        // Config sanity check
        if(!config.domain) {
            throw new Error('Variable "domain" not set in /config/ssl.json');
        }
        
        if(!config.email) {
            throw new Error('Variable "email" not set in /config/ssl.json');
        }
        
        if(config.agreeTos != true && config.agreeTos != false) {
            throw new Error('Variable "agreeTos" not set in /config/ssl.json');
        }
        
        // Storage backend
        let leStore = require('le-store-certbot').create({
            configDir: appRoot + '/certs',
            debug: false
        });

        // ACME challenge handler
        let leChallenge = require('le-challenge-fs').create({
            webrootPath: appRoot,
            debug: false
        });

        // Agreement handler
        let leAgree = (opts, agreeCb) => {
            agreeCb(null, opts.tosUrl);
        };

        // Let's Encrypt instance
        let LE = require('greenlock');
        let le = LE.create({
            server: LE.stagingServerUrl,
            store: leStore,
            challenges: { 'http-01': leChallenge },
            challengeType: 'http-01',
            agreeToTerms: leAgree,
            debug: false
        });

        // Check in-memory cache of certificates for the named domain
        le.check({
            domains: [config.domain]
        }).then((results) => {
            // We already  have certificates
            if(results) { return; }
            
            le.register({
                domains: [config.domain],
                email: config.email,
                agreeTos: config.agreeTos,
                rsaKeySize: 2048,
                challengeType: 'http-01'
            })
            .then(
                (certs) => {
                    console.log(certs);
                },
                (err) => {
                    throw err;
                }
            );
        });

        return le;
    }
}

module.exports = SecurityHelper;
