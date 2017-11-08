'use strict';

const ProjectHelper = require('Client/Helpers/ProjectHelper');

const Media = require('Common/Models/Media');

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
        if(this.model instanceof Media === false) {
            this.model = new Media(this.model);        
        }

    }

    /**
     * Renders this editor
     */
    template() {
        let mediaSrc = this.model.url || '/media/' + ProjectHelper.currentProject + '/' + ProjectHelper.currentEnvironment + '/' + this.model.id;

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
                    _.video({class: 'editor--media__preview', controls: true, src: mediaSrc})
                )
            )
        );
    }
}

module.exports = MediaViewer;
