const ProjectHelper = require('Client/Helpers/ProjectHelper');

module.exports = function() {
    let paneNames = this.currentPath.match(/[^\/]+/g) || [];

    paneNames.unshift('/');

    let panePath = paneNames[0];
    let placedFolders = {};

    return _.div({class: 'modal fade media-browser'}, 
        _.div({class: 'modal-dialog'},
            _.div({class: 'modal-content'},
                _.div({class: 'modal-header'},
                    _.div({class: 'input-group'}, 
                        _.input({class: 'form-control input-search-media', placeholder: 'Search media'})
                            .on('change keyup paste', () => {
                                this.onSearchMedia();
                            }),
                        _.div({class: 'input-group-btn'},
                            _.button({class: 'btn btn-primary'},
                                'Upload file'
                            ).click(() => { this.onClickUpload(); })
                        )
                    )
                ),
                _.div({class: 'modal-body'},
                    _.div({class: 'panes'},

                        // Render all panes
                        _.each(paneNames, (i , paneName) => {
                            let $pane = _.div({class: 'pane', 'data-path': panePath},
                                // Append all files
                                _.each(resources.media, (i, media) => {
                                    // If this Media object doesn't belong in this pane, maybe a parent folder does
                                    if(media.folder !== panePath) {
                                        let folderName = media.folder;
                                        folderName = folderName.replace(panePath, '');
                                        folderName = (folderName.match(/[^\/]+/g) || [ folderName ])[0];

                                        let folderPath = panePath + folderName + '/';
                                    
                                        if(placedFolders[folderPath] || media.folder === panePath) { return; }

                                        placedFolders[folderPath] = true;
                                        
                                        return _.button({class: 'folder', 'data-path': folderPath}, folderName).click((e) => { this.onClickFolder(folderPath); });
                                    
                                    // This Media object belongs in this pane
                                    } else {
                                        return _.button(
                                            {
                                                class: 'file ' + (this.value == media.id ? 'active' : ''),
                                                'data-id': media.id,
                                                'data-name': media.name,
                                            },
                                            _.if(media.isVideo(),
                                                _.video({src: '/media/' + ProjectHelper.currentProject + '/' + ProjectHelper.currentEnvironment + '/' + media.id})
                                            ),
                                            _.if(media.isImage(),
                                                _.img({src: '/media/' + ProjectHelper.currentProject + '/' + ProjectHelper.currentEnvironment + '/' + media.id})
                                            ),
                                            media.name
                                        ).click(() => {
                                            this.$element.find('.file').toggleClass('active', false);
                                            $media.toggleClass('active', true);
                                        });
                                    }
                                })
                            );

                            panePath += paneName + '/';

                            return $pane;
                        }) 
                    )
                ),
                _.div({class: 'modal-footer'},
                    _.button({class: 'btn btn-default'},
                        'Cancel'
                    ).click(() => {
                        this.onClickCancel();
                    }),
                    _.button({class: 'btn btn-primary'},
                        'OK'
                    ).click(() => {
                        this.onClickOK();
                    })
                )
            )
        )
    );
};
