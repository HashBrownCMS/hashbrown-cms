'use strict';

/**
 * The editor for media resources
 */
class MediaEditor extends HashBrown.Entity.View.ResourceEditor.ResourceEditorBase {
    static get itemType() { return HashBrown.Entity.Resource.Media; }
    
    /**
     * Constructor
     */
    constructor(params) {
        super(params);
        
        this.template = require('template/resourceEditor/mediaEditor.js');    
    }

    /**
     * Fetches the view data
     */
    async fetch() {
        await super.fetch();

        if(this.state.name) { return; }

        this.state.icon = 'file-o';
        this.state.title = this.model ? this.model.name || this.model.id : '';

        if(this.model && this.model.isVideo()) {
            this.state.icon = 'file-video-o';
        }
        
        if(this.model && this.model.isImage()) {
            this.state.icon = 'file-image-o';
        }
    }
    
    /**
     * Override this check, as it's not relevant to media
     */
    editedCheck() {}

    /**
     * Event: Clicked start tour
     */
    onClickStartTour() {
        HashBrown.Service.MediaService.startTour();
    }
   
    /**
     * Event: Click new
     */
    onClickNew() {
        let modal = new HashBrown.Entity.View.Modal.UploadMedia();
            
        modal.on('success', (ids) => {
            if(ids) {
                location.hash = '/media/' + ids[0];
            }
        });
    }
}

module.exports = MediaEditor;
