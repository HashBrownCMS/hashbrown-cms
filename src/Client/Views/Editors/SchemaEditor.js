'use strict';

// Icons
let icons = require('../../icons.json').icons;

const Schema = require('Common/Models/Schema');
const SchemaHelper = require('Client/Helpers/SchemaHelper');
const ContentHelper = require('Client/Helpers/ContentHelper');
const RequestHelper = require('Client/Helpers/RequestHelper');
const JSONEditor = require('Client/Views/Editors/JSONEditor');

/**
 * The editor for schemas
 *
 * @memberof HashBrown.Client.Views.Editors
 */
class SchemaEditor extends Crisp.View {
    constructor(params) {
        super(params);
        
        this.fetch();
    }
    
    /**
     * Event: Click advanced. Routes to the JSON editor
     */
    onClickAdvanced() {
        location.hash = location.hash.replace('/schemas/', '/schemas/json/');
    }
    
    /**
     * Event: Click save. Posts the model to the modelUrl
     */
    onClickSave() {
        if(this.jsonEditor && this.jsonEditor.isValid == false) {
            return;
        }

        this.$saveBtn.toggleClass('working', true);

        RequestHelper.request('post', 'schemas/' + this.model.id, this.model)
        .then(() => {
            this.$saveBtn.toggleClass('working', false);
        
            return RequestHelper.reloadResource('schemas');
        })
        .then(() => {
            Crisp.View.get('NavbarMain').reload();
        })
        .catch(UI.errorModal);
    }

    /**
     * Renders the editor picker
     *
     * @return {Object} element
     */
    renderEditorPicker() {
        if(this.model.isPropertyHidden('editorId')) { return; }  

        let editorOptions = [];

        for(let i in HashBrown.Views.Editors.FieldEditors) {
            let editor = HashBrown.Views.Editors.FieldEditors[i];

            editorOptions[editorOptions.length] = {
                value: editor.name,
                label: editor.name
            };
        }

        // The editorId is actually a name more than an id
        let editorName = this.model.editorId || '(none)';
        
        // Backwards compatible check
        editorName = editorName.charAt(0).toUpperCase() + editorName.slice(1);
        
        let $element = _.div({class: 'editor-picker'},
            _.if(!this.model.isLocked,
                UI.inputDropdownTypeAhead(editorName, editorOptions, (newValue) => {
                    this.model.editorId = newValue;

                    this.render();
                })
            ),
            _.if(this.model.isLocked,
                _.p({class: 'read-only'},
                    editorName
                )
            )
        );

        return $element;
    }

    /**
     * Renders the name editor
     *
     * @return {Object} element
     */
    renderNameEditor() {
        if(this.model.isPropertyHidden('name')) { return; }  
        
        let view = this;

        function onInputChange() {
            view.model.name = $(this).val();
        }

        let $element = _.div({class: 'name-editor'},
            _.if(!this.model.isLocked,
                _.input({class: 'form-control', type: 'text', value: view.model.name, placeholder: 'Input the schema name here'})
                    .on('change', onInputChange)
            ),
            _.if(this.model.isLocked,
                _.p({class: 'read-only'},
                    view.model.name
                )
            )
        );

        return $element;
    }

    /**
     * Renders the icon editor
     *  
     * @return {Object} element
     */
    renderIconEditor() {
        if(this.model.isPropertyHidden('icon')) { return; }  
        
        let view = this;

        function onClickBrowse() {
            function onSearch() {
                let query = modal.$element.find('.icon-search input').val().toLowerCase();

                if(query.length > 2 || query.length == 0) {
                    modal.$element.find('.btn-icon').each(function(i) {
                        let $btn = $(this);
                        let name = $btn.children('.icon-name').html();

                        $btn.toggle(name.indexOf(query) > -1);
                    });
                }
            }

            let modal = new HashBrown.Views.Modals.MessageModal({
                model: {
                    class: 'modal-icon-picker',
                    title: 'Pick an icon',
                    body: [   
                        _.div({class: 'icon-search'},
                            _.input({type: 'text', class: 'form-control', placeholder: 'Search for icons'})
                                .on('change', function(e) {
                                    onSearch();
                                })
                        ),
                        _.each(icons, function(i, icon) {
                            function onClickButton() {
                                view.model.icon = icon;

                                view.$element.find('.btn-icon-browse .fa').attr('class', 'fa fa-' + icon);

                                modal.hide();
                            }
                            
                            return _.button({class: 'btn btn-icon'},
                                _.span({class: 'fa fa-' + icon}),
                                _.span({class: 'icon-name'}, icon)
                            ).click(onClickButton);
                        })
                    ]
                }
            });
        }

        let $element = _.div({class: 'icon-editor'},
            _.if(!this.model.isLocked,
                _.button({class: 'btn btn-icon-browse btn-default' + (this.model.isLocked ? ' disabled' : '')},
                    _.span({class: 'fa fa-' + this.model.icon})
                ).click(onClickBrowse)
            ),
            _.if(this.model.isLocked,
                _.span({class: 'fa fa-' + this.model.icon})
            )
        );
        
        return $element;
    }

