'use strict';

/**
 * A browser modal for Media objects
 *
 * @memberof HashBrown.Entity.Client.View.Modal
 */
class MediaBrowser extends HashBrown.Entity.View.Modal.ModalBase {
    /**
     * Constructor
     */
    constructor(params) {
        super(params);
    
        this.template = require('template/modal/mediaBrowser');

        this.state.iframeUrl = location.href.replace(location.hash, '') + '?isMediaPicker=true#/media/' + (this.model.value || '');
    }

    /**
     * Event: Iframe loaded
     */
    onLoadIframe() {
        let iframe = this.namedChildren.iframe;

        if(!iframe) { return; }

        iframe.contentWindow.HashBrown.Service.MediaService.initMediaPickerMode(
            (id) => { this.onPickMedia(id); },
            () => { this.onChangeResource(); },
            (e) => { this.setErrorState(e); }
        );
    }

    /**
     * Event: Pick Media
     *
     * @param {string} id
     */
    onPickMedia(id) {
        this.model.value = id;
    }

    /** 
     * Event: Click select
     */
    onClickSelect() {
        if(!this.model.value) { return; }
        
        this.trigger('select', this.model.value);

        this.close();
    }
    
    /**
     * Event: Change resource
     */
    onChangeResource() {
        HashBrown.Service.EventService.trigger('resource');
    }
}

module.exports = MediaBrowser;
