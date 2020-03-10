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
        this.state = {
            source: '',
            title: '',
            tagName: 'div'
        };

        if(this.model.value) {
            let media = this.model.value;

            if(typeof media === 'string') {
                media = await HashBrown.Entity.Resource.Media.get(media);
            }

            this.state.source = `/media/${HashBrown.Context.projectId}/${HashBrown.Context.environment}/${media.id}?t=${Date.now()}${this.model.full ? '' : '&width=300'}`;
            
            if(media.isImage()) {
                this.state.tagName = 'img';
            } else if(media.isVideo()) {
                this.state.tagName = 'video';
            }

            this.state.title = media.name;
        }
    }
    
    /**
     * Gets the placeholder element
     *
     * @return {HTMLElement} Placeholder
     */
    getPlaceholder(_, model, state) {
        return _.div({class: 'widget--media__placeholder'});
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
