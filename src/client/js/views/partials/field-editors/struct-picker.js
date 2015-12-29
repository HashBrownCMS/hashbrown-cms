'use strict';

let FieldEditor = require('./field');

class StructPicker extends FieldEditor {
    constructor(args) {
        super(args);

        this.fetch();
    }

    renderField() {
        let view = this;

        return _.div({class: 'struct-picker'}, 
            _.select({class: 'form-control'},
                _.each(view.model.allowed || [],
                    function(i, struct) {
                        return _.option({value: struct},
                            struct
                        );
                    }
                )
            ).change(this.events.changeTextValue)
        );
    }
}

module.exports = StructPicker;
