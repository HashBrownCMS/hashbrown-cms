'use strict';

/**
 * An editor for displaying Media objects
 *
 * @memberof HashBrown.Client.View.Editor
 */
class MediaViewer extends HashBrown.View.Editor.ResourceEditor {
    /**
     * Constructor
     */
    constructor(params) {
        super(params);

        this.fetch();
    }

    /**
     * Fetches the model
     */
    async fetch() {
        try {
            this.model = await HashBrown.Service.MediaService.getMediaById(this.modelId);

            super.fetch();

        } catch(e) {
            UI.errorModal(e);

        }
    }
    
    /**
     * Checks whether this resource is currently being edited (not used)
     */
    editedCheck() {}
    
    /**
     * Event: Heartbeat (not used)
     */
    async onHeartbeat() {}

    /**
     * Renders this editor
     */
    template() {
        let mediaSrc = '/media/' + HashBrown.Service.ProjectService.currentProject + '/' + HashBrown.Service.ProjectService.currentEnvironment + '/' + this.model.id + '?width=800&t=' + Date.now();

        return _.div({class: 'editor editor--media'},
            _.div({class: 'editor__header'},
                _.span({class: 'editor__header__icon fa fa-file-image-o'}),
                _.h4({class: 'editor__header__title'},
                    this.model.name,
                    _.span({class: 'editor__header__title__appendix'},
                        this.model.getContentTypeHeader()    
                    )
                )
            ),
            _.div({class: 'editor__body'},
                _.do(() => {
                    if(this.model.isImage()) {
                        return _.img({class: 'editor--media__preview', src: mediaSrc});
                    
                    } else if(this.model.isVideo()) {
                        return _.video({class: 'editor--media__preview', controls: true},
                            _.source({src: mediaSrc, type: this.model.getContentTypeHeader()})
                        );
                    
                    } else if(this.model.isAudio()) {
                        return _.audio({class: 'editor--media__preview', controls: true},
                            _.source({src: mediaSrc, type: this.model.getContentTypeHeader()})
                        );
                    }
                })
            )
        );
    }
}

module.exports = MediaViewer;
