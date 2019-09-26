'use strict';

/**
 * A media preview and selector
 *
 * @memberof HashBrown.Client.Entity.View.Widget
 */
class Media extends HashBrown.Entity.View.Widget.WidgetBase {
    /**
     * Constructor
     */
    constructor(params) {
        super(params);

        this.template = require('template/widget/media');
    }

    /**
     * Fetches view data
     */
    async fetch() {
        this.state = {};

        if(this.model.value) {
            let media = await HashBrown.Service.MediaService.getMediaById(this.model.value);
            
            this.state.source = `/media/${HashBrown.Context.projectId}/${HashBrown.Context.environment}/${media.id}?width=300`;
            
            if(media.isImage()) {
                this.state.tagName = 'img';
            } else if(media.isVideo()) {
                this.state.tagName = 'video';
            } else {
                this.state.tagName = 'div';
            }

            this.state.title = media.name;
        }
    }

    /**
     * Event: Click clear
     */
    onClickClear() {
        this.model.value = null;

        this.update();
    }

    /**
     * Event: Click browse
     */
    onClickBrowse() {
        new HashBrown.Entity.View.Modal.MediaBrowser({
            model: {
                value: this.model.value
            }
        })
        .on('pick', (id) => {
            this.model.value = id;

            this.onChange();

            this.update();
        });
    }
}

module.exports = Media;
