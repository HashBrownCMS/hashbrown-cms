'use strict';

/**
 * The editor for field Schemas
 *
 * @memberof HashBrown.Client.Views.Editors
 */
class FieldSchemaEditor extends HashBrown.Views.Editors.SchemaEditor {
    /**
     * Pre render
     */
    prerender() {
        if(!this.parentSchema || !this.parentSchema.id === 'fieldBase') { return; }

        this.model.editorId = this.parentSchema.editorId;
    
        if(!this.model.editorId) {
            UI.errorModal(new Error('Could not find a field editor for the schema "' + this.model.id + '"'));     
        }
    }

    /**
     * Renders the field config editor
     *
     * @returns {HTMLElement} Editor element
     */
    renderFieldConfigEditor() {
        let editor = HashBrown.Views.Editors.FieldEditors[this.model.editorId];

        if(!editor) { return; }

        return editor.renderConfigEditor(this.model.config, this.model.id);
    }

    /**
     * Renders the editor fields
     */
    renderFields() {
        let $element = super.renderFields();
       
        if(this.model.parentSchemaId === 'fieldBase') {
            $element.append(this.renderField('Field editor', new HashBrown.Views.Widgets.Dropdown({
                useTypeahead: true,
                value: this.model.editorId,
                options: HashBrown.Views.Editors.FieldEditors,
                valueKey: 'name',
                labelKey: 'name',
                onChange: (newEditor) => {
                    this.model.editorId = newEditor;

                    this.fetch();
                }
            }).$element));
        }

        $element.append(this.renderField('Config', this.renderFieldConfigEditor(), true));

        return $element;
    }
}

module.exports = FieldSchemaEditor;
