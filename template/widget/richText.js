'use strict';

module.exports = (_, model, state) =>

_.div({class: `editor widget--rich-text ${model.disabled ? 'disabled' : ''}`},
    !model.disabled ? [
        _.div({class: 'widget--rich-text__toolbar'},
            _.popup({name: 'paragraph', value: 'p', options: state.paragraphOptions, onchange: _.onChangeElement}),

            _.div({class: 'widget-group__separator line'}),
            
            model.toolbar.bold !== false ? [
                _.button({class: 'widget widget--button default small fa fa-bold', title: 'Bold', onclick: () => _.onToggleElement('strong')})
            ] : null,
            model.toolbar.italic !== false ? [
                _.button({class: 'widget widget--button default small fa fa-italic', title: 'Italic', onclick: () => _.onToggleElement('em')})
            ] : null,
            model.toolbar.underline !== false && !model.markdown ? [
                _.button({class: 'widget widget--button default small fa fa-underline', title: 'Underline', onclick: () =>  _.onToggleStyle('textDecoration', 'underline')})
            ] : null,
            model.toolbar.color !== false && !model.markdown ? [
                _.div({class: 'widget widget--button default small fa fa-paint-brush', title: 'Font colour'},
                    _.input({class: 'widget--button__input', type: 'color', onchange: (e) => _.onChangeStyle('color', e.target.value)})
                )
            ] : null,
            
            _.div({class: 'widget-group__separator line'}),
            
            model.toolbar.orderedList !== false ? [
                _.button({class: 'widget widget--button default small fa fa-list-ol', title: 'Ordered list', onclick: () => _.onToggleList('ol')})
            ] : null,
            model.toolbar.unorderedList !== false ? [
                _.button({class: 'widget widget--button default small fa fa-list-ul', title: 'Unordered list', onclick: () => _.onToggleList('ul')})
            ] : null,

            _.div({class: 'widget-group__separator line'}),
            
            model.toolbar.indent !== false ? [
                _.button({class: 'widget widget--button default small fa fa-indent', title: 'Indent', onclick: () => _.onToggleContainerElement('blockquote', true)})
            ] : null,
            model.toolbar.outdent !== false ? [
                _.button({class: 'widget widget--button default small fa fa-outdent', title: 'Outdent', onclick: () => _.onToggleContainerElement('blockquote', false)})
            ] : null,
            model.toolbar.alignLeft !== false && !model.markdown ? [
                _.button({class: 'widget widget--button default small fa fa-align-left', title: 'Left', onclick: () => _.onChangeStyle('textAlign', 'left')})
            ] : null,
            model.toolbar.center !== false && !model.markdown ? [
                _.button({class: 'widget widget--button default small fa fa-align-center', title: 'Center', onclick: () => _.onChangeStyle('textAlign', 'center')})
            ] : null,
            model.toolbar.justify !== false && !model.markdown ? [
                _.button({class: 'widget widget--button default small fa fa-align-justify', title: 'Justify', onclick: () => _.onChangeStyle('textAlign', 'justify')})
            ] : null,
            model.toolbar.alignRight !== false && !model.markdown ? [
                _.button({class: 'widget widget--button default small fa fa-align-right', title: 'Right', onclick: () => _.onChangeStyle('textAlign', 'right')})
            ] : null,

            _.div({class: 'widget-group__separator line'}),
            
            _.button({class: 'widget widget--button default small fa fa-link', title: 'Create link', onclick: _.onCreateLink}),
            
            _.div({class: 'widget-group__separator line'}),
            
            _.button({class: 'widget widget--button default small fa fa-remove', title: 'Remove formatting', onclick: _.onRemoveFormat}),
            
            model.markdown ? [
                _.div({class: 'widget-group__separator line'}),
                
                _.button({class: `widget widget--button default small fa fa-eye${state.isPreviewActive ? '-slash' : ''}`, title: 'Toggle preview', onclick: _.onTogglePreview})
            ] : null,
        )
    ] : null,
    _.div({class: 'widget--rich-text__view'},
        model.markdown ? [
            _.textarea({name: 'editor', disabled: model.disabled, class: `widget--rich-text__editor ${state.isPreviewActive ? 'has-preview' : ''}`, oninput: _.onChange, onclick: _.onSilentChange, onkeyup: _.onSilentChange}),
            _.div({name: 'preview', class: `widget--rich-text__preview ${state.isPreviewActive ? '' : 'is-hidden'}`}) 
        ] : [
            _.div({name: 'editor', disabled: model.disabled, class: 'widget--rich-text__editor', contenteditable: !model.disabled, oninput: _.onChange, onclick: _.onSilentChange, onkeyup: _.onSilentChange}) 
        ]
    )
)
