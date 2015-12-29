'use strict';

let octokat = require('octokat');
let env = require('../../env.json');

let Content = require('../../src/models/content/content');
let Debug = require('../../src/helpers/debug');

class GitHub {
    /**
     * Constructor
     * Registers all hooks
     */
    constructor(controller) {
        // Git operations
        controller.hook('post', '/api/git/repos', this.repos);
        controller.hook('post', '/api/git/compare/:user/:repo/:base/:head', this.compare);
        controller.hook('post', '/api/git/repos/:user', this.repos);
        controller.hook('post', '/api/git/refs/:mode/:user/:repo/:branch', this.refs);
        controller.hook('post', '/api/git/tree/:mode/:user/:repo/:branch', this.tree);
        controller.hook('post', '/api/git/file/:mode/:user/:repo/*', this.file);
        controller.hook('post', '/api/git/repo/:user/:repo', this.repo);
        controller.hook('post', '/api/git/branches/:user/:repo', this.branches);
        controller.hook('post', '/api/git/merge/:user/:repo', this.merge);

        // Auth operations
        controller.hook('post', '/api/login', this.login);

        // Organisation operations
        controller.hook('post', '/api/orgs', this.orgs);
        controller.hook('post', '/api/collaborators/:mode/:user/:repo', this.collaborators);

        // Issue tracking operations
        controller.hook('post', '/api/issue-tracking/issues/:mode/:user/:repo', this.issues);
        controller.hook('post', '/api/issue-tracking/labels/:mode/:user/:repo', this.labels);
        controller.hook('post', '/api/issue-tracking/milestones/:mode/:user/:repo', this.milestones);

        // Abstract CMS operations
        controller.hook('post', '/api/content/publish/:user/:repo/:branch/*', this.contentPublish);
        controller.hook('post', '/api/content/save/:user/:repo/:branch/*', this.contentSave);
        controller.hook('post', '/api/content/fetch/:user/:repo/:branch/*', this.contentFetch);
        controller.hook('post', '/api/structs/:mode/:user/:repo/*', this.structs);
        controller.hook('post', '/api/templates/:mode/:user/:repo/*', this.templates);

        // Redirects
        controller.hook('get', '/redir/repo/:user/:repo/:branch', this.redir);
    }
    
    /**
     * API call
     * A generic abstract API call for handling most cases
     */
    static apiCall(req, res, url, customCallback) {
        function callback(err, answer) {
            if(err) {
                res.send({ mode: req.params.mode, url: url, err: err, data: req.body.data });
                Debug.error(err.json != null ? err.json.message : err, 'GitHub', req.body.data);
           
            } else {
                if(customCallback) {
                    customCallback(answer);

                } else {
                    res.send(answer);
                }
            }
        }
        
        let octo = new octokat({ token: req.body.buffer.token });
        
        // Get the sha from the buffer
        if(req.body.buffer.sha) {
            req.body.data.sha = req.body.buffer.sha;
        }

        switch(req.params.mode) {
            case 'create':
                octo.fromUrl(url).create(req.body.data, callback);
                break;
            
            case 'update':
                octo.fromUrl(url).update(req.body.data, callback);
                break;
            
            case 'fetch': default:
                octo.fromUrl(url).fetch(req.body.data, callback);
                break;
        }
    }

    /**
     * Login
     * Handles GitHub credentials viw Basic Auth
     */
    login(req, res) {
        let octo = new octokat({
            username: req.body.username,
            password: req.body.password
        });
        
        octo.authorizations.create(
            {
                scopes: [
                    'repo',
                    'user',
                    'admin:org'        
                ],
                note: 'Putaitu CMS token',
                client_id: env.plugins.github.client.id,
                client_secret: env.plugins.github.client.secret
            },
            function(err, val) {
                if(err) {
                    res.send({ err: err });
                } else {
                    res.send(val);
                }
            }
        );
    }
    
    /**
     * Organisations
     * Gets/sets orginsation info
     */
    orgs(req, res) {
        let octo = new octokat({
            username: req.body.username,
            password: req.body.password
        });

        octo.me.orgs.fetch(function(err, val) {
            if(err) {
                res.send({ err: err });
            } else {
                res.send(val);
            }
        });
    }

    /**
     * Compare
     * Compare two branches (base and head)
     */
    compare(req, res) {
        let url = '/repos/' + req.params.user + '/' + req.params.repo + '/compare/' + req.params.base + '...' + req.params.head;

        GitHub.apiCall(req, res, url);
    }

    /**
     * Repos
     * Get repos from user
     */
    repos(req, res) {
        let url = '/users/' + req.params.user + '/repos';

        GitHub.apiCall(req, res, url);
    }
    
