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
        // This check isn't relevant for schemas without a "real" parent
        if(!this.parentSchema || this.parentSchema.id === 'fieldBase') { return; }

        // Make sure the model has an editor id
        this.model.editorId = this.parentSchema.editorId;
    }

    /**
     * Renders the editor fields
     */
    renderBody() {
        let $element = super.renderBody();
      
        _.append($element,
            _.if(this.model.parentSchemaId === 'fieldBase',
                this.field(
                    'Field editor',
                    new HashBrown.Views.Widgets.Dropdown({
                        useTypeahead: true,
                        value: this.model.editorId,
                        options: HashBrown.Views.Editors.FieldEditors,
                        valueKey: 'name',
                        labelKey: 'name',
                        onChange: (newEditor) => {
                            this.model.editorId = newEditor;

                            this.fetch();
                        }
                    })
                )
            ),
            _.do(() => {
                let editor = HashBrown.Views.Editors.FieldEditors[this.model.editorId];

                if(!editor) { return; }
                
                let configEditor = editor.renderConfigEditor(this.model.config, this.model.id);

                if(!configEditor) { return; }

                return this.field(
                    { label: 'Config', isCollapsible: true },
                    configEditor
                );
            })
        );

        return $element;
    }
}

module.exports = FieldSchemaEditor;
