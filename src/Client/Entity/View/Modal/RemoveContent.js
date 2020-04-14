'use strict';

/**
 * The modal for removing content
 *
 * @memberof HashBrown.Client.Entity.View.Modal
 */
class RemoveContent extends HashBrown.Entity.View.Modal.ModalBase {
    /**
     * Constructor
     */
    constructor(params) {
        super(params);

        this.template = require('template/modal/removeContent');
    }

    /**
     * Fetches the view data
     */
    async fetch() {
        if(!this.model.contentId) { throw new Error('Missing content id'); }

        this.state.content = await HashBrown.Entity.Resource.Content.get(this.model.contentId);
        this.state.title = this.state.content.prop('title', HashBrown.Client.language) || this.state.content.id;
    }

    /**
     * Event: Selected schema
     *
     * @param {String} schemaId
     */
    async onChangeDeleteChildren(newValue) {
        this.state.deleteChildren = newValue;
    }

    /**
     * Event: Click delete
     */
    async onClickDelete() {
        this.trigger('delete');

        await HashBrown.Service.RequestService.request('delete', 'content/' + this.model.contentId + '?removeChildren=' + (this.state.deleteChildren || false));

        HashBrown.Service.EventService.trigger('resource', this.model.contentId);  

        if(location.hash.indexOf(this.model.contentId) > -1) {
            location.hash = '/content/'
        }

        this.close();
    }
}

module.exports = RemoveContent;
