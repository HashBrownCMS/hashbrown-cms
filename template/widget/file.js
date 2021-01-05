'use strict';

module.exports = (_, model, state) =>

_.form({class: `widget widget--file widget-group ${model.class || ''}`, title: model.tooltip, onsubmit: _.onSubmit},
    _.span({name: 'placeholder', class: 'widget widget--label widget--file__placeholder'}),
    _.label({localized: true, class: 'widget widget--button small fa fa-folder-open', title: 'Select file(s)'},
        _.input({class: 'widget--file__input', accept: model.accept, type: 'file', required: model.required, name: model.name, multiple: model.multiple, directory: model.directory, onchange: _.onChange})
    ),
    typeof model.onsubmit === 'function' ? [
        _.button({localized: true, name: 'submit', class: 'widget widget--button small fa fa-upload', type: 'submit', title: 'Upload'})
    ] : null,
    model.clearable ? [
        _.button({localized: true, name: 'clear', class: 'widget widget--button small fa fa-remove', title: 'Clear', onclick: _.onClear})
    ] : null
)
