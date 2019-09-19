'use strict';

module.exports = (_, model, state) =>

_.form({class: 'widget widget--file widget-group', title: model.tooltip, onsubmit: _.onSubmit},
    _.span({name: 'placeholder', class: 'widget widget--label widget--file__placeholder'}, model.placeholder || '(no files selected)'), 
    _.label({class: 'widget widget--button small fa fa-folder-open', title: 'Select file(s)'},
        _.input({class: 'widget--file__input', type: 'file', required: model.required, name: model.name, multiple: model.multiple, directory: model.directory, onchange: (e) => _.onChange(e.target.files)})
    ),
    _.if(typeof model.onsubmit === 'function',
        _.button({name: 'submit', class: 'widget widget--button small disabled fa fa-upload', type: 'submit', title: 'Upload file'})
    )
)
