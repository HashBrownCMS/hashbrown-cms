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
        frontMatter += yamljs.stringify(properties); 
        frontMatter += '\n---';

        return frontMatter;
    }
    
    /**
     * Posts content properties to the remote target
     *
     * @param {Object} properties
     *
     * @returns {Promise} promise
     */
    postContentProperties(properties) {
        return new Promise((resolve, reject) => {
            let path = properties.url || ContentHelper.getSlug(properties.title);

            // Remove first and last slash
            if(path[0] == '/') {
                path = path.substring(1);
            }

            if(path[path.length - 1] == '/') {
                path = path.substring(0, path.length - 1);
            }

            // Add the markdown extension
            path += '.md';

            let apiPath = 'https://api.github.com/repos/' + this.settings.repo + '/contents/' + path + '?access_token=' + this.settings.token;
            let fileContent = this.compileForJekyll(properties);
            let fileObject = JSON.stringify({ content: fileContent });
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
                    content: new Buffer(fileObject).toString('base64')
                };

                // Commit the file
                debug.log('Committing data...', this);

                restler.put(apiPath, {
                    headers: headers,
                    data: postData
                }).on('complete', (data, response) => {
                    if(data.message) {
                        debug.log('GitHub response: ' + JSON.stringify(data), this);
                        debug.log('URL: ' + apiPath, this);
                        debug.log('Data: ' + JSON.stringify(postData), this);
                    
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
