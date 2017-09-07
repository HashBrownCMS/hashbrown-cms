'use strict';

const MediaHelperCommon = require('Common/Helpers/MediaHelper');

const RequestHelper = require('Client/Helpers/RequestHelper');

/**
 * The client side media helper
 *
 * @memberof HashBrown.Client.Helpers
 */
class MediaHelper extends MediaHelperCommon {
    /**
     * Gets the Media tree
     *
     * @returns {Promise(Object)} tree
     */
    static getTree() {
        return RequestHelper.request('get', 'media/tree');
    }

    /**
     * Gets Media object by id synchronously
     *
     * @param {String} id
     *
     * @return {Media} Media object
     */
    static getMediaByIdSync(id) {
        for(let i = 0; i < resources.media.length; i++) {
            let media = resources.media[i];

            if(media.id == id) {
                return media;
            }
        }

        return null;
    }

    /**
     * Gets the Media Url
     */
    static getMediaUrl(id) {
        return '/media/' + ProjectHelper.currentProject + '/' + ProjectHelper.currentEnvironment + '/' + id;
    } 

    /**
     * Gets Media object by id
     *
     * @param {String} id
     *
     * @return {Promise(Media)}
     */
    static getMediaById(id) {
        return new Promise((resolve, reject) => {
            for(let i = 0; i < resources.media.length; i++) {
                let media = resources.media[i];

                if(media.id == id) {
                    resolve(media);
                    return;
                }
            }

            reject(new Error('Media with id "' + id + '" not found'));
        });
    }

    /**
     * Sets a Media tree item
     *
     * @param {String} id
     * @param {Object} item
     *
     * @returns {Promise} promise
     */
    static setTreeItem(id, item) {
        return RequestHelper.request('post', 'media/tree/' + id, item);
    }

    /**
     * Initialises the media picker mode
     *
     * @param {Function} onPickMedia
     * @param {Function} onChangeResource
     * @param {Object} allResources
     */
    static initMediaPickerMode(onPickMedia, onChangeResource, onError, allResources) {
        // Claim debug messages
        UI.errorModal = onError;
        
        // Use the provided resources instead of reloading them
        HashBrown.Helpers.RequestHelper.reloadAllResources = () => {
            resources = allResources;

            return Promise.resolve();
        };

        // Listen for picked Media
        window.addEventListener('hashchange', () => {
            let mediaMatch = location.hash.match(/#\/media\/([0-9a-z]{40})/); 

            if(mediaMatch && mediaMatch.length > 1) {
                onPickMedia(mediaMatch[1]);
            }
        }); 
       
        // Listen for resource change
        HashBrown.Views.Navigation.NavbarMain.reload = () => {
            ViewHelper.get('NavbarMain').reload();

            onChangeResource();
        };

        // Set visual fixes for media picker mode
        $('.cms-container').addClass('media-picker-mode');

        // Skip the loading screen
        $('.cms-container').removeClass('faded');
    }
}

module.exports = MediaHelper;