    /**
     * Renders the parent editor
     *  
     * @return {Object} element
     */
    renderParentEditor() {
        if(this.model.isPropertyHidden('parentSchemaId')) { return; }  
        
        let schemaOptions = [];

        // Filter out irrelevant schemas, self and children of self
        let excludedParents = {};
        excludedParents[this.model.id] = true;

        for(let i in resources.schemas) {
            let schema = resources.schemas[i];

            // Check if this Schema has a parent in the excluded list
            // If so, add this id to the excluded list
            // This is to prevent making a Schema a child of its own children
            if(excludedParents[schema.parentSchemaId] == true) {
                excludedParents[schema.id] = true;
                continue;
            }

            // If this Schema is not of the same type as the model, or has the same id, exclude it
            if(
                schema.type != this.model.type ||
                schema.id == this.model.id
            ) {
                continue;
            }

            schemaOptions[schemaOptions.length] = {
                label: schema.name,
                value: schema.id
            };
        }

        // Assign fallback schema name
        let parentName = '(none)';

        if(schemaOptions[this.model.parentSchemaId]) {
            parentName = schemaOptions[this.model.parentSchemaId].name;
        }

        // Render element
        let $element = _.div({class: 'parent-editor input-group'},
            _.if(!this.model.isLocked,
                UI.inputDropdownTypeAhead(this.model.parentSchemaId, schemaOptions, (newValue) => {
                    if(!newValue) {
                        newValue = this.model.type == 'field' ? 'fieldBase' : 'contentBase'; 
                    }

                    this.model.parentSchemaId = newValue;

                    return newValue;
                }, true)
            ),
            _.if(this.model.isLocked,
                _.p({class: 'read-only'},
                    parentName
                )
            )
        );
        
        return $element;
    }

    /**
     * Renders the field config editor
     *
     * @returns {HTMLElement} Editor element
     */
    renderFieldConfigEditor() {
        let editor = HashBrown.Views.Editors.FieldEditors[this.model.editorId];

        if(!editor) { return; }

        return _.div({class: 'config'},
            editor.renderConfigEditor(this.model.config)
        );
    }

	/**
	 * Render template editor
	 *
	 * @returns {HTMLElement} Element
	 */
	renderTemplateEditor() {
        let $element = _.div({class: 'field-properties-editor'});

		setTimeout(() => {
			this.templateEditor = CodeMirror($element[0], {
				value: this.model.previewTemplate || '',
                mode: {
                    name: 'xml'
                },
                lineWrapping: true,
                lineNumbers: true,
                tabSize: 4,
                indentUnit: 4,
                indentWithTabs: true
			});

			this.templateEditor.on('change', () => {
				this.model.previewTemplate = this.templateEditor.getDoc().getValue();
			});
		}, 1);

		return $element;
	}

    /**
     * Renders a single field
     *
     * @param {String} label
     * @param {HTMLElement} content
     * @param {Boolean} isVertical
     *
     * @return {HTMLElement} Editor element
     */
    renderField(label, $content, isVertical) {
        if(!$content) { return; }

        return _.div({class: 'editor__field ' + (isVertical ? 'vertical' : '')},
            _.div({class: 'editor__field__key'},
                label
            ),
            _.div({class: 'editor__field__value'},
                $content
            )
        );
    }

    /**
     * Renders all fields
     *
     * @return {Object} element
     */
    renderFields() {
        let id = parseInt(this.model.id);

        let $element = _.div({class: 'editor__body'});
        
        $element.empty();

        $element.append(this.renderField('Name', new HashBrown.Views.Widgets.Input({
            value: this.model.name,
            onChange: (newValue) => { this.model.name = newValue; }
        }).$element)); 

        $element.append(this.renderField('Icon', this.renderIconEditor()));   

        $element.append(this.renderField('Parent', this.renderParentEditor()));
        
        switch(this.model.type) {
            case 'field':
                $element.append(this.renderField('Field editor', this.renderEditorPicker()));
                
                if(!this.model.isLocked) {
                    $element.append(this.renderField('Config', this.renderFieldConfigEditor(), true));
                    $element.append(this.renderField('Preview template', this.renderTemplateEditor(), true));
                }
       
                break;
        }


        return $element;
    }

    /**
     * Renders this editor
     */
    template() {
        return _.div({class: 'editor editor--schema' + (this.model.isLocked ? ' locked' : '')},
            _.div({class: 'editor__header'},
                _.span({class: 'editor__header__icon fa fa-' + this.compiledSchema.icon}),
                _.h4({class: 'editor__header__title'}, this.model.name)
            ),
            this.renderFields(),
            _.div({class: 'editor__footer'}, 
                _.div({class: 'editor__footer__buttons'},
                    _.button({class: 'widget widget--button embedded'},
                        'Advanced'
                    ).click(() => { this.onClickAdvanced(); }),
                    _.if(!this.model.isLocked,
                        this.$saveBtn = _.button({class: 'widget widget--button editor__footer__buttons__save'},
                            _.span({class: 'widget--button__text-default'}, 'Save '),
                            _.span({class: 'widget--button__text-working'}, 'Saving ')
                        ).click(() => { this.onClickSave(); })
                    )
                )
            )
        );
    }
}

module.exports = SchemaEditor;
