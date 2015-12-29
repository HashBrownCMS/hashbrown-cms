'use strict';

let FieldEditor = require('./field');

class Section extends FieldEditor {
    constructor(args) {
        super(args);

        this.fetch();
    }

    renderField(value) {
        let editor = ViewHelper.get('Editor');

        let $el = _.div({class: 'section-editor'});

        console.log(value);

        editor.renderModelData(value, $el);
        
        return $el;
    }
}

module.exports = Section;
