'use strict';

let FieldEditor = require('./field');

class BlockPicker extends FieldEditor {
    constructor(args) {
        super(args);

        this.fetch();
    }

    renderField(value) {
        function onClick() {
            let tree = ViewHelper.get('Tree');

            tree.picker('content/blocks');
        }

        return _.div({class: 'block-picker'},
            _.button({class: 'btn btn-default'},
                value || '...'
            )
        ).click(onClick);
    }
}

module.exports = BlockPicker;
