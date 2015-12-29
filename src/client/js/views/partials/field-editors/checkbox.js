'use strict';

let FieldEditor = require('./field');

class CheckboxEditor extends FieldEditor {
    constructor(args) {
        super(args);

        this.fetch();
    }

    renderField() {
        let view = this;

        return _.div({class: 'checkbox-editor'}, 
            _.button({class: 'btn btn-default btn-toggle', 'data-checked': this.model.value},
                _.span({class: 'glyphicon glyphicon-ok'})
            ).click(function(e) {
                $(this).attr('data-checked', $(this).attr('data-checked') != 'true');

                view.onChangeBoolValue(e, this, view);
            })
        );
    }
}

module.exports = CheckboxEditor;
