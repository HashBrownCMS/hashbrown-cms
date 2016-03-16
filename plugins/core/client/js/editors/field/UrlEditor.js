'use strict';

class UrlEditor extends View {
    constructor(params) {
        super(params);

        this.init();
    }

    regenerate() {
        this.$input.val('/new-url/');

        this.trigger('change', this.$input.val());
    };

    onChange() {
        this.trigger('change', this.$input.val());
    };

    render() {
        var editor = this;

        this.$element = _.div({class: 'field-editor url-editor input-group'}, [
            this.$input = _.input({class: 'form-control', value: this.value})
                .bind('change propertychange paste keyup', function() { this.onChange(); }),
            _.div({class: 'input-group-btn'},
                _.button({class: 'btn btn-primary'},
                    'Regenerate '
                ).click(function() { editor.regenerate(); })
            )
        ]);
    }
}

resources.editors['20003'] = UrlEditor;
