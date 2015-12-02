window._ = require('./core/Templating');

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
    call: function(url, callback) {
        $.post(url, { token: localStorage.getItem('gh-oauth-token') }, function(res) {
            if(res.err) {
                console.log(res.err);
                alert(res.err.json.message);
            } else {
                callback(res);
            }
        });
    },

    repos: function(user, callback) {
        api.call('/api/' + user + '/repos/', callback);
    },

    merge: function(user, repo, base, head, callback) {
        api.call('/api/' + user + '/' + repo + '/merge/' + base + '/' + head, callback);
    },

    collaborators: function(user, repo, callback) {
        api.call('/api/' + user + '/' + repo + '/collaborators', callback);
    },

    repo: function(user, repo, callback) {
        api.call('/api/' + user + '/' + repo, callback);
    },

    branches: function(user, repo, callback) {
        api.call('/api/' + user + '/' + repo + '/branches/', callback);
    }
};
