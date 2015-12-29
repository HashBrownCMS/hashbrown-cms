'use strict';

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
        // Pages
        Router.route('/content/:path*', function() {
            ViewHelper.get('Editor').openAsync(this.path);
        });

        // Media
        Router.route('/media/:path*', function() {
            console.log(this.path);
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
        Router.init();
    }
}

new CMS();
