'use strict';

/**
 * A dialog for editing publishing settings for Content nodes
 *
 * @memberof HashBrown.Client.EntityView.Modal
 */
class ContentPublishingSettings extends HashBrown.Entity.View.Modal.ModalBase {
    /**
     * Constructor
     */
    constructor(params) {
        super(params);

        this.template = require('template/modal/contentPublishingSettings');
    }

    /**
     * Fetches the model
     */
    async fetch() {
        if(!this.model.settings) { this.model.settings = {}; }
        if(!this.model.settings.publishing) { this.model.settings.publishing = {}; }

        this.state.value = await this.model.getSettings('publishing') || {};
        this.state.title = this.model.prop('title', HashBrown.Context.language) || this.model.id;

        if(this.state.value.governedBy) {
            let content = await HashBrown.Service.ContentService.getContentById(this.state.value.governedBy);
        
            throw new Error(`(Settings inherited from <a href="#/content/${content.id}">${content.prop('title', HashBrown.Context.language) || content.id}</a>)`);
        }

        let connections = await HashBrown.Service.ConnectionService.getAllConnections();

        this.state.connections = {};

        for(let connection of connections) {
            this.state.connections[connection.title] = connection.id;
        }
    }

    /**
     * Event: Change apply to children checkbox
     */
    onToggleApplyToChildren(apply) {
        this.model.settings.publishing.applyToChildren = apply;
    }

    /**
     * Event: Change connection
     */
    onChangeConnection(connectionId) {
        this.model.settings.publishing.connectionId = connectionId;
    }

    /**
     * Event: Click OK
     */
    async onClickOK() {
        try {
            await HashBrown.Service.ResourceService.set('content', this.model.id, this.model);
            
            HashBrown.Service.EventService.trigger('settings', this.model.id); 

            this.close();

        } catch(e) {
            this.setErrorState(e);

        }
    }
}

module.exports = ContentPublishingSettings;
