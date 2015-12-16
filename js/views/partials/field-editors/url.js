'use strict';

let FieldEditor = require('./field');

class UrlEditor extends FieldEditor {
    constructor(args) {
        super(args);

        this.fetch();
    }

    renderField(value) {
        value = value || location.hash.replace('#/_content', '').replace('.json', '');

        return _.div({class: 'url-editor'}, 
            _.input({class: 'form-control', type: 'text', value: value}).bind('change paste propertychange keyup', this.events.changeTextValue)
        );
    }
}

module.exports = UrlEditor;
