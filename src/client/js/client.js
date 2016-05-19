'use strict';

// Libraries
require('exomon');
let jade = require('jade');
let Promise = require('bluebird');

// Views
let NavbarMain = require('./views/NavbarMain');
let JSONEditor = require('./views/JSONEditor');
let ContentEditor = require('./views/ContentEditor');
let ConnectionEditor = require('./views/ConnectionEditor');
let SchemaEditor = require('./views/SchemaEditor');
let MediaViewer = require('./views/MediaViewer');

// Helper function
require('./helpers');

// -----------
// Preload resources 
// -----------
window.resources = {
    editors: {},
    connections: {},
    connectionEditors: {},
    content: [],
    schemas: [],
    media: [],
};

window.reloadAllResources()
.then(function() {
    triggerReady('resources');
});


// -----------
// Language
// -----------
window.language = localStorage.getItem('language') || 'en';

// -----------
// CMS
// -----------
// About
Router.route('/about/', function() {
    ViewHelper.get('NavbarMain').highlightItem('about');

    $('.workspace').html(
        _.div({class: 'dashboard-container'},
            _.h1('Endomon'),
            _.p('The pluggable CMS')
        )
    );
});

// ----------
// Content
// ----------
// Dashboard
Router.route('/content/', function() {
    ViewHelper.get('NavbarMain').showTab('/content/');
    
    $('.workspace').html(
        _.div({class: 'dashboard-container'},
            _.h1('Content dashboard'),
            _.p('Please click on a content node to proceed')
        )
    );
});

// Edit
Router.route('/content/:id', function() {
    let contentEditor = new ContentEditor({
        modelUrl: '/api/content/' + this.id
    });
   
    ViewHelper.get('NavbarMain').highlightItem(this.id);
    
    $('.workspace').html(contentEditor.$element);
});

// Edit (JSON editor)
Router.route('/content/json/:id', function() {
    let contentEditor = new JSONEditor({
        modelUrl: '/api/content/' + this.id
    });
     
    ViewHelper.get('NavbarMain').highlightItem(this.id);
    
    $('.workspace').html(contentEditor.$element);
});

// ----------
// Connections
// ----------
// Dashboard
Router.route('/connections/', function() {
    ViewHelper.get('NavbarMain').showTab('/connections/');
    
    $('.workspace').html(
        _.div({class: 'dashboard-container'},
            _.h1('Connections dashboard'),
            _.p('Please click on a connection to proceed')
        )
    );
});

// Edit
Router.route('/connections/:id', function() {
    let connectionEditor = new ConnectionEditor({
        modelUrl: '/api/connections/' + this.id
    });
   
    ViewHelper.get('NavbarMain').highlightItem(this.id);
    
    $('.workspace').html(connectionEditor.$element);
});

// Edit (JSON editor)
Router.route('/connections/json/:id', function() {
    let connectionEditor = new JSONEditor({
        modelUrl: '/api/connections/' + this.id
    });
     
    ViewHelper.get('NavbarMain').highlightItem(this.id);
    
    $('.workspace').html(connectionEditor.$element);
});

// ----------
// Media
// ----------
// Dashboard
Router.route('/media/', function() {
    ViewHelper.get('NavbarMain').showTab('/media/');
    
    $('.workspace').html(
        _.div({class: 'dashboard-container'},
            _.h1('Media dashboard'),
            _.p('Please click on a media object to proceed')
        )
    );
});

// Preview
Router.route('/media/:id', function() {
    let mediaViewer = new MediaViewer({
        mediaId: this.id
    });
    
    ViewHelper.get('NavbarMain').highlightItem(this.id);
    
    $('.workspace').html(mediaViewer.$element);
});

// ----------
// Schemas
// ----------
// Dashboard
Router.route('/schemas/', function() {
    ViewHelper.get('NavbarMain').showTab('/schemas/');
    
    $('.workspace').html(
        _.div({class: 'dashboard-container'},
            _.h1('Schemas dashboard'),
            _.p('Please click on a schema to proceed')
        )
    );
});

// Edit
Router.route('/schemas/:id', function() {
    let schemaEditor = new SchemaEditor({
        modelUrl: '/api/schemas/' + this.id
    });
    
    ViewHelper.get('NavbarMain').highlightItem(this.id);
    
    $('.workspace').html(schemaEditor.$element);
});

// Edit (JSON editor)
Router.route('/schemas/json/:id', function() {
    let jsonEditor = new JSONEditor({
        modelUrl: '/api/schemas/' + this.id
    });
    
    ViewHelper.get('NavbarMain').highlightItem(this.id);
    
    $('.workspace').html(jsonEditor.$element);
});

// ----------
// Settings
// ----------
Router.route('/settings/', function() {
    ViewHelper.get('NavbarMain').showTab('/settings/');
    
    $('.workspace').html(
        _.div({class: 'dashboard-container'},
            _.h1('Settings dashboard'),
            _.p('Please click on a settings item to proceed')
        )
    );
});

// ----------
// Init
// ----------
onReady('resources', function() {
    new NavbarMain();

    Router.init();
});