    /**
     * Collaborators
     * List all collaborators on a given repository
     */
    collaborators(req, res) {
        let url = '/repos/' + req.params.user + '/' + req.params.repo + '/collaborators';

        GitHub.apiCall(req, res, url);
    }
    
    /**
     * Issues
     * Get/set issues with some needed preprocessing
     */
    issues(req, res) {
        let url = '/repos/' + req.params.user + '/' + req.params.repo + '/issues';
       
        if(!req.body.data) {
            req.body.data = {};
        }

        // Updating issues requires a number from the GitHub API
        if(req.params.mode == 'update') {
            url += '/' + req.body.data.number;
        }

        // Updating and creating issues takes different values than they send
        if(req.params.mode == 'update' || req.params.mode == 'create') {
            // Assignees require only a string
            if(req.body.data.assignee) {
                req.body.data.assignee = req.body.data.assignee.login;
            }

            // Milestones require a number
            if(req.body.data.milestone) {
                req.body.data.milestone = req.body.data.milestone.number;
            }
        }

        req.body.data.state = 'all';

        GitHub.apiCall(req, res, url);
    }
   
    /**
     * Refs
     * Get refs from a given repo
     */ 
    refs(req, res) {
        let url = '/repos/' + req.params.user + '/' + req.params.repo + '/git/refs';

        GitHub.apiCall(req, res, url);
    }
    
    /**
     * Tree
     * Get entire tree recursively from a given repository and branch
     */
    tree(req, res) {
        let refsUrl = '/repos/' + req.params.user + '/' + req.params.repo + '/git/refs';

        GitHub.apiCall(req, res, refsUrl, function(refs) {
            let sha = '';

            for(let ref of refs) {
                if(ref.ref == 'refs/heads/' + req.params.branch) {
                    sha = ref.object.sha;
                }
            }

            let treeUrl = '/repos/' + req.params.user + '/' + req.params.repo + '/git/trees/' + sha + '?recursive=1';

            GitHub.apiCall(req, res, treeUrl);
        });
    }
    
    /**
     * Labels
     * Get/set labels of a given repository
     */
    labels(req, res) {
        let url = '/repos/' + req.params.user + '/' + req.params.repo + '/labels';

        GitHub.apiCall(req, res, url);
    }
    
    /**
     * File
     * Get/set a file of a given repository
     */
    file(req, res) {
        let baseUrl = '/api/git/file/' + req.params.mode + '/' + req.params.user + '/' + req.params.repo + '/';
        let apiUrl = '/repos/' + req.params.user + '/' + req.params.repo + '/contents';
        let path = req.url.replace(baseUrl, '');
        let url = apiUrl + path;

        // GitHub needs a commit message and base64 encoded content
        if(req.params.mode == 'create' || req.params.mode == 'update') {
            req.body.data.content = new Buffer(req.body.content).toString('base64');
            req.body.data.comment = 'Committed by Putaitu CMS';
        }

        GitHub.apiCall(req, res, url, function(contents) {
            contents.content = new Buffer(contents.content, 'base64').toString();

            res.send(contents);
        });
    }
    
    /**
     * Milestones
     * Get/set milestones of a given repository
     */ 
    milestones(req, res) {
        let url = '/repos/' + req.params.user + '/' + req.params.repo + '/milestones';
        
        GitHub.apiCall(req, res, url);
    }
    
    /**
     * Repo
     * Get repository information
     */
    repo(req, res) {
        let url = '/repos/' + req.params.user + '/' + req.params.repo;
        
        GitHub.apiCall(req, res, url);
    }
    
    /**
     * Branches
     * Get/set branches of a given repository
     */
    branches(req, res) {
        let octo = new octokat({ token: req.body.buffer.token });
        let url = '/repos/' + req.params.user + '/' + req.params.repo + '/branches';

        octo.fromUrl(url).fetch(function(err, branches) {
            if(err) {
                res.send({ err: err });
            } else {
                let output = [];

                for(let i = 0; i < branches.length; i++) {
                    let branchUrl = url + '/' + branches[i].name;

                    octo.fromUrl(branchUrl).fetch(function(err, branch) {
                        branch.updated = branch.commit.commit.committer;
                        branch.updated.message = branch.commit.commit.message;

                        output.push(branch);

                        if(output.length == branches.length) {
                            res.send(output);
                        }
                    });
                }
            }
        });
    }
    
    /**
     * Merge
     * Merge two branches of a given repository
     */
    merge(req, res) {
        let url = '/repos/' + req.params.user + '/' + req.params.repo + '/merges';

        GitHub.apiCall(req, res, url);
    }
    
    /**
     * Content fetch
     */
    contentFetch(req, res) {
        let baseUrl = '/api/content/fetch/' + req.params.user + '/' + req.params.repo + '/' + req.params.branch + '/';
        let contentPath = req.url.replace(baseUrl, '');

        let logSrc = 'GitHub';
        let octo = new octokat({ token: req.body.buffer.token });

        let content = new Content();
    
        let sha = '';

        Debug.log('Start getting Content "' + contentPath + '"', logSrc);
       
        // Fetching content file, will be called once 
        function contentAsyncFunction() {
            return new Promise(function(callback) {
                let url = '/repos/' + req.params.user + '/' + req.params.repo + '/contents/_putaitu/content/' + contentPath + '.json';

                Debug.log2('Fetching Content "' + contentPath + '"...', logSrc);
                
                octo.fromUrl(url).fetch(function(err, file) {
                    if(!err) {
                        Debug.log2('Parsing JSON for Content "' + contentPath + '"...', logSrc)

                        let data = JSON.parse(new Buffer(file.content, file.encoding).toString());

                        sha = file.sha;

                        callback(data);
                    
                    } else {
                        Debug.log(err, logSrc, url);
                        
                        callback({});
                    
                    }
                });
            });
        }

        // Fetching struct files, may be called more than once 
        function structAsyncFunction(structPath) {
            return new Promise(function(callback) {

                let url = '/repos/' + req.params.user + '/' + req.params.repo + '/contents/_putaitu/structs/' + structPath + '.json';

                Debug.log2('Fetching Struct "' + structPath + '"...', logSrc);

                octo.fromUrl(url).fetch(function(err, file) {
                    if(!err) {
                        Debug.log2('Parsing JSON for Struct "' + structPath + '"...', logSrc)

                        let data = JSON.parse(new Buffer(file.content, file.encoding).toString());

                        callback(data);

                    } else {
                        Debug.error(err, logSrc);
                        callback({});

                    }
                });
            });
        }

        // Start the fetching process using the async fetching functions
        content.fetchAsync(contentAsyncFunction, structAsyncFunction)
            .then(function() {
                Debug.log('Done getting Content "' + contentPath + '"', logSrc);
                
                // Store sha in buffer
                content.buffer = { sha: sha };
                
                res.send(content);
            }).catch(Debug.error);
    }
    
    /**
     * Content publish
     */
    contentPublish(req, res) {
        let baseUrl = '/api/content/publish/' + req.params.user + '/' + req.params.repo + '/' + req.params.branch + '/';
        let contentPath = req.url.replace(baseUrl, '');
        let apiUrl = '/repos/' + req.params.user + '/' + req.params.repo + '/contents/content/' + contentPath + '.md';
        
        req.params.mode = 'create';
        
        GitHub.apiCall(req, res, contentPath);
    }
    
    /**
     * Content save
     */
    contentSave(req, res) {
        let baseUrl = '/api/content/save/' + req.params.user + '/' + req.params.repo + '/' + req.params.branch + '/';
        let contentPath = req.url.replace(baseUrl, '');
        let apiUrl = '/repos/' + req.params.user + '/' + req.params.repo + '/contents/_putaitu/content/' + contentPath + '.json';
        
        req.params.mode = 'create';

        Debug.log('Saving Content "' + contentPath + '"...', 'GitHub');

        req.body.data = {
            content: new Buffer(JSON.stringify(req.body.data)).toString('base64'),
            message: 'Content saved by Putaitu CMS'
        };

        GitHub.apiCall(req, res, apiUrl, function(file) {
            res.send(file.content);

            Debug.log('Done saving content "' + contentPath + '"', 'GitHub');
        });
    }

    /** 
     * Structs
     * Get/set structs
     */
    structs(req, res) {
        let baseUrl = '/api/structs/' + req.params.mode + '/' + req.params.user + '/' + req.params.repo + '/';
        let structPath = req.url.replace(baseUrl, '');
        
        // Get the default structs
        let page = require('../../src/structs/' + structPath + '.json');

        res.send(page);
    }
    
    /** 
     * Templates
     * Get/set templates
     */
    templates(req, res) {
        let baseUrl = '/api/templates/' + req.params.mode + '/' + req.params.user + '/' + req.params.repo + '/';
        let structPath = req.url.replace(baseUrl, '');
        
        // Get the default structs

        res.send(page);
    }

    /**
     * Redirect to repo
     */
    redir(req, res) {
        res.redirect('https://github.com/' + req.params.user + '/' + req.params.repo + '/tree/' + req.params.branch);
    }
}

module.exports = GitHub;
