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

    /**
     * Gets a list of allowed Content nodes
     *
     * @returns {Array} Allowed Content nodes
     */
    getAllowedContent() {
        // If rules are defined, filter the Content node list
        if(
            this.config &&
            Array.isArray(this.config.allowedSchemas) &&
            this.config.allowedSchemas.length > 0)
        {
            return window.resources.content.filter((content) => {
                return this.config.allowedSchemas.indexOf(content.schemaId) > -1;
            });
        
        // If no rules are defined, return all content
        } else {
            return window.resources.content;
        }

    }

    render() {
        // Render main element
        this.$element = _.div({class: 'field-editor content-reference-editor'}, [

            // Render picker
            this.$select = _.select({class: 'form-control'},
                _.each(this.getAllowedContent(), (i, node) => {
                    let content = new Content(node);

                    if(content.id == Router.params.id) {
                        return;
                    }

                    return _.option({ value: content.id },
                        content.prop('title', window.language)
                    );
                })
            ).change(() => { this.onChange(); }),

            // Render clear button
            this.$clearBtn = _.button({class: 'btn btn-remove'},
                _.span({class: 'fa fa-remove'})
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
