/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 26);
/******/ })
/************************************************************************/
/******/ ({

/***/ 26:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


__webpack_require__(27);
__webpack_require__(28);
__webpack_require__(29);
__webpack_require__(30);
__webpack_require__(31);


/***/ }),

/***/ 27:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// Root reroute
Crisp.Router.route('/', () => {
    Crisp.Router.go('/content/');
});

// Dashboard
Crisp.Router.route('/content/', () => {
    Crisp.View.get('NavbarMain').showTab('/content/');

    UI.setEditorSpaceContent(
        [
            _.h1('Content'),
            _.p('Right click in the Content pane to create new Content.'),
            _.p('Click on a Content node to edit it.'),
            _.button({class: 'widget widget--button'}, 'New Content')
                .click(() => { HashBrown.Views.Navigation.ContentPane.onClickNewContent(); }),
            _.button({class: 'widget widget--button'}, 'Quick tour')
                .click(HashBrown.Helpers.ContentHelper.startTour),
            _.button({class: 'widget widget--button condensed', title: 'Click here to get some example content'}, 'Get example content')
                .click(() => {
                    HashBrown.Helpers.RequestHelper.request('post', 'content/example')
                    .then(() => {
                        location.reload();
                    })
                    .catch(UI.errorModal);
                })
        ],
        'text'
    );
});

// Edit (JSON editor)
Crisp.Router.route('/content/json/:id', () => {
    Crisp.View.get('NavbarMain').highlightItem('/content/', Crisp.Router.params.id);
    
    let contentEditor = new HashBrown.Views.Editors.JSONEditor({
        modelUrl: HashBrown.Helpers.RequestHelper.environmentUrl('content/' + Crisp.Router.params.id),
        apiPath: 'content/' + Crisp.Router.params.id
    });

    UI.setEditorSpaceContent(contentEditor.$element);
});

// Edit (redirect to default tab)
Crisp.Router.route('/content/:id', async () => {
    let content = await HashBrown.Helpers.ContentHelper.getContentById(Crisp.Router.params.id);
    
    if(content) {
        let contentSchema = await HashBrown.Helpers.SchemaHelper.getSchemaById(content.schemaId);

        if(contentSchema) {
            location.hash = '/content/' + Crisp.Router.params.id + '/' + (contentSchema.defaultTabId || 'meta');
        
        } else {
            UI.errorModal(new Error('Schema by id "' + content.schemaId + '" not found'), () => { location.hash = '/content/json/' + Crisp.Router.params.id; });

        }
    
    } else {
        UI.errorModal(new Error('Content by id "' + Crisp.Router.params.id + '" not found'));

    }
});

// Edit (with tab specified)
Crisp.Router.route('/content/:id/:tab', () => {
    let id = Crisp.Router.params.id;

    Crisp.View.get('NavbarMain').highlightItem('/content/', id);

    let contentEditor = Crisp.View.get('ContentEditor');

    if(!contentEditor) {
        contentEditor = new HashBrown.Views.Editors.ContentEditor(id);
        UI.setEditorSpaceContent(contentEditor.$element);
   
    } else if(!contentEditor.model || contentEditor.model.id !== id) {
        contentEditor.remove();

        contentEditor = new HashBrown.Views.Editors.ContentEditor(id);
        UI.setEditorSpaceContent(contentEditor.$element);
    
    } else {
        contentEditor.fetch(id);

    }
});



/***/ }),

/***/ 28:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// Dashboard
Crisp.Router.route('/connections/', function() {
    if(currentUserHasScope('connections')) {
        Crisp.View.get('NavbarMain').showTab('/connections/');
        
        UI.setEditorSpaceContent(
            [
                _.h1('Connections'),
                _.p('Right click in the Connections pane to create a new Connection.'),
                _.p('Click on a Connection to edit it.'),
                _.button({class: 'widget widget--button'}, 'New Connection')
                    .click(() => { HashBrown.Views.Navigation.ConnectionPane.onClickNewConnection(); }),
            ],
            'text'
        );
    
    } else {
        location.hash = '/';

    }
});

// Edit
Crisp.Router.route('/connections/:id', function() {
    if(currentUserHasScope('connections')) {
        let connectionEditor = new HashBrown.Views.Editors.ConnectionEditor({
            modelUrl: HashBrown.Helpers.RequestHelper.environmentUrl('connections/' + this.id)
        });
       
        Crisp.View.get('NavbarMain').highlightItem('/connections/', this.id);
        
        UI.setEditorSpaceContent(connectionEditor.$element);
    
    } else {
        location.hash = '/';

    }
});

// Edit (JSON editor)
Crisp.Router.route('/connections/json/:id', function() {
    if(currentUserHasScope('connections')) {
        let connectionEditor = new HashBrown.Views.Editors.JSONEditor({
            apiPath: 'connections/' + this.id
        });
         
        Crisp.View.get('NavbarMain').highlightItem('/connections/', this.id);
        
        UI.setEditorSpaceContent(connectionEditor.$element);
    
    } else {
        location.hash = '/';

    }
});


/***/ }),

