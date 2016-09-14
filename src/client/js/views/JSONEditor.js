'use strict';

// Lib
let beautify = require('js-beautify').js_beautify;

// Views
let MessageModal = require('./MessageModal');

/**
 * A basic JSON editor for any object
 */
class JSONEditor extends View {
    constructor(params) {
        super(params);

        this.$element = _.div({class: 'json-editor editor flex-vertical'});
        this.$error = _.div({class: 'panel panel-danger'},
            _.div({class: 'panel-heading'}),
            _.div({class: 'panel-body'})
        ).hide();

        if(!this.model && !this.modelUrl) {
            this.modelUrl = apiUrl(this.apiPath);
        }

        this.fetch();
    }

    /**
     * Event: Successful API call
     */
    onSuccess() {
    
    }

    /**
     * Event: Failed API call
     */
    onError(e) {
        alert(e);
    }

    /**
     * Event: Click basic. Returns to the regular editor
     */
    onClickBasic() {
        let url = $('.navbar-main .pane-container.active .pane-item-container.active .pane-item').attr('href');
    
        if(url) {
            location = url;
        } else {
            debug.log('Invalid url "' + url + '"', this);
        }
    }

    /**
     * Event: Click save. Posts the model to the apiPath
     */
    onClickSave() {
        let view = this;

        if(this.debug()) {
            apiCall('post', this.apiPath, this.model)
            .then(this.onSuccess)
            .catch(this.onError);
       
        } else {
            new MessageModal({
                model: {
                    title: 'Unable to save',
                    body: 'Please refer to the error prompt for details'
                }
            });

        }
    }

    /**
     * Event: Click beautify button
     */
    onClickBeautify() {
        try {
            this.value = beautify(this.value);
            this.$element.find('textarea').val(this.value);
        
        } catch(e) {
            this.$error.children('.panel-heading').html('JSON error');
            this.$error.children('.panel-body').html(e);
            this.$error.show();

        }
    }

    /**
     * Debug the JSON string
     */
    debug() {
        let isValid = true;
        
        // Function for checking model integrity
        let check = (k, v) => {
            switch(k) {
                case 'schemaId': case 'parentSchemaId':
                    for(let id in resources.schemas) {
                        if(id == v) {
                            return;
                        }
                    }   

                    return 'Schema "' + v + '" not found';
               
                case 'schemaBindings': case 'allowedSchemas': case 'allowedChildSchemas':
                    let invalidSchemas = v.slice(0);
                    
                    for(let r in resources.schemas) {
                        let schema = resources.schemas[r];
                        
                        for(let b = invalidSchemas.length - 1; b >= 0; b--) {
                            if(schema.id == invalidSchemas[b]) {
                                invalidSchemas.splice(b, 1);
                            }
                        }   
                    }

                    if(invalidSchemas.length > 0) {
                        if(invalidSchemas.length == 1) {
                            return 'Schema "' + invalidSchemas[0] + '" not found';
                        } else {
                            return 'Schemas "' + invalidSchemas.join(', ') + '" not found';
                        }
                    }

                    break;
                    
                case 'connections':
                    let invalidConnections = v.slice(0);
                    
                    for(let r in resources.connections) {
                        let connection = resources.connections[r];

                        for(let c = invalidConnections.length - 1; c >= 0; c--) {
                            if(connection.id == invalidConnections[c]) {
                                invalidConnections.splice(c, 1);
                            }
                        }   
                    }

                    if(invalidConnections.length > 0) {
                        if(invalidConnections.length == 1) {
                            return 'Connection "' + invalidConnections[0] + '" not found';
                        } else {
                            return 'Connections "' + invalidConnections.join(', ') + '" not found';
                        }
                    }

                    break;

                case 'template':
                    if(typeof v === 'string') {
                        for(let id of resources.templates) {
                            if(id == v) {
                                return;
                            }
                        }   
                        
                        for(let id of resources.sectionTemplates) {
                            if(id == v) {
                                return;
                            }
                        }   

                        return 'Template "' + v + '" not found';
                    }

                    break;

                case 'config':
                    if(v.allowedTemplates) {
                        let invalidTemplates = v.allowedTemplates.slice(0);
                        let resource = resources[(v.resource || 'templates')];

                        for(let r in resource) {
                            for(let a = invalidTemplates.length - 1; a >= 0; a--) {
                                if(resource[r] == invalidTemplates[a]) {
                                    invalidTemplates.splice(a, 1);
                                }
                            }   
                        }

                        if(invalidTemplates.length > 0) {
                            if(invalidTemplates.length == 1) {
                                return 'Template "' + invalidTemplates[0] + '" not found';
                            } else {
                                return 'Templates "' + invalidTemplates.join(', ') + '" not found';
                            }
                        }
                    }

                    break;
            }

            return;
        };

        // Function for recursing through object
        let recurse = (obj) => {
            if(obj instanceof Object) {
                for(let k in obj) {
                    let v = obj[k];

                    let failMessage = check(k, v);
                    
                    if(failMessage) {
                        this.$error.children('.panel-heading').html('Schema error');
                        this.$error.children('.panel-body').html(failMessage);
                        this.$error.show();
                    
                        isValid = false;
                    };

                    recurse(v);
                }
            }
        };
        
        // Hide error message initially
        this.$error.hide();

        // Syntax check
        try {
            this.model = JSON.parse(this.value);

        } catch(e) {
            this.$error.children('.panel-heading').html('JSON error');
            this.$error.children('.panel-body').html(e);
            this.$error.show();

            isValid = false;
        }

        // Integrity check
        recurse(this.model);

        return isValid;
    }

