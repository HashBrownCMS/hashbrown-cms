'use strict';

module.exports = (_, model, state) =>

_.div({class: `editor widget--rich-text ${model.disabled ? 'disabled' : ''}`},
    !model.disabled ? [
        _.div({class: 'widget--rich-text__toolbar'},
            _.popup({name: 'paragraph', value: 'p', options: state.paragraphOptions, onchange: _.onChangeElement}),

            _.div({class: 'widget-group__separator line'}),
            
            _.if(model.toolbar.bold !== false,
                _.button({class: 'widget widget--button default small fa fa-bold', title: 'Bold', onclick: () => _.onToggleStyle('fontWeight', 'bold')})
            ),
            _.if(model.toolbar.italic !== false,
                _.button({class: 'widget widget--button default small fa fa-italic', title: 'Italic', onclick: () => _.onToggleStyle('fontStyle', 'italic')})
            ),
            _.if(model.toolbar.underline !== false,
                _.button({class: 'widget widget--button default small fa fa-underline', title: 'Underline', onclick: () =>  _.onToggleStyle('textDecoration', 'underline')})
            ),
            _.if(model.toolbar.color !== false,
                _.div({class: 'widget widget--button default small fa fa-paint-brush', title: 'Font colour'},
                    _.input({class: 'widget--button__input', type: 'color', onchange: (e) => _.onChangeStyle('color', e.target.value)})
                )
            ),
            
            _.div({class: 'widget-group__separator line'}),
            
            _.if(model.toolbar.orderedList !== false,
                _.button({class: 'widget widget--button default small fa fa-list-ol', title: 'Ordered list', onclick: () => _.onToggleList('ol')})
            ),
            _.if(model.toolbar.unorderedList !== false,
                _.button({class: 'widget widget--button default small fa fa-list-ul', title: 'Unordered list', onclick: () => _.onToggleList('ul')})
            ),

            _.div({class: 'widget-group__separator line'}),
            
            _.if(model.toolbar.indent !== false,
                _.button({class: 'widget widget--button default small fa fa-indent', title: 'Indent', onclick: () => _.onToggleContainerElement('blockquote', true)})
            ),
            _.if(model.toolbar.outdent !== false,
                _.button({class: 'widget widget--button default small fa fa-outdent', title: 'Outdent', onclick: () => _.onToggleContainerElement('blockquote', false)})
            ),
            _.if(model.toolbar.alignLeft !== false,
                _.button({class: 'widget widget--button default small fa fa-align-left', title: 'Left', onclick: () => _.onChangeStyle('textAlign', 'left')})
            ),
            _.if(model.toolbar.center !== false,
                _.button({class: 'widget widget--button default small fa fa-align-center', title: 'Center', onclick: () => _.onChangeStyle('textAlign', 'center')})
            ),
            _.if(model.toolbar.justify !== false,
                _.button({class: 'widget widget--button default small fa fa-align-justify', title: 'Justify', onclick: () => _.onChangeStyle('textAlign', 'justify')})
            ),
            _.if(model.toolbar.alignRight !== false,
                _.button({class: 'widget widget--button default small fa fa-align-right', title: 'Right', onclick: () => _.onChangeStyle('textAlign', 'right')})
            ),

            _.div({class: 'widget-group__separator line'}),
            
            _.button({class: 'widget widget--button default small fa fa-link', title: 'Create link', onclick: _.onCreateLink}),
            
            _.div({class: 'widget-group__separator line'}),
            
            _.button({class: 'widget widget--button default small fa fa-remove', title: 'Remove formatting', onclick: _.onRemoveFormat})
        )
    ] : null,
    model.markdown ? [
        _.textarea({name: 'editor', disabled: model.disabled, class: 'widget--rich-text__editor', oninput: _.onChange, onclick: _.onSilentChange, onkeyup: _.onSilentChange}) 
    ] : [
        _.div({name: 'editor', disabled: model.disabled, class: 'widget--rich-text__editor', contenteditable: !model.disabled, oninput: _.onChange, onclick: _.onSilentChange, onkeyup: _.onSilentChange}) 
    ]
)
