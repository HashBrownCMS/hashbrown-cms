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
Router.route('/pages/:id', function() {
    let pageEditor = new PageEditor({
        modelUrl: '/api/pages/' + this.id
    });
   
    navbarMain.showTab('pages');
    
    $('.workspace').html(pageEditor.$element);
});

// Page edit (JSON editor)
Router.route('/pages/json/:id', function() {
    let pageEditor = new JSONEditor({
        modelUrl: '/api/pages/' + this.id
    });
   
    navbarMain.showTab('pages');
    
    $('.workspace').html(pageEditor.$element);
});

// Schema edit
Router.route('/schemas/:id', function() {
    let jsonEditor = new JSONEditor({
        modelUrl: '/api/schemas/' + this.id
    });
    
    navbarMain.showTab('schemas');
    
    $('.workspace').html(jsonEditor.$element);
});

Router.init();
