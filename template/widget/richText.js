'use strict';

module.exports = (_, model, state) =>

_.div({class: `editor widget--rich-text ${model.disabled ? 'disabled' : ''}`},
    !model.disabled ? [
        _.div({class: 'widget--rich-text__toolbar'},
            _.popup({name: 'paragraph', value: 'p', options: state.paragraphOptions, onchange: _.onChangeParagraph}),
            
            _.div({class: 'widget-group__separator'}),

            model.toolbar.bold !== false ? [
                _.button({class: 'widget widget--button default small fa fa-bold', title: 'Bold', onclick: _.onClickBold})
            ] : null,
            model.toolbar.italic !== false ? [
                _.button({class: 'widget widget--button default small fa fa-italic', title: 'Italic', onclick: _.onClickItalic})
            ] : null,
            
            _.div({class: 'widget-group__separator line'}),
           
            model.toolbar.quotation !== false ? [
                _.button({class: 'widget widget--button default small fa fa-quote-left', title: 'Quotation', onclick: _.onClickQuotation})
            ] : null,
            model.toolbar.code !== false ? [
                _.button({class: 'widget widget--button default small fa fa-code', title: 'Code', onclick: _.onClickCode})
            ] : null,

            _.div({class: 'widget-group__separator line'}),
            
            model.toolbar.orderedList !== false ? [
                _.button({class: 'widget widget--button default small fa fa-list-ol', title: 'Ordered list', onclick: _.onClickOrderedList})
            ] : null,
            model.toolbar.unorderedList !== false ? [
                _.button({class: 'widget widget--button default small fa fa-list-ul', title: 'Unordered list', onclick: _.onClickUnorderedList})
            ] : null,

            _.div({class: 'widget-group__separator line'}),
            
            model.toolbar.indent !== false ? [
                _.button({class: 'widget widget--button default small fa fa-indent', title: 'Indent', onclick: _.onClickIndent})
            ] : null,
            model.toolbar.outdent !== false ? [
                _.button({class: 'widget widget--button default small fa fa-outdent', title: 'Outdent', onclick: _.onClickOutdent})
            ] : null,
            model.toolbar.alignLeft !== false && !model.markdown ? [
                _.button({class: 'widget widget--button default small fa fa-align-left', title: 'Left', onclick: _.onClickAlignLeft})
            ] : null,
            model.toolbar.center !== false && !model.markdown ? [
                _.button({class: 'widget widget--button default small fa fa-align-center', title: 'Center', onclick: _.onClickAlignCenter})
            ] : null,
            model.toolbar.justify !== false && !model.markdown ? [
                _.button({class: 'widget widget--button default small fa fa-align-justify', title: 'Justify', onclick: _.onClickAlignJustify})
            ] : null,
            model.toolbar.alignRight !== false && !model.markdown ? [
                _.button({class: 'widget widget--button default small fa fa-align-right', title: 'Right', onclick: () => _.onClickAlignRight})
            ] : null,

            _.div({class: 'widget-group__separator line'}),
            
            _.button({class: 'widget widget--button default small fa fa-link', title: 'Create link', onclick: _.onClickLink}),
            
            _.div({class: 'widget-group__separator line'}),
            
            _.button({class: 'widget widget--button default small fa fa-remove', title: 'Remove formatting', onclick: _.onClickRemoveFormat}),
        )
    ] : null,
    _.div({class: 'widget--rich-text__view'},
        !model.disabled ? [
            model.markdown ? [
                _.textarea({name: 'editor', class: 'widget--rich-text__editor'})
            ] : [
                _.div({name: 'editor', class: 'widget--rich-text__editor'})
            ]
        ] : [
            _.div({name: 'editor', class: 'widget--rich-text__editor'}) 
        ]
    )
)