/***/ 29:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// Dashboard
Crisp.Router.route('/media/', function() {
    Crisp.View.get('NavbarMain').showTab('/media/');
    
    UI.setEditorSpaceContent(
        [
            _.h1('Media'),
            _.p('Right click in the Media pane to upload, edit and sort Media items.'),
            _.button({class: 'widget widget--button'}, 'Upload media')
                .click(() => {
                    new HashBrown.Views.Modals.MediaUploader({
                        onSuccess: (ids) => {
                            // We got one id back
                            if(typeof ids === 'string') {
                                location.hash = '/media/' + ids;

                            // We got several ids back
                            } else {
                                location.hash = '/media/' + ids[0];
                            
                            }
                        }
                    });
                })
        ],
        'text'
    );
});

// Preview
Crisp.Router.route('/media/:id', function() {
    let mediaViewer = new HashBrown.Views.Editors.MediaViewer({
        modelUrl: HashBrown.Helpers.RequestHelper.environmentUrl('media/' + this.id)
    });
    
    Crisp.View.get('NavbarMain').highlightItem('/media/', this.id);
    
    UI.setEditorSpaceContent(mediaViewer.$element);
});


/***/ }),

/***/ 30:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// Dashboard
Crisp.Router.route('/schemas/', function() {
    if(currentUserHasScope('schemas')) {
        Crisp.View.get('NavbarMain').showTab('/schemas/');
        
        UI.setEditorSpaceContent(
            [
                _.h1('Schemas'),
                _.p('Right click in the Schemas pane to create a new Schema.'),
                _.p('Click on a Schema to edit it.')
            ],
            'text'
        );
    
    } else {
        location.hash = '/';

    }
});

// Edit
Crisp.Router.route('/schemas/:id', () => {
    if(currentUserHasScope('schemas')) {
        let schema;
        let parentSchema;

        Crisp.View.get('NavbarMain').highlightItem('/schemas/', Crisp.Router.params.id);
       
        // First get the Schema model
        HashBrown.Helpers.SchemaHelper.getSchemaById(Crisp.Router.params.id)
        .then((result) => {
            schema = HashBrown.Helpers.SchemaHelper.getModel(result);

            // Then get the parent Schema, if available
            if(schema.parentSchemaId) {
                return HashBrown.Helpers.SchemaHelper.getSchemaWithParentFields(schema.parentSchemaId);
            }
    
            return Promise.resolve(null);
        })
        .then((result) => {
            if(result) {
                parentSchema = HashBrown.Helpers.SchemaHelper.getModel(result);
            }

            let schemaEditor;

            if(schema instanceof HashBrown.Models.ContentSchema) {
                schemaEditor = new HashBrown.Views.Editors.ContentSchemaEditor({
                    model: schema,
                    parentSchema: parentSchema
                });
            } else {
                schemaEditor = new HashBrown.Views.Editors.FieldSchemaEditor({
                    model: schema,
                    parentSchema: parentSchema
                });
            }
            
            UI.setEditorSpaceContent(schemaEditor.$element);
        });
            
    } else {
        location.hash = '/';

    }
});

// Edit (JSON editor)
Crisp.Router.route('/schemas/json/:id', function() {
    if(currentUserHasScope('schemas')) {
        let jsonEditor = new HashBrown.Views.Editors.JSONEditor({
            modelUrl: HashBrown.Helpers.RequestHelper.environmentUrl('schemas/' + this.id),
            apiPath: 'schemas/' + this.id,
            onSuccess: () => {
                let navbar = Crisp.View.get('NavbarMain');
                navbar.reload();
            }
        });

        Crisp.View.get('NavbarMain').highlightItem('/schemas/', this.id);
        
        UI.setEditorSpaceContent(jsonEditor.$element);
    
    } else {
        location.hash = '/';

    }
});


/***/ }),

/***/ 31:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// Dashboard
Crisp.Router.route('/forms/', function() {
    Crisp.View.get('NavbarMain').showTab('/forms/');
    
    UI.setEditorSpaceContent(
        [
            _.h1('Forms'),
            _.p('Right click in the Forms pane to create a new Form.'),
            _.p('Click on a Form to edit it.'),
            _.button({class: 'widget widget--button'}, 'New Form')
                .click(() => { HashBrown.Views.Navigation.FormsPane.onClickNewForm(); }),
        ],
        'text'
    );
});

// Edit
Crisp.Router.route('/forms/:id', function() {
    Crisp.View.get('NavbarMain').highlightItem('/forms/', this.id);
    
    let formEditor = new HashBrown.Views.Editors.FormEditor({
        modelUrl: HashBrown.Helpers.RequestHelper.environmentUrl('forms/' + this.id)
    });
   
    UI.setEditorSpaceContent(formEditor.$element);
});

// Edit (JSON editor)
Crisp.Router.route('/forms/json/:id', function() {
    let formEditor = new HashBrown.Views.Editors.JSONEditor({
        modelUrl: HashBrown.Helpers.RequestHelper.environmentUrl('forms/' + this.id),
        apiPath: 'forms/' + this.id
    });
     
    Crisp.View.get('NavbarMain').highlightItem('/forms/', this.id);
    
    UI.setEditorSpaceContent(formEditor.$element);
});


/***/ })

/******/ });
//# sourceMappingURL=routes.js.map