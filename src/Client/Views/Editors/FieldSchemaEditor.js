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

        // Make sure the model follows the parent editor id
        this.model.editorId = this.parentSchema.editorId;

        // Make sure this model has a config
        this.model.config = this.model.config || {};
    }

    /**
     * Renders the editor fields
     */
    renderBody() {
        let $element = super.renderBody();
        let $configEditor = this.renderConfigEditor(this.model.id, this.model.config);
        
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

                            this.update();
                        }
                    })
                )
            ),
            _.if($configEditor,
                this.field(
                    { label: 'Config', isCollapsible: true, isCollapsed: false },
                    $configEditor
                )
            )
        );

        return $element;
    }
}

module.exports = FieldSchemaEditor;
