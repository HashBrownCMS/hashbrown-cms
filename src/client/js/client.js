'use strict';

// Libraries
require('putaitu.js');
window.$ = window.jQuery = require('jquery');
require('bootstrap');

// Views
let JSONEditor = require('./views/JSONEditor');

Router.route('/jsoneditor/page/:id', function() {
    let jsonEditor = new JSONEditor({
        modelUrl: '/api/content/page/' + this.id
    });
    
    $('body').html(jsonEditor.$element);
});

Router.init();