    /**
     * Event: Change text. Make sure the value is up to date
     */
    onChangeText() {
        this.value = this.editor.getDoc().getValue();

        this.debug();
    }

    /**
     * Event: Change theme
     */
    onChangeTheme() {
        let currentTheme = this.$element.find('.CodeMirror')[0].className.replace('CodeMirror cm-s-', '') || 'default';
        let newTheme = this.$element.find('.cm-theme select').val();

        $('.cm-s-' + currentTheme)
            .removeClass('cm-s-' + currentTheme)
            .addClass('cm-s-' + newTheme);

        document.cookie = 'cmtheme = ' + newTheme;
    }

    render() {
        this.value = beautify(JSON.stringify(this.model));

        this.$element.html([
            _.div({class: 'editor-body'},
                this.$textarea = _.textarea(),
                this.$error
            ),
            _.div({class: 'editor-footer'}, 
                _.div({class: 'btn-group pull-left cm-theme'},
                    _.span('Theme'),
                    _.select({class: 'form-control'},
                        _.each([ 'cobalt', 'default', 'night', 'railscasts' ], (i, theme) => {
                            return _.option({value: theme}, theme);
                        })
                    ).change(() => { this.onChangeTheme(); }).val(getCookie('cmtheme') || 'default')
                ),
                _.div({class: 'btn-group'},
                    _.button({class: 'btn btn-embedded'},
                        'Basic'
                    ).click(() => { this.onClickBasic(); }),
                    _.if(!this.model.locked,
                        _.button({class: 'btn btn-raised btn-success'},
                            'Save '
                        ).click(() => { this.onClickSave(); })
                    )
                )
            )
        ]);

        setTimeout(() => {
            this.editor = CodeMirror.fromTextArea(this.$textarea[0], {
                lineNumbers: true,
                mode: {
                    name: 'javascript',
                    json: true
                },
                tabSize: 4,
                indentWithTabs: true,
                theme: getCookie('cmtheme') || 'default',
                value: this.value
            });

            this.editor.getDoc().setValue(this.value);

            this.editor

            this.editor.on('change', () => { this.onChangeText(); });

            this.onChangeText();
        }, 1);
    }
}

module.exports = JSONEditor;
