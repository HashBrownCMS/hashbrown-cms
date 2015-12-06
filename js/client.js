window._ = require('./core/Templating');
window.View = require('./core/View');

window.env = {
    json: null,

    get: function(callback) {
        if(env.json) {
            callback(env.json);
        } else {
            api.getFile('env.json', function(json) {
                json = JSON.parse(json) || {};
                json.putaitu = json.putaitu || {};
                json.putaitu.issues = json.putaitu.issues || {};
                json.putaitu.issues.columns = json.putaitu.issues.columns || [];

                env.json = json;

                callback(env.json);
            });
        }
    },

    set: function(json, callback) {
        api.setFile(JSON.stringify(json), 'env.json', function() { 
            env.json = json;

            callback();
        });
    }
};

window.helper = {
    formatDate: function(input) {
        var date = new Date(input);
        var output =
            date.getFullYear() +
            '-' +
            date.getMonth() +
            '-' +
            date.getDate() +
            ' ' +
            date.getHours() +
            ':' +
            date.getMinutes() +
            ':' +
            date.getSeconds();

        return output;
    }
};

window.api = {
    call: function(url, callback, data) {
        data = data || {};
        
        data.token = localStorage.getItem('gh-oauth-token');

        $.post(url, data, function(res) {
            if(res.err) {
                console.log(res.err);
                alert(res.err.json.message);
            } else {
                callback(res);
            }
        });
    },

    repos: function(callback) {
        api.call('/api/' + req.params.user + '/repos/', callback);
    },

    compare: function(base, head, callback) {
        api.call('/api/' + req.params.user + '/' + req.params.repo + '/compare/' + base + '/' + head, callback);
    },

    merge: function(base, head, callback) {
        api.call('/api/' + req.params.user + '/' + req.params.repo + '/merge/' + base + '/' + head, callback);
    },
    
    getFile: function(path, callback) {
        api.call('/api/' + req.params.user + '/' + req.params.repo + '/file/get/' + path, callback);
    },
    
    setFile: function(data, path, callback) {
        api.call('/api/' + req.params.user + '/' + req.params.repo + '/file/set/' + path, callback, data);
    },

    issues: function(callback) {
        api.call('/api/' + req.params.user + '/' + req.params.repo + '/issues', callback);
    },
    
    issueColumns: function(callback) {
        env.get(function(json) {
            var columns = json.putaitu.issues.columns;

            columns.unshift('backlog');
            columns.push('done');
                
            callback(columns);
        });
    },

    milestones: function(callback) {
        api.call('/api/' + req.params.user + '/' + req.params.repo + '/milestones', callback);
    },

    collaborators: function(callback) {
        api.call('/api/' + req.params.user + '/' + req.params.repo + '/collaborators', callback);
    },

    repo: function(callback) {
        api.call('/api/' + req.params.user + '/' + req.params.repo, callback);
    },

    branches: function(callback) {
        api.call('/api/' + req.params.user + '/' + req.params.repo + '/branches/', function(branches) {
            branches.sort(function(a, b) {
                if (a.name < b.name) {
                    return -1;
                } else if (a.name > b.name) {
                    return 1;
                } else {
                    return 0;   
                }
            });

            callback(branches);
        });
    }
};
