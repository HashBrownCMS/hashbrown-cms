'use strict';

const beautify = require('js-beautify').js_beautify;

/**
 * A basic JSON editor for any object
 *
 * @memberof HashBrown.Client.View.Editor
 */
class JSONEditor extends Crisp.View {
    constructor(params) {
        super(params);

        this.$error = _.div({class: 'editor__footer__error'},
            _.div({class: 'editor__footer__error__heading'}),
            _.div({class: 'editor__footer__error__body'})
        ).hide();

        this.fetch();
    }

    /**
     * Fetches the model
     */
    async fetch() {
        try {
            this.allSchemas = await HashBrown.Service.SchemaService.getAllSchemas();
            this.allConnections = await HashBrown.Service.ConnectionService.getAllConnections();
            this.model = await HashBrown.Service.ResourceService.get(null, this.resourceCategory, this.modelId);

            super.fetch();

        } catch(e) {
            UI.error(e);

        }
    }

    /**
     * Gets a schema synchronously
     *
     * @param {String} id
     *
     * @return {HashBrown.Entity.Resource.Schema.SchemaBase} Schema
     */
    getSchema(id) {
        checkParam(id, 'id', String);

        for(let schema of this.allSchemas) {
            if(schema.id === id) { return schema; }
        }

        return null;
    }

    /**
     * Event: Click basic. Returns to the regular editor
     */
    onClickBasic() {
        location.hash = location.hash.replace('/json', '');
    }

    /**
     * Event: Click save. Posts the model to the apiPath
     */
    async onClickSave() {
        this.model = JSON.parse(this.value); 

        this.$saveBtn.toggleClass('working', true);

        if(this.debug()) {
            await HashBrown.Service.ResourceService.set(this.resourceCategory, this.modelId, this.model);

            this.$saveBtn.toggleClass('working', false);
       
        } else {
            UI.error('Unable to save', 'Please refer to the error prompt for details');

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
            this.$error.children('.editor__footer__error__heading').html('JSON error');
            this.$error.children('.editor__footer__error__body').html(e);
            this.$error.show();

        }
    }

    /**
     * Debug the JSON string
     *
     * @param {Boolean} fromEntity
     */
    debug(fromEntity) {
        let isValid = true;
        
        // Function for checking model integrity
        let check = (k, v) => {
            if(!v) { return; }

            switch(k) {
                case 'schemaId': case 'parentSchemaId':
                    if(typeof v !== 'string') { return; }

                    if(this.getSchema(v)) { return; }

                    return 'Schema "' + v + '" not found';
               
                case 'schemaBindings': case 'allowedSchemas': case 'allowedChildSchemas':
                    if(!Array.isArray(v)) { return; }

                    let invalidSchemas = v.slice(0);
                    
                    for(let r in this.allSchemas) {
                        let schema = this.allSchemas[r];
                        
                        for(let b = invalidSchemas.length - 1; b >= 0; b--) {
                            if(schema.id === invalidSchemas[b]) {
                                invalidSchemas.splice(b, 1);
                            }
                        }   
                    }

                    if(invalidSchemas.length > 0) {
                        if(invalidSchemas.length === 1) {
                            return 'Schema ' + invalidSchemas[0] + ' not found';
                        } else {
                            return 'Schemas ' + invalidSchemas.join(', ') + ' not found';
                        }
                    }

                    break;
                    
                case 'connections':
                    let invalidConnections = v.slice(0);
                    
                    for(let r in this.allConnections) {
                        let connection = this.allConnections[r];

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
                        this.$error.children('.editor__footer__error__heading').html('Input error');
                        this.$error.children('.editor__footer__error__body').html(failMessage);
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
            if(!fromEntity) {
                this.model = JSON.parse(this.value);
            }
            
            // Sanity check
            recurse(this.model);

        } catch(e) {
            this.$error.children('.editor__footer__error__heading').html('Syntax error');
            this.$error.children('.editor__footer__error__body').html(e);
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

    /**
     * Pre render
     */
    prerender() {
        // Debug once before entering into the code editor
        // This allows for backward compatibility adjustments to happen first
        this.debug(true);

        // Convert the model to a string value
        this.value = beautify(JSON.stringify(this.model));
    }

    /**
     * Renders this editor
     */
    template() {
        return _.div({class: 'editor editor--json'},
            _.div({class: 'editor__header'}, 
                _.span({class: 'editor__header__icon fa fa-code'}),
                _.h4({class: 'editor__header__title'}, Crisp.Router.params.id)
            ),
            _.div({class: 'editor__body'},
                _.textarea(),
            ),
            _.div({class: 'editor__footer'}, 
                this.$error,
                _.div({class: 'editor__footer__buttons'},
                    _.button({class: 'widget widget--button embedded'},
                        'Basic'
                    ).click(() => { this.onClickBasic(); }),
                    _.if(!this.model.isLocked,
                        this.$saveBtn = _.button({class: 'widget widget--button'},
                            _.span({class: 'widget--button__text-default'}, 'Save'),
                            _.span({class: 'widget--button__text-working'}, 'Saving')
                        ).click(() => { this.onClickSave(); })
                    )
                )
            )
        );
    }

    /**
     * Post render
     */
    postrender() {
        setTimeout(() => {
            this.editor = CodeMirror.fromTextArea(this.element.querySelector('textarea'), {
                lineNumbers: true,
                mode: {
                    name: 'javascript',
                    json: true
                },
                viewportMargin: 10,
                tabSize: 4,
                lineWrapping: false,
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
