'use strict';

// Libraries
require('exomon');
let jade = require('jade');
let Promise = require('bluebird');

// Views
let NavbarMain = require('./views/NavbarMain');
let JSONEditor = require('./views/JSONEditor');
let ContentEditor = require('./views/ContentEditor');
let SchemaEditor = require('./views/SchemaEditor');
let MediaViewer = require('./views/MediaViewer');

// Helper function
require('./helpers');

// -----------
// Preload resources 
// -----------
window.resources = {
    editors: [],
    content: [],
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
// Content dashboard
Router.route('/content/', function() {
    ViewHelper.get('NavbarMain').showTab('/content/');
    
    $('.workspace').html(
        _.div({class: 'dashboard-container'}, [
            _.h1('Content dashboard'),
            _.p('Please click on a content node to proceed')
        ])
    );
});

// Content edit
Router.route('/content/:id', function() {
    let contentEditor = new ContentEditor({
        modelUrl: '/api/content/' + this.id
    });
   
    ViewHelper.get('NavbarMain').highlightItem(this.id);
    
    $('.workspace').html(contentEditor.$element);
});

// Content edit (JSON editor)
Router.route('/content/json/:id', function() {
    let contentEditor = new JSONEditor({
        modelUrl: '/api/content/' + this.id
    });
     
    ViewHelper.get('NavbarMain').highlightItem(this.id);
    
    $('.workspace').html(contentEditor.$element);
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
