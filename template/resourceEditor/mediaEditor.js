'use strict';

module.exports = (_, model, state) =>

_.div({class: 'resource-editor resource-editor--media-editor'},
    _.include(require('./inc/header')),
    _.div({class: 'resource-editor__body', name: 'body'},
        state.name === 'error' ? [
            _.div({class: 'widget widget--message centered warn'},
                state.message
            )
        
        ] : state.tab === 'overview' ? [
            _.div({class: 'resource-editor__welcome'},
                _.h1({localized: true, class: 'resource-editor__welcome__heading'},
                    state.title,
                    _.span({class: `resource-editor__welcome__heading__icon fa fa-${state.icon}`})
                ),
                _.p({localized: true}, 'Click any item in the panel to view it.'),
                _.p({localized: true}, 'Use the context menu (right click or the ⋮ button) to perform other actions.'),
                _.h2({localized: true}, 'Actions'),
                _.div({class: 'resource-editor__welcome__actions'},
                    _.button({localized: true, class: 'widget widget--button condensed', onclick: _.onClickNew, title: 'Upload new media'}, 'Upload media'),
                    _.button({localized: true, class: 'widget widget--button condensed hidden-phone', onclick: _.onClickStartTour, title: 'Start a tour of the UI'}, 'Quick tour')
                )
            )

        ] : state.tab === 'settings' ? [
            _.field({localized: true, label: 'Public URL', description: 'The base URL from which the files will be publicly accessible'}, 
                _.div({class: 'widget-group'},
                    _.text({name: 'publicUrl', value: state.settings.mediaPublicUrl, onchange: _.onChangePublicUrl }),
                    _.button({class: 'widget widget--button small fa fa-refresh', title: 'Generate public URL', onclick: _.onClickGeneratePublicUrl})
                )
            ),
            _.field({localized: true, label: 'File handling', description: 'How to read/write media files', size: 2},
                state.deployerEditor
            )

        ] : [
            _.div({class: 'resource-editor__body', name: 'body'},
                _.field({localized: true, label: 'Full'},
                    _.media({nocache: true, readonly: true, value: model.id, full: true}),
                    _.file({class: 'margin-top', filenames: [ model.filename ], onchange: _.onChangeFull})
                ),
                !model.isSvg() ? [
                    _.field({localized: true, label: 'Thumbnail'},
                        _.partial('thumbnail', (_, model, state) =>
                            _.img({class: 'widget widget--image', src: state.thumbnailSource})
                        ),
                        _.file({accept: '.jpg,.jpeg,.JPG,.JPEG', clearable: true, filenames: [ 'thumbnail.jpg' ], onchange: _.onChangeThumbnail})
                    )
                ] : null,
                _.field({localized: true, label: 'Folder', tools: { move: { icon: 'folder', tooltip: 'Move', handler: _.onClickMove } }},
                    _.text({value: model.folder, onchange: _.onChangeFolder})
                ),
                _.field({localized: true, label: 'Caption'},
                    _.text({disabled: model.isLocked, value: model.caption, onchange: _.onChangeCaption})
                ),
                _.field({localized: true, label: 'Author', size: 2},
                    _.field({localized: true, label: 'Name'},
                        _.text({disabled: model.isLocked, value: model.author.name, onchange: _.onChangeAuthorName})
                    ),
                    _.field({localized: true, label: 'URL'},
                        _.text({disabled: model.isLocked, value: model.author.url, onchange: _.onChangeAuthorUrl})
                    )
                ),
                _.field({localized: true, label: 'Copyright', size: 2},
                    _.field({localized: true, label: 'Name'},
                        _.text({disabled: model.isLocked, value: model.copyrightHolder.name, onchange: _.onChangeCopyrightHolderName})
                    ),
                    _.field({localized: true, label: 'URL'},
                        _.text({disabled: model.isLocked, value: model.copyrightHolder.url, onchange: _.onChangeCopyrightHolderUrl})
                    ),
                    _.field({localized: true, label: 'Year'},
                        _.number({disabled: model.isLocked, value: model.copyrightYear, onchange: _.onChangeCopyrightYear})
                    ),
                )
            ),
        ]
    ),
    _.include(require('./inc/footer'))
)
