'use strict';

/**
 * An editor for displaying Media objects
 *
 * @memberof HashBrown.Client.Views.Editors
 */
class MediaViewer extends Crisp.View {
    /**
     * Constructor
     */
    constructor(params) {
        super(params);

        this.fetch();
    }

    /**
     * Pre render
     */
    prerender() {
        if(this.model instanceof HashBrown.Models.Media === false) {
            this.model = new HashBrown.Models.Media(this.model);        
        }

    }

    /**
     * Renders this editor
     */
    template() {
        let mediaSrc = '/media/' + HashBrown.Helpers.ProjectHelper.currentProject + '/' + HashBrown.Helpers.ProjectHelper.currentEnvironment + '/' + this.model.id + '?width=800&t=' + Date.now();

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
                _.if(this.model.isImage(),
                    _.img({class: 'editor--media__preview', src: mediaSrc})
                ),
                _.if(this.model.isVideo(),
                    _.video({class: 'editor--media__preview', controls: true},
                        _.source({src: mediaSrc, type: this.model.getContentTypeHeader()})
                    )
                ),
                _.if(this.model.isAudio(),
                    _.audio({class: 'editor--media__preview', controls: true},
                        _.source({src: mediaSrc, type: this.model.getContentTypeHeader()})
                    )
                )
            )
        );
    }
}

module.exports = MediaViewer;
