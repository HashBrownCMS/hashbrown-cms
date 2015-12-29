let Debug = require('../../helpers/debug');

window.env = {
    remote: null,
    local: require('../../../env.json'),

    /** 
     * Get remote env.json
     */
    get: function(callback) {
        if(env.remote && env.remote.json) {
            callback(env.remote.json);
        } else {
            api.file.fetch('/_putaitu/env.json', function(data) {
                let json = {};
                
                try {
                    json = JSON.parse(data.content);
                } catch(e) {
                    Debug.log(e, 'env');    
                }
               
                json.putaitu = json.putaitu || {};
                json.putaitu.issues = json.putaitu.issues || {};
                json.putaitu.issues.columns = json.putaitu.issues.columns || [];

                env.remote = json;

                callback(env.remote);
            });
        }
    },

    /** 
     * Set remote env.json
     */
    set: function(json, callback) {
        json = json || env.json;

        let data = {
            content: JSON.stringify(json),
        };

        api.file.create(data, '/_putaitu/env.json', function() { 
            env.json = json;

            if(callback) {
                callback();
            }
        });
    }
};
