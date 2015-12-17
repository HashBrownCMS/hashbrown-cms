let Debug = require('../src/helpers/debug');

window.env = {
    json: null,

    get: function(callback) {
        if(env.json) {
            callback(env.json);
        } else {
            api.file.fetch('/_env.json', function(data) {
                let json = {};
                
                try {
                    json = JSON.parse(data.content);
                } catch(e) {
                    Debug.log(e, 'env');    
                }
               
                json.putaitu = json.putaitu || {};
                json.putaitu.issues = json.putaitu.issues || {};
                json.putaitu.issues.columns = json.putaitu.issues.columns || [];

                env.json = json;

                callback(env.json);
            });
        }
    },

    set: function(json, callback) {
        json = json || env.json;

        let data = {
            content: JSON.stringify(json),
        };

        api.file.create(data, '/_env.json', function() { 
            env.json = json;

            if(callback) {
                callback();
            }
        });
    }
};
