'use strict';

module.exports = (_, model, state) =>

_.div({class: `editor widget--rich-text ${model.disabled ? 'disabled' : ''}`},
    !model.disabled && !!model.toolbar ? [
        _.div({class: 'widget--rich-text__toolbar'},
            _.popup({name: 'paragraph', value: 'p', options: state.paragraphOptions, onchange: _.onChangeParagraph}),
            
            _.div({class: 'widget-group__separator'}),

            model.toolbar.bold !== false ? [
                _.button({class: 'widget widget--button default small fa fa-bold', title: 'Bold', onclick: _.onClickBold})
            ] : null,
            model.toolbar.italic !== false ? [
                _.button({class: 'widget widget--button default small fa fa-italic', title: 'Italic', onclick: _.onClickItalic})
            ] : null,
            
            model.toolbar.quotation !== false || model.toolbar.code !== false ? [
                _.div({class: 'widget-group__separator line'})
            ] : null,
           
            model.toolbar.quotation !== false ? [
                _.button({class: 'widget widget--button default small fa fa-quote-left', title: 'Quotation', onclick: _.onClickQuotation})
            ] : null,
            model.toolbar.code !== false ? [
                _.button({class: 'widget widget--button default small fa fa-code', title: 'Code', onclick: _.onClickCode})
            ] : null,

            model.toolbar.orderedList !== false || model.toolbar.unorderedList !== false ? [
                _.div({class: 'widget-group__separator line'})
            ] : null,
            
            model.toolbar.orderedList !== false ? [
                _.button({class: 'widget widget--button default small fa fa-list-ol', title: 'Ordered list', onclick: _.onClickOrderedList})
            ] : null,

            model.toolbar.unorderedList !== false ? [
                _.button({class: 'widget widget--button default small fa fa-list-ul', title: 'Unordered list', onclick: _.onClickUnorderedList})
            ] : null,

            _.div({class: 'widget-group__separator line'}),
            
            _.button({class: 'widget widget--button default small fa fa-link', title: 'Create link', onclick: _.onClickLink}),
            
            _.div({class: 'widget-group__separator line'}),
            
            _.button({class: 'widget widget--button default small fa fa-remove', title: 'Remove formatting', onclick: _.onClickRemoveFormat}),
        )
    ] : null,
    _.div({name: 'editor', class: 'widget--rich-text__editor'})
)
