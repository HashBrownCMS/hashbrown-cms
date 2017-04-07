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
        this.$error = _.div({class: 'error'},
            _.div({class: 'error-heading'}),
            _.div({class: 'error-body'})
        ).hide();

        if(!this.model && !this.modelUrl) {
            this.modelUrl = apiUrl(this.apiPath);
        }

        this.fetch();
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
        
        this.$saveBtn.toggleClass('working', true);

        if(this.debug()) {
            apiCall('post', this.apiPath, this.model)
            .then(() => {
                this.$saveBtn.toggleClass('working', false);
            })
            .catch(UI.errorModal);
       
        } else {
            UI.errorModal('Unable to save', 'Please refer to the error prompt for details');

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
            this.$error.children('.error-heading').html('JSON error');
            this.$error.children('.error-body').html(e);
            this.$error.show();

        }
    }

    /**
     * Debug the JSON string
     *
     * @param {Boolean} fromModel
     */
    debug(fromModel) {
        let isValid = true;
        
        // Function for checking model integrity
        let check = (k, v) => {
            if(!v) { return; }

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
                        for(let template of resources.templates) {
                            if(template.id == v) {
                                return;
                            }
                        }   
                        
                        return 'Template "' + v + '" not found';
                    }

                    break;

                case 'config':
                    // Backward compatibility adjustment for template configs
                    if(v.resource) {
                        switch(v.resource) {
                            case 'partialTemplates':
                            case 'sectionTemplates':
                                v.type = 'partial';
                                delete v.resource;
                                break;
                            
                            case 'templates':
                                v.type = 'page';
                                delete v.resource;
                                break;
                        }
                    }

                    // Allowed templates config
                    if(v.allowedTemplates) {
                        // Assume that all templates are invalid
                        let invalidTemplates = v.allowedTemplates.slice(0);

                        // Backwards compatibility adjustment
                        if(v.resource) {
                            if(v.resource == 'partialTemplates' || v.resource == 'sectionTemplates') {
                                v.type = 'partial';
                            } else {
                                v.type = 'page';
                            }

                            delete v.resource;
                        }

                        // Sanity check for type
                        if(!v.type) {
                            v.type = 'page';
                        }

                        // Loop through all available templates
                        for(let existingTemplate of resources.templates) {
                            for(let a = invalidTemplates.length - 1; a >= 0; a--) {

                                // If a template was found, and it's of the correct type, remove it from the invalid templates array
                                if(
                                    existingTemplate.type == v.type &&
                                    existingTemplate.id == invalidTemplates[a]
                                ) {
                                    invalidTemplates.splice(a, 1);
                                }
                            }   
                        }

                        if(invalidTemplates.length > 0) {
                            if(invalidTemplates.length == 1) {
                                return 'Template "' + invalidTemplates[0] + '" of type "' + v.type + '" not found';
                            } else {
                                return 'Templates "' + invalidTemplates.join(', ') + '" of type "' + v.type + '" not found';
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
                        this.$error.children('.error-heading').html('Input error');
                        this.$error.children('.error-body').html(failMessage);
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
            if(!fromModel) {
                this.model = JSON.parse(this.value);
            }
            
            // Sanity check
            recurse(this.model);

        } catch(e) {
            this.$error.children('.error-heading').html('Syntax error');
            this.$error.children('.error-body').html(e);
            this.$error.show();

            isValid = false;
        }

        this.isValid = isValid;

        return isValid;
    }

    /**
     * Event: Change text. Make sure the value is up to date
     */
    onChangeText() {
        this.value = this.editor.getDoc().getValue();

        if(this.debug()) {
            this.trigger('change', this.model);
        }
    }

    render() {
        // Debug once before entering into the code editor
        // This allows for backward compatibility adjustments to happen first
        this.debug(true);

        // Convert the model to a string value
        this.value = beautify(JSON.stringify(this.model));

        _.append(this.$element.empty(),
            _.div({class: 'editor-body'},
                this.$textarea = _.textarea(),
                this.$error
            ),
            _.if(!this.embedded,
                _.div({class: 'editor-footer'}, 
                    _.div({class: 'btn-group'},
                        _.button({class: 'btn btn-embedded'},
                            'Basic'
                        ).click(() => { this.onClickBasic(); }),
                        _.if(!this.model.locked,
                            this.$saveBtn = _.button({class: 'btn btn-raised btn-primary'},
                                _.span({class: 'text-default'}, 'Save'),
                                _.span({class: 'text-working'}, 'Saving')
                            ).click(() => { this.onClickSave(); })
                        )
                    )
                )
            )
        );

        setTimeout(() => {
            this.editor = CodeMirror.fromTextArea(this.$textarea[0], {
                lineNumbers: true,
                mode: {
                    name: 'javascript',
                    json: true
                },
                viewportMargin: this.embedded ? Infinity : 10,
                tabSize: 4,
                lineWrapping: this.embedded,
                indentUnit: 4,
                indentWithTabs: true,
                theme: getCookie('cmtheme') || 'default',
                value: this.value
            });

            this.editor.getDoc().setValue(this.value);

            this.editor.on('change', () => { this.onChangeText(); });

            this.onChangeText();
        }, 1);
    }
}

module.exports = JSONEditor;
