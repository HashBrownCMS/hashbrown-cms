'use strict';

const MediaHelperCommon = require('Common/Helpers/MediaHelper');

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
        return HashBrown.Helpers.RequestHelper.request('get', 'media/tree');
    }

    /**
     * Gets whether the Media provider exists
     *
     * @returns {Promise} Promise
     */
    static checkMediaProvider() {
        return HashBrown.Helpers.SettingsHelper.getSettings(HashBrown.Helpers.ProjectHelper.currentProject, HashBrown.Helpers.ProjectHelper.currentEnvironment, 'providers')
        .then((result) => {
            if(!result || !result.media) {
                return Promise.reject(new Error('No Media provider has been set for this project. Please make sure one of your <a href="#/connections/">Connections</a> has the "is Media provider" setting switched on.'));
            }  

            return Promise.resolve();
        }); 
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
     * @return {Promise} Media object
     */
    static getMediaById(id) {
        if(!id) { return Promise.resolve(null); }
        
        return HashBrown.Helpers.ResourceHelper.get(HashBrown.Models.Media, 'media', id);
    }
    
    /**
     * Gets all Media objects
     *
     * @return {Promise} Media objects
     */
    static getAllMedia(id) {
        return HashBrown.Helpers.ResourceHelper.get(HashBrown.Models.Media, 'media');
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
        return HashBrown.Helpers.RequestHelper.request('post', 'media/tree/' + id, item);
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
            let isMediaView = location.hash.indexOf('#/media/') === 0;

            if(isMediaView) {
                let id = location.hash.replace('#/media/', '');

                onPickMedia(id);
            }
        }); 
       
        // Listen for resource change
        HashBrown.Views.Navigation.NavbarMain.reload = () => {
            Crisp.View.get('NavbarMain').reload();

            onChangeResource();
        };

        // Set visual fixes for media picker mode
        $('.page--environment').addClass('media-picker');
    }
}

module.exports = MediaHelper;
