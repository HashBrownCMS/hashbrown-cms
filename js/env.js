let Debug = require('../src/helpers/debug');

window.env = {
    json: null,
    sha: null,

    get: function(callback) {
        if(env.json) {
            callback(env.json);
        } else {
            api.file.fetch('/_env.json', function(content, sha) {
                let json = {};
                
                try {
                    json = JSON.parse(content);
                } catch(e) {
                    Debug.log(e, 'env');    
                }
               
                json.putaitu = json.putaitu || {};
                json.putaitu.issues = json.putaitu.issues || {};
                json.putaitu.issues.columns = json.putaitu.issues.columns || [];

                env.json = json;
                env.sha = sha;

                callback(env.json);
            });
        }
    },

    set: function(json, callback) {
        json = json || env.json;

        let contents = {
            content: btoa(JSON.stringify(json)),
            sha: env.sha,
            comment: 'Updating env.json'
        };

        api.file.create(contents, '/_env.json', function() { 
            env.json = json;

            if(callback) {
                callback();
            }
        });
    }
};
