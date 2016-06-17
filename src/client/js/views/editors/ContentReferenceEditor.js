'use strict';

/**
 * An editor for referring to other Content
 */
class ContentReferenceEditor extends View {
    constructor(params) {
        super(params);

        this.init();
    }

    /**
     * Event: Change value
     */
    onChange() {
        this.value = this.$select.val();

        this.trigger('change', this.value);
    }

    render() {
        // Render main element
        this.$element = _.div({class: 'field-editor input-group content-reference-editor'}, [

            // Render picker
            this.$select = _.select({class: 'form-control'},
                _.each(window.resources.content, (id, node) => {
                    let content = new Content(node);

                    return _.option(
                        {
                            value: content.id,
                            selected: this.value == content.id
                        },
                        content.prop('title', window.language)
                    );
                })
            ).change(() => { this.onChange(); }),

            // Render clear button
            _.div({class: 'input-group-btn'}, 
                this.$clearBtn = _.button({class: 'btn btn-primary'},
                    'Clear'
                )
            )
        ]);

        // Set the initial value
        this.$select.val(this.value);

        // Hook up the change event to the clear button
        this.$clearBtn.click(() => {
            this.$select.val(null);
            
            this.onChange();
        });
    }
}

module.exports = ContentReferenceEditor;
