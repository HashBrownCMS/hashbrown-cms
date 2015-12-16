'use strict';

let yamljs = require('yamljs');

class Jekyll {
    constructor(controller) {
        controller.hook('post', '/api/content/bake/', this.bake);
    }

    /**
     * Bake
     * Converts content from JSON to YAML
     */
    bake(req, res) {
        let model = req.body;

        if(model.token) {
            delete model.token;
        }

        // The "permalink" key is used in Jekyll instead of "url"
        model.permalink = model.url;
        delete model.url;

        let yml = yamljs.stringify(model);

        yml = '---\n' + yml + '\n---';

        res.send(yml);
    }
}

module.exports = Jekyll;
