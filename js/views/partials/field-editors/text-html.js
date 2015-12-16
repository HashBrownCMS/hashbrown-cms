'use strict';

let FieldEditor = require('./field');

class TextHtmlEditor extends FieldEditor {
    constructor(args) {
        super(args);

        this.fetch();
    }

    renderField(value) {
        return _.div({class: 'text-html-editor'}, 
            _.textarea({class: 'form-control'},
                value
            ).bind('change paste propertychange keyup', this.events.changeTextValue)
        );
    }
}

module.exports = TextHtmlEditor;
