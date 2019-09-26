'use strict';

/**
 * A field for managing structures of other fields
 *
 * @memberof HashBrown.Client.Entity.View.Field
 */
class StructEditor extends HashBrown.Entity.View.Field.FieldBase {
    /**
     * Constructor
     */
    constructor(params) {
        super(params);

        this.model.innerTemplate = require('template/field/inc/structEditor');
    }

    /**
     * Fetches view data
     */
    async fetch() {
        this.state.fields = [];

        if(!this.state.value || typeof this.state.value !== 'object' || Array.isArray(this.state.value)) {
            this.state.value = {};
        }

        for(let key in this.model.config.struct) {
            let definition = this.model.config.struct[key];

            let view = await HashBrown.Entity.View.Field.FieldBase.createFromFieldDefinition(
                definition,
                this.state.value ? this.state.value[key] : null
            );
            
            view.on('change', (newValue) => {
                this.state.value[key] = newValue;

                this.trigger('change', this.state.value);
            });

            this.state.fields.push(view);
        }
    }
    
    /**
     * Event: Toggle collapsed/expanded
     */
    onToggleCollapsed() {
        this.state.isCollapsed = !this.state.isCollapsed;

        this.render();
    }
    
    /**
     * Gets tools for this field
     *
     * @return {Array} Tools
     */
    getTools() {
        return [
            {
                icon: this.state.isCollapsed ? 'caret-right' : 'caret-down',
                tooltip: this.state.isCollapsed ? 'Expand this field' : 'Collapse this field',
                handler: () => this.onToggleCollapsed()
            }
        ];
    }
}

module.exports = StructEditor;
