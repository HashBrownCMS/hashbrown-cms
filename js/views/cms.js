window.page = require('page');

require('../client');
require('./partials/navbar');

let Tree = require('./partials/cms-tree');
let Editor = require('./partials/cms-editor');

class CMS extends View {
    constructor(args) {
        super(args);

        this.initRoutes();
        this.init();
    }

    initRoutes() {
        page.base('/repos/' + req.params.user + '/' + req.params.repo + '/' + req.params.branch + '/cms');
        
        // Pages
        page('/pages/:path', function(ctx) {
            api.file.fetch(ctx.path, function(content) {
                ViewHelper.get('Editor').open(content);
            });
        });
        
        // Media
        page('/media/:path', function() {
            console.log(req.params);
        });
    }

    render() {
        $('.page-content').html(
            _.div({class: 'container'}, [
                new Tree().$element,
                new Editor().$element
            ])
        );

        // Start router
        page();
    }
}

new CMS();
