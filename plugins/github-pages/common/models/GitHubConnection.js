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
        frontMatter += yamljs.stringify(properties, 50); 
        frontMatter += '---';

        return frontMatter;
    }
   
    /**
     * Gets templates
     *
     * @returns {Promise(Array)} templates
     */
    getTemplates() {
        return new Promise((resolve, reject) => {
            let headers = {
                'Accept': 'application/json'
            };
            
            restler.get('https://api.github.com/repos/' + this.settings.repo + '/contents/_layouts?access_token=' + this.settings.token, {
                headers: headers
            }).on('complete', (data, response) => {
                let templates = [];

                if(data) {
                    if(data.message) {
                        //debug.log('Couldn't find templates. GitHub response: ' + JSON.stringify(data.message), this);
                    
                    } else {
                        for(let i in data) {
                            let file = data[i];

                            templates[templates.length] = file.path.replace('_layouts/', '').replace('.html', '');
                        }
                    }
                }

                resolve(templates);
            });
        });
    }
    
    /**
     * Gets section templates
     *
     * @returns {Promise(Array)} sectionTemplates
     */
    getSectionTemplates() {
        return new Promise((resolve, reject) => {
            let headers = {
                'Accept': 'application/json'
            };
            
            restler.get('https://api.github.com/repos/' + this.settings.repo + '/contents/_includes/sections?access_token=' + this.settings.token, {
                headers: headers
            }).on('complete', (data, response) => {
                let templates = [];

                if(data) {
                    if(data.message) {
                        //debug.log('Couldn't find section templates. GitHub response: ' + JSON.stringify(data.message), this);

                    } else {
                        for(let i in data) {
                            let file = data[i];

                            templates[templates.length] = file.path.replace('_includes/sections/', '').replace('.html', '');
                        }
                    }
                }

                resolve(templates);
            });
        });
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
            let path = 'content/' + language + '/' + id + '.md';

            // Add meta data to the properties
            properties.meta = {
                id: id,
                language: language
            };

            // Remap "url" to "permalink"
            if(properties.url) {
                properties.permalink = properties.url;
                delete properties.url;
            }

            // Remap "template" to "layout"
            if(properties.template) {
                properties.layout = properties.template;
                delete properties.template;
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
