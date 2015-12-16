'use strict';

let FieldEditor = require('./field');

class TemplatePicker extends FieldEditor {
    constructor(args) {
        super(args);

        this.fetch();
    }

    renderField() {
        let view = this;

        return _.div({class: 'template-picker'}, 
            _.select({class: 'form-control'},
                _.each(view.model.allowed || [],
                    function(i, template) {
                        return _.option({value: template},
                            template
                        );
                    }
                )
            ).change(this.events.changeTextValue)
        );
    }
}

module.exports = TemplatePicker;
