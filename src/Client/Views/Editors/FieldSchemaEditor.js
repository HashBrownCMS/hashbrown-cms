'use strict';

const SchemaEditor = require('Client/Views/Editors/SchemaEditor');

/**
 * The editor for field Schemas
 *
 * @memberof HashBrown.Client.Views.Editors
 */
class FieldSchemaEditor extends SchemaEditor {
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
     * Renders the editor fields
     */
    renderFields() {
        let $element = super.renderFields();
        
        $element.append(this.renderField('Field editor', new HashBrown.Views.Widgets.Dropdown({
            useTypeahead: true,
            value: this.model.editorId,
            options: HashBrown.Views.Editors.FieldEditors,
            valueKey: 'name',
            labelKey: 'name',
            onChange: (newEditor) => {
                this.model.editorId = newEditor;

                this.render();
            }
        }).$element));
        
        if(!this.model.isLocked) {
            $element.append(this.renderField('Config', this.renderFieldConfigEditor(), true));
            $element.append(this.renderField('Preview template', this.renderTemplateEditor(), true));
        }

        return $element;
    }
}

module.exports = FieldSchemaEditor;
