'use strict';

let yamljs = require('../lib/yamljs/Yaml');
let restler = require('restler');

let Connection = require(appRoot + '/src/common/models/Connection');
let Content = require(appRoot + '/src/common/models/Content');

class GitHubConnection extends Connection {
    constructor(data) {
        super(data);
    }

    /**
     * Compiles content for Jekyll
     *
     * @param {Object} properties
     *
     * @returns {Promise} promise
     */
    compileForJekyll(properties) {
        debug.log('Compiling "' + properties.title + '" for Jekyll...', this);

        let frontMatter = '';

        frontMatter += '---\n';
        frontMatter += yamljs.stringify(properties, 10); 
        frontMatter += '---';

        return frontMatter;
    }
    
    /**
     * Posts content properties to the remote target
     *
     * @param {Object} properties
     * @param {String} id
     * @param {String} language
     * @param {Object} meta
     *
     * @returns {Promise} promise
     */
    postContentProperties(properties, id, language, meta) {
        return new Promise((resolve, reject) => {
            let path = this.settings.content + '/' + language + '/' + id + '.md';

            // Add meta data to the properties
            properties._id = id;
            properties._language = language;

            // Remap "url" to "permalink"
            if(properties.url) {
                properties.permalink = properties.url;
                delete properties.url;
            }

            let apiPath = 'https://api.github.com/repos/' + this.settings.repo + '/contents/' + path + '?access_token=' + this.settings.token;
            let fileContent = this.compileForJekyll(properties);
            let headers = {
                'Accept': 'application/json'
            };

            debug.log('Uploading "' + path + '"...', this);

            // Fetch first to get the SHA
            debug.log('Getting SHA...', this);
            
            restler.get(apiPath, {
                headers: headers
            }).on('complete', (data, response) => {
                let postData = {
                    sha: data.sha,
                    path: path,
                    message: 'Commit from Endomon CMS',
                    content: new Buffer(fileContent).toString('base64')
                };

                // Commit the file
                debug.log('Committing data...', this);

                restler.put(apiPath, {
                    headers: headers,
                    data: JSON.stringify(postData)
                }).on('complete', (data, response) => {
                    if(data.message) {
                        debug.log('Committing file failed', this);
                        debug.log('GitHub response: ' + JSON.stringify(data), this);
                    
                    } else {
                        debug.log('Committed file successfully!', this);

                    }

                    resolve();

                });
            });
        });
    }
}

module.exports = GitHubConnection;
