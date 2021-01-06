'use strict';

module.exports = (_, model, state) => [

_.field({localized: true, label: 'Disable media'},
    _.checkbox({disabled: model.isLocked, localized: true, tooltip: 'Hides the media picker if enabled', name: 'isMediaDisabled', value: model.config.isMediaDisabled || false, onchange: _.onChangeConfig})
),
_.field({localized: true, label: 'Disable visual'},
    _.checkbox({disabled: model.isLocked, localized: true, tooltip: 'Hides the visual tab if enabled', name: 'isVisualDisabled', value: model.config.isVisualDisabled || false, onchange: _.onChangeConfig})
),
_.field({localized: true, label: 'Disable markdown'},
    _.checkbox({disabled: model.isLocked, localized: true, tooltip: 'Hides the markdown tab if enabled', name: 'isMarkdownDisabled', value: model.config.isMarkdownDisabled || false, onchange: _.onChangeConfig})
),
_.field({localized: true, label: 'Disable HTML'},
    _.checkbox({disabled: model.isLocked, localized: true, tooltip: 'Hides the HTML tab if enabled', name: 'isHtmlDisabled', value: model.config.isHtmlDisabled || false, onchange: _.onChangeConfig})
),
_.field({localized: true, label: 'Toolbar'},
    _.popup({disabled: model.isLocked, localized: true, multiple: true, options: state.toolbarOptions, value: state.toolbarValue, onchange: _.onChangeConfigToolbar})
)

]
