'use strict';

class ArrayEditor extends View {
    constructor(params) {
        super(params);

        this.$element = _.div({class: 'array-editor'});

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
        if(this.config.item.multilingual) {
            this.value[i][window.language] = newValue;

        } else {
            this.value[i] = newValue;
        }

        this.trigger('change', this.value);
    }

    render() {
        let itemSchema = resources.schemas[this.config.item.schemaId];
        let fieldEditor = resources.editors[itemSchema.editorId];

        if(!Array.isArray(this.value)) {
            this.value = [];
        }

        _.append(this.$element.empty(),
            _.div({class: 'items'},
                _.each(this.value, (i, item) => {
                    if(this.config.item.multilingual && typeof item !== 'object') {
                        item = {};
                    }

                    let fieldEditorInstance = new fieldEditor({
                        value: this.config.item.multilingual ? item[window.language] : item,
                        disabled: itemSchema.disabled || false,
                        config: itemSchema.config || {}
                    });

                    fieldEditorInstance.on('change', (newValue) => {
                        this.onChange(newValue, i);
                    });

                    return _.div({class: 'item'},
                        fieldEditorInstance.$element,
                        _.button({class: 'btn btn-embedded btn-remove'},
                            _.span({class: 'fa fa-remove'})
                        ).click(() => { this.onClickRemoveItem(i); })
                    );
                })    
            ),
            _.button({class: 'btn btn-primary btn-add'},
                _.span({class: 'fa fa-plus'})
            ).click(() => { this.onClickAddItem(); })
        )
    }    
}

resources.editors.array = ArrayEditor;
