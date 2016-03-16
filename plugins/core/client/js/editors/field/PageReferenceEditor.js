'use strict';

class PageReferenceEditor extends View {
    constructor(params) {
        super(params);

        this.init();
    }

    onChange() {
        this.trigger('change', this.$select.val());
    }

    render() {
        var editor = this;

        this.$element = _.div({class: 'field-editor input-group page-reference-editor'}, [
            this.$select = _.select({class: 'form-control'},
                _.each(window.resources.pages, function(id, page) {
                    return _.option({value: page.id}, page.title);
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

resources.editors['20006'] = PageReferenceEditor;
