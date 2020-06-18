'use strict';

module.exports = (_, model, state) =>

_.div({class: 'field--rich-text-editor__content'},
    !model.isDisabled ? [
        _.div({class: 'field--rich-text-editor__header'},
            _.div({class: 'field--rich-text-editor__header__tabs'},
                !model.config.isVisualDisabled ? [
                    _.button({class: `field--rich-text-editor__header__tab ${state.name === 'visual' ? 'active' : ''}`, onclick: _.onClickVisualTab}, 'Visual')

                ] : null,

                !model.config.isMarkdownDisabled ? [
                    _.button({class: `field--rich-text-editor__header__tab ${state.name === 'markdown' ? 'active' : ''}`, onclick: _.onClickMarkdownTab}, 'Markdown')

                ] : null,

                !model.config.isHtmlDisabled ? [
                    _.button({class: `field--rich-text-editor__header__tab ${state.name === 'html' ? 'active' : ''}`, onclick: _.onClickHtmlTab}, 'HTML')

                ] : null
            ),
            _.div({class: 'field--rich-text-editor__header__tools'},
                !model.config.isMediaDisabled ? [
                    _.button({class: 'field--rich-text-editor__header__tool widget widget--button small default fa fa-file-image-o', title: 'Insert media', onclick: _.onClickInsertMedia})

                ] : null
            )
        )
    ] : null,
    _.div({class: 'field--rich-text-editor__body'},
        state.name === 'visual' ? [
            _.richtext({disabled: model.isDisabled, name: 'input', value: state.value, toolbar: model.config.toolbar, onchange: _.onChange})

        ] : state.name == 'markdown' ? [
            _.richtext({disabled: model.isDisabled, name: 'input', markdown: true, value: state.value, toolbar: model.config.toolbar, onchange: _.onChange})
            
        ] : [
            _.text({disabled: model.isDisabled, name: 'input', code: true, value: state.value, onchange: _.onChange})

        ]
    )
)
