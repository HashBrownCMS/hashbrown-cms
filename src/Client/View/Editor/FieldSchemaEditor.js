'use strict';

/**
 * The editor for field Schema
 *
 * @memberof HashBrown.Client.View.Editor
 */
class FieldSchemaEditor extends HashBrown.View.Editor.SchemaEditor {
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
                    new HashBrown.Entity.View.Widget.Popup({
                        model: {
                            autocomplete: true,
                            value: this.model.editorId,
                            options: () => {
                                let options = {};
                                
                                for(let name in HashBrown.View.Editor.FieldEditor) {
                                    let editor = HashBrown.View.Editor.FieldEditor[name];

                                    options[editor.name] = editor.name;
                                }

                                return options;
                            },
                            onchange: (newEditor) => {
                                this.model.editorId = newEditor;

                                this.update();
                            }
                        }
                    }).element
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
