require('./core/Templating');
require('./core/View');

require('./helper');
require('./api');

window.env = {
    json: null,
    sha: null,

    get: function(callback) {
        if(env.json) {
            callback(env.json);
        } else {
            api.file.fetch('/env.json', function(contents) {
                var json = '{}';
                
                try {
                    json = atob(contents.content);
                } catch(e) {
                    console.log(e);
                    console.log(contents);
                }

                json = JSON.parse(json) || {};
                json.putaitu = json.putaitu || {};
                json.putaitu.issues = json.putaitu.issues || {};
                json.putaitu.issues.columns = json.putaitu.issues.columns || [];

                env.json = json;
                env.sha = contents.sha;

                callback(env.json);
            });
        }
    },

    set: function(json, callback) {
        json = json || env.json;

        var contents = {
            content: btoa(JSON.stringify(json)),
            sha: env.sha,
            comment: 'Updating env.json'
        };

        api.file.create(contents, '/env.json', function() { 
            env.json = json;

            if(callback) {
                callback();
            }
        });
    }
};
