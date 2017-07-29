'use strict';

const Media = require('Common/Models/Media');

/**
 * An editor for displaying Media objects
 *
 * @memberof HashBrown.Client.Views.Editors
 */
class MediaViewer extends View {
    constructor(params) {
        super(params);
        
        this.$element = _.div({class: 'editor media-viewer'});

        this.fetch();
    }

    render() {
        if(this.model instanceof Media === false) {
            this.model = new Media(this.model);        
        }

        let mediaSrc = '/media/' + ProjectHelper.currentProject + '/' + ProjectHelper.currentEnvironment + '/' + this.model.id;

        this.$element.empty().append(
            _.div({class: 'editor-header media-heading'},
                _.span({class: 'fa fa-file-image-o'}),
                _.h4({class: 'media-title'},
                    this.model.name,
                    _.span({class: 'media-data'},
                        this.model.getContentTypeHeader()    
                    )
                )
            ),
            _.div({class: 'media-preview editor-body'},
                _.if(this.model.isImage(),
                    _.img({src: mediaSrc})
                ),
                _.if(this.model.isVideo(),
                    _.video({controls: true, src: mediaSrc})
                )
            )
        );
    }
}

module.exports = MediaViewer;
