'use strict';

let Content = require('../../../../../../src/common/models/Content');

class ContentReferenceEditor extends View {
    constructor(params) {
        super(params);

        this.init();
    }

    onChange() {
        this.trigger('change', this.$select.val());
    }

    render() {
        this.$element = _.div({class: 'field-editor input-group content-reference-editor'}, [
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
            _.div({class: 'input-group-btn'}, 
                this.$clearBtn = _.button({class: 'btn btn-primary'},
                    'Clear'
                )
            )
        ]);

        this.$select.val(this.value);

        this.$clearBtn.click(() => {
            this.$select.val(null);
            
            this.onChange();
        });
    }
}

resources.editors.contentReference = ContentReferenceEditor;
