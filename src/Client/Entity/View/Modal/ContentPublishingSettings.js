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
        try {
            this.state.value = await this.model.getSettings('publishing') || {};
            this.state.modelTitle = this.model.prop('title', HashBrown.Context.language);

            if(!this.state.value) {
                throw new Error('Failed to retrieve publishing settings');
            }

            if(this.state.value.governedBy) {
                let content = await HashBrown.Service.ContentService.getContentById(this.state.value.governedBy);
            
                throw new Error(`(Settings inherited from <a href="#/content/${content.id}">${content.prop('title', HashBrown.Context.language)}</a>)`);
            }

            let connections = await HashBrown.Service.ConnectionService.getAllConnections();

            this.state.connections = {};

            for(let connection of connections) {
                this.state.connections[connection.title] = connection.id;
            }

        } catch(e) {
            this.setErrorState(e);

        }
    }

    /**
     * Event: Change apply to children checkbox
     */
    onToggleApplyToChildren(apply) {
        this.state.value.applyToChildren = apply;
    }

    /**
     * Event: Change connection
     */
    onChangeConnection(connectionId) {
        this.state.value.connectionId = connectionId;
    }

    /**
     * Event: Click OK
     */
    onClickOK() {
        this.trigger('change', this.state.value);

        this.close();
    }
}

module.exports = ContentPublishingSettings;
