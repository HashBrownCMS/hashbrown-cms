'use strict';

module.exports = (_, model, state) =>

_.div({class: 'editor widget--rich-text'},
    _.div({class: 'widget--rich-text__toolbar'},
        _.popup({name: 'paragraph', value: 'p', options: state.paragraphOptions, onchange: _.onChangeHeading}),

        _.div({class: 'widget-group__separator line'}),
        
        _.if(model.toolbar.bold !== false,
            _.button({class: 'widget widget--button default small fa fa-bold', title: 'Bold', onclick: () => _.onChangeStyle('bold')})
        ),
        _.if(model.toolbar.italic !== false,
            _.button({class: 'widget widget--button default small fa fa-italic', title: 'Italic', onclick: () => _.onChangeStyle('italic')})
        ),
        _.if(model.toolbar.underline !== false,
            _.button({class: 'widget widget--button default small fa fa-underline', title: 'Underline', onclick: () => _.onChangeStyle('underline')})
        ),
        _.if(model.toolbar.color !== false,
            _.div({class: 'widget widget--button default small fa fa-paint-brush', title: 'Font color'},
                _.input({class: 'widget--button__input', type: 'color', onchange: (e) => _.onChangeFontColor(e.target.value)})
            )
        ),
        
        _.div({class: 'widget-group__separator line'}),
        
        _.if(model.toolbar.orderedList !== false,
            _.button({class: 'widget widget--button default small fa fa-list-ol', title: 'Ordered list', onclick: () => _.onChangeStyle('insertOrderedList')})
        ),
        _.if(model.toolbar.unorderedList !== false,
            _.button({class: 'widget widget--button default small fa fa-list-ul', title: 'Unordered list', onclick: () => _.onChangeStyle('insertUnorderedList')})
        ),

        _.div({class: 'widget-group__separator line'}),
        
        _.if(model.toolbar.indent !== false,
            _.button({class: 'widget widget--button default small fa fa-indent', title: 'Indent', onclick: () => _.onChangeStyle('indent')})
        ),
        _.if(model.toolbar.outdent !== false,
            _.button({class: 'widget widget--button default small fa fa-outdent', title: 'Outdent', onclick: () => _.onChangeStyle('outdent')})
        ),
        _.if(model.toolbar.alignLeft !== false,
            _.button({class: 'widget widget--button default small fa fa-align-left', title: 'Left', onclick: () => _.onChangeStyle('justifyLeft')})
        ),
        _.if(model.toolbar.center !== false,
            _.button({class: 'widget widget--button default small fa fa-align-center', title: 'Center', onclick: () => _.onChangeStyle('justifyCenter')})
        ),
        _.if(model.toolbar.justify !== false,
            _.button({class: 'widget widget--button default small fa fa-align-justify', title: 'Justify', onclick: () => _.onChangeStyle('justifyFull')})
        ),
        _.if(model.toolbar.alignRight !== false,
            _.button({class: 'widget widget--button default small fa fa-align-right', title: 'Right', onclick: () => _.onChangeStyle('justifyRight')})
        ),

        _.div({class: 'widget-group__separator line'}),
        
        _.button({class: 'widget widget--button default small fa fa-link', title: 'Create link', onclick: _.onCreateLink}),
        
        _.div({class: 'widget-group__separator line'}),
        
        _.button({class: 'widget widget--button default small fa fa-remove', title: 'Remove formatting', onclick: _.onRemoveFormat})
    ),
    _.div({name: 'editor', class: 'widget--rich-text__editor', contenteditable: true, oninput: _.onChange, onclick: _.onSilentChange, onkeyup: _.onSilentChange}) 
)
