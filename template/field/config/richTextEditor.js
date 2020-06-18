'use strict';

module.exports = (_, model, state) => [

_.field({label: 'Disable media'},
    _.checkbox({tooltip: 'Hides the media picker if enabled', name: 'isMediaDisabled', value: model.config.isMediaDisabled || false, onchange: _.onChangeConfig})
),
_.field({label: 'Disable visual'},
    _.checkbox({tooltip: 'Hides the visual tab if enabled', name: 'isVisualDisabled', value: model.config.isVisualDisabled || false, onchange: _.onChangeConfig})
),
_.field({label: 'Disable markdown'},
    _.checkbox({tooltip: 'Hides the markdown tab if enabled', name: 'isMarkdownDisabled', value: model.config.isMarkdownDisabled || false, onchange: _.onChangeConfig})
),
_.field({label: 'Disable HTML'},
    _.checkbox({tooltip: 'Hides the HTML tab if enabled', name: 'isHtmlDisabled', value: model.config.isHtmlDisabled || false, onchange: _.onChangeConfig})
),
_.field({label: 'Toolbar'},
    _.popup({multiple: true, options: state.toolbarOptions, value: state.toolbarValue, onchange: _.onChangeConfigToolbar})
)

]
