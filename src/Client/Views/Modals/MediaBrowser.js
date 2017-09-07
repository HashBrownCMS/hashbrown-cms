'use strict';

const Media = require('Common/Models/Media');

const MediaHelper = require('Client/Helpers/MediaHelper');
const RequestHelper = require('Client/Helpers/RequestHelper');
const ProjectHelper = require('Client/Helpers/ProjectHelper');
const SettingsHelper = require('Client/Helpers/SettingsHelper');

/**
 * A browser modal for Media objects
 *
 * @memberof HashBrown.Client.Views.Modals
 */
class MediaBrowser extends View {
    constructor(params) {
        super(params);

        // First check if an active Connection is set up to be a Media provider
        this.init();
        
        // Make sure the modal is removed when it's cancelled
        this.$element.on('hidden.bs.modal', () => {
           this.$element.remove(); 
        });

        // Show the modal
        this.$element.modal('show');

        // Init the media picker mode inside the iframe
        let iframe = this.$element.find('iframe')[0];
            
        iframe.onload = () => {    
            iframe.contentWindow.HashBrown.Helpers.MediaHelper.initMediaPickerMode(
                (id) => { this.onPickMedia(id); },
                () => { this.onChangeResource(); },
                (e) => { UI.errorModal(e); },
                resources
            );
        };
    }

    /**
     * Gets whether the media provider exists
     *
     * @returns {Promise} Promise
     */
    static checkMediaProvider() {
        return SettingsHelper.getSettings(ProjectHelper.currentProject, ProjectHelper.currentEnvironment, 'providers')
        .then((result) => {
            if(!result || !result.media) {
                return Promise.reject(new Error('No Media provider has been set for this project. Please make sure one of your <a href="#/connections/">Connections</a> have the "is Media provider" parameter switched on.'));
            }  

            return Promise.resolve();
        }); 
    }

    /**
     * Event: Pick Media
     *
     * @param {string} id
     */
    onPickMedia(id) {
        this.value = id;
    }

    /** 
     * Event: Click OK
     */
    onClickOK() {
        if(this.value) {
            this.trigger('select', this.value);
        }

        this.$element.modal('hide');
    }
    
    /** 
     * Event: Click cancel
     */
    onClickCancel() {
        this.$element.modal('hide');
    }

    /**
     * Event: Change resource
     */
    onChangeResource() {
        RequestHelper.reloadResource('media')
        .then(() => {
            HashBrown.Views.Navigation.NavbarMain.reload();
        });
    }

    /**
     * Render the media browser
     */
    template() {
        return _.div({class: 'modal fade media-browser'}, 
            _.div({class: 'modal-dialog'},
                _.div({class: 'modal-content'},
                    _.div({class: 'modal-header'},
                        _.h4({class: 'modal-title'}, 'Browsing media')
                    ),
                    _.div({class: 'modal-body'},
                        _.iframe({src: '/' + ProjectHelper.currentProject + '/' + ProjectHelper.currentEnvironment + '/#/media/' + (this.value || '')})
                    ),
                    _.div({class: 'modal-footer'},
                        _.button({class: 'btn btn-default'},
                            'Cancel'
                        ).click(() => {
                            this.onClickCancel();
                        }),
                        _.button({class: 'btn btn-primary'},
                            'OK'
                        ).click(() => {
                            this.onClickOK();
                        })
                    )
                )
            )
        );
    }
}

module.exports = MediaBrowser;
