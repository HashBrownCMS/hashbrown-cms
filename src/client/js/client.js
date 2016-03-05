'use strict';

// Libraries
require('putaitu.js');
window.$ = window.jQuery = require('jquery');
require('bootstrap');

// Views
let JSONEditor = require('./views/JSONEditor');

Router.route('/jsoneditor/page/:id', function() {
    alert(this.id);
    $('body').html(new JSONEditor({
        modelUrl: '/api/content/page/' + this.id
    }).$element);
});

Router.init();
