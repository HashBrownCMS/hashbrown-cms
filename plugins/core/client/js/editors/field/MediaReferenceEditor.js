'use strict';

class MediaReferenceEditor extends View {
    constructor(params) {
        super(params);

        this.init();
    }

    onChange() {
        this.trigger('change', this.$select.val());
    }

    render() {
        var editor = this;

        this.$element = _.div({class: 'field-editor media-reference-editor'}, [
            this.$button = _.button({class: 'btn btn-primary'},
                'Browse'
            ).click(function() { editor.onClickBrowse(); })
        ]);
    }
}

resources.editors['20007'] = MediaReferenceEditor;
