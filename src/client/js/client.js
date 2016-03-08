'use strict';

// Libraries
require('putaitu.js');
window.$ = window.jQuery = require('jquery');
require('bootstrap');

// Views
let NavbarMain = require('./views/NavbarMain');
let JSONEditor = require('./views/JSONEditor');
let PageEditor = require('./views/PageEditor');

// -----------
// Persistent views
// -----------
let navbarMain = new NavbarMain();

// -----------
// Routes
// -----------
// Page edit
Router.route('/jsoneditor/pages/:id', function() {
    let pageEditor = new PageEditor({
        modelUrl: '/api/pages/' + this.id
    });
   
    navbarMain.showTab('pages');
    
    $('.workspace').html(pageEditor.$element);
});

// Object schema edit
Router.route('/jsoneditor/objectSchemas/:id', function() {
    let jsonEditor = new JSONEditor({
        modelUrl: '/api/objectSchemas/' + this.id
    });
    
    navbarMain.showTab('objectSchemas');
    
    $('.workspace').html(jsonEditor.$element);
});

// Field schema edit
Router.route('/jsoneditor/fieldSchemas/:id', function() {
    let jsonEditor = new JSONEditor({
        modelUrl: '/api/fieldSchemas/' + this.id
    });
    
    navbarMain.showTab('fieldSchemas');

    $('.workspace').html(jsonEditor.$element);
});

Router.init();
