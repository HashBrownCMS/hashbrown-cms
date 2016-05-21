'use strict';

let Content = require('../../../../../../src/server/models/Content');

class ContentReferenceEditor extends View {
    constructor(params) {
        super(params);

        this.init();
    }

    onChange() {
        this.trigger('change', this.$select.val());
    }

    render() {
        let editor = this;

        this.$element = _.div({class: 'field-editor input-group content-reference-editor'}, [
            this.$select = _.select({class: 'form-control'},
                _.each(window.resources.content, function(id, node) {
                    let content = new Content(node);

                    return _.option({value: content.getPropertyValue('id')}, content.getPropertyValue('title', window.language));
                })
            ).change(function() { editor.onChange(); }),
            _.div({class: 'input-group-btn'}, 
                this.$clearBtn = _.button({class: 'btn btn-primary'},
                    'Clear'
                )
            )
        ]);

        this.$select.val(editor.value);

        this.$clearBtn.click(function() {
            editor.$select.val(null);
            
            editor.onChange();
        });
    }
}

resources.editors.contentReference = ContentReferenceEditor;
