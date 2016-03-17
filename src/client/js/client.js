'use strict';

// Libraries
require('exomon');
let jade = require('jade');
let Promise = require('bluebird');

// Views
let NavbarMain = require('./views/NavbarMain');
let JSONEditor = require('./views/JSONEditor');
let PageEditor = require('./views/PageEditor');
let SchemaEditor = require('./views/SchemaEditor');
let MediaViewer = require('./views/MediaViewer');

// Helper function
require('./helpers');

// -----------
// Preload resources 
// -----------
window.resources = {
    editors: [],
    pages: [],
    sections: [],
    schemas: [],
    media: []
};

window.reloadAllResources()
.then(function() {
    triggerReady('resources');
});


// -----------
// Routes
// -----------
// Page dashboard
Router.route('/pages/', function() {
    ViewHelper.get('NavbarMain').showTab('/pages/');
    
    $('.workspace').html(
        _.div({class: 'dashboard-container'}, [
            _.h1('Pages dashboard'),
            _.p('Please click on a page to proceed')
        ])
    );
});

// Page edit
Router.route('/pages/:id', function() {
    let pageEditor = new PageEditor({
        modelUrl: '/api/pages/' + this.id
    });
   
    ViewHelper.get('NavbarMain').highlightItem(this.id);
    
    $('.workspace').html(pageEditor.$element);
});

// Page edit (JSON editor)
Router.route('/pages/json/:id', function() {
    let pageEditor = new JSONEditor({
        modelUrl: '/api/pages/' + this.id
    });
     
    ViewHelper.get('NavbarMain').highlightItem(this.id);
    
    $('.workspace').html(pageEditor.$element);
});

// Schema edit
Router.route('/schemas/:id', function() {
    let schemaEditor = new SchemaEditor({
        modelUrl: '/api/schemas/' + this.id
    });
    
    ViewHelper.get('NavbarMain').highlightItem(this.id);
    
    $('.workspace').html(schemaEditor.$element);
});

// Schema edit (JSON editor)
Router.route('/schemas/json/:id', function() {
    let jsonEditor = new JSONEditor({
        modelUrl: '/api/schemas/' + this.id
    });
    
    ViewHelper.get('NavbarMain').highlightItem(this.id);
    
    $('.workspace').html(jsonEditor.$element);
});

// Media preview
Router.route('/media/:id', function() {
    let mediaViewer = new MediaViewer({
        mediaId: this.id
    });
    
    ViewHelper.get('NavbarMain').highlightItem(this.id);
    
    $('.workspace').html(mediaViewer.$element);
});

// Media dashboard
Router.route('/media/', function() {
    ViewHelper.get('NavbarMain').showTab('/media/');
    
    $('.workspace').html(
        _.div({class: 'dashboard-container'}, [
            _.h1('Media dashboard'),
            _.p('Please click on a media object to proceed')
        ])
    );
});

// ----------
// Init
// ----------
onReady('resources', function() {
    new NavbarMain();

    Router.init();
});
