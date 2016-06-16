'use strict';

class ArrayEditor extends View {
    constructor(params) {
        super(params);

        this.fetch();
    }

    onClickRemoveItem(i) {
        this.value.splice(i,1);

        this.render();
    }

    onClickAddItem() {
        this.value.push(null);

        this.render();
    }

    onChange(newValue, i) {
        this.value[i] = newValue;

        this.trigger('change', this.value);
    }

    render() {
        let itemSchema = resources.schemas[this.config.itemSchemaId];
        let fieldEditor = resources.editors[itemSchema.editorId];

        this.$element = _.div({class: 'array-editor'},
            _.div({class: 'items'},
                _.each(this.value, (i, item) => {
                    let fieldEditorInstance = new fieldEditor({
                        value: item,
                        disabled: itemSchema.disabled || false,
                        config: itemSchema.config || {}
                    });

                    fieldEditorInstance.on('change', (newValue) => {
                        this.onChange(newValue, i);
                    });

                    return fieldEditorInstance.$element;
                })    
            ),
            _.button({class: 'btn btn-primary'},
                _.span({class: 'fa fa-plus'})
            )
        )
    }    
}

resources.editors.array = ArrayEditor;
