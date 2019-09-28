'use strict';

module.exports = (_, model, state) =>

_.div({class: 'field--rich-text-editor__content'},
    _.div({class: 'field--rich-text-editor__header'},
        _.div({class: 'field--rich-text-editor__header__tabs'},
            _.button({class: `field--rich-text-editor__header__tab ${state.name !== 'html' && state.name !== 'markdown' ? 'active' : ''}`, onclick: _.onClickVisualTab}, 'Visual'),
            _.if(!model.config.isMarkdownDisabled,
                _.button({class: `field--rich-text-editor__header__tab ${state.name === 'markdown' ? 'active' : ''}`, onclick: _.onClickMarkdownTab}, 'Markdown')
            ),
            _.if(!model.config.isHtmlDisabled,
                _.button({class: `field--rich-text-editor__header__tab ${state.name === 'html' ? 'active' : ''}`, onclick: _.onClickHtmlTab}, 'HTML')
            )
        ),
        _.div({class: 'field--rich-text-editor__header__tools'},
            _.if(!model.config.isMediaDisabled,
                _.button({class: 'field--rich-text-editor__header__tool widget widget--button small default fa fa-file-image-o', title: 'Insert media', onclick: _.onClickInsertMedia})
            )
        )
    ),
    _.div({class: 'field--rich-text-editor__body'},
        state.name !== 'markdown' && state.name !== 'html' ?
            _.richtext({name: 'input', value: state.value, toolbar: model.config.wysiwygToolbar, onchange: _.onChange})
        :
            _.text({name: 'input', code: true, value: state.value, onchange: _.onChange})
    )
)
