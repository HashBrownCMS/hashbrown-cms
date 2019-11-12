'use strict';

/**
 * The client side media helper
 *
 * @memberof HashBrown.Client.Service
 */
class MediaService extends require('Common/Service/MediaService') {
    /**
     * Converts a file to base64
     *
     * @param {File} file
     *
     * @return {String} Base64
     */
    static async convertFileToBase64(file) {
        checkParam(file, 'file', File, true);

        return await new Promise((resolve) => {
            let reader = new FileReader();
           
            reader.onload = (e) => {
                let base64 = e.target.result;

                base64 = base64.replace('data:' + file.type + ';base64,', '');

                resolve(base64);
            }
            
            reader.readAsDataURL(file);
        });
    }

    /**
     * Checks whether the Media provider exists
     */
    static async checkMediaProvider() {
        let result = await HashBrown.Service.SettingsService.getSettings(HashBrown.Context.projectId, HashBrown.Context.environment, 'providers');
        
        if(!result || !result.media) {
            throw new Error('No Media provider has been set for this project. Please make sure one of your connections has the "is Media provider" setting switched on.');
        }  
    }
    
    /**
     * Gets the URL of a media object
     *
     * @param {String} id
     *
     * @return {String} URL
     */
    static getMediaUrl(id) {
        checkParam(id, 'id', String, true);

        return '/media/' + HashBrown.Context.projectId + '/' + HashBrown.Context.environment + '/' + id;
    } 

    /**
     * Gets Media object by id
     *
     * @param {String} id
     *
     * @return {Promise} Media object
     */
    static async getMediaById(id) {
        if(!id) { return null; }
        
        return await HashBrown.Service.ResourceService.get(HashBrown.Entity.Resource.Media, 'media', id);
    }
    
    /**
     * Gets all Media objects
     *
     * @return {Promise} Media objects
     */
    static async getAllMedia(id) {
        return await HashBrown.Service.ResourceService.getAll(HashBrown.Entity.Resource.Media, 'media');
    }
    
    /**
     * Starts a tour of the media section
     */
    static async startTour() {
        if(location.hash.indexOf('media/') < 0) {
            location.hash = '/media/';
        }
       
        await new Promise((resolve) => { setTimeout(() => { resolve(); }, 500); });
            
        await UI.highlight('.navigation--resource-browser__tab[href="#/media/"]', 'This the media section, where you will find static files, such as images, videos and documents.', 'right', 'next');

        await UI.highlight('.panel', 'Here is a list of all your media. You can right click here to upload new files. If no files appear here, you may need to to configure a connection as a media provider', 'right', 'next');
        
        await UI.highlight('.resource-editor', 'This is the media viewer, where you can preview files.', 'left', 'next');
    }
}

module.exports = MediaService;
