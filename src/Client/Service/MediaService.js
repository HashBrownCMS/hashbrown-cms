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
        let result = await HashBrown.Service.SettingsService.getSettings(HashBrown.Service.ProjectService.currentProject, HashBrown.Service.ProjectService.currentEnvironment, 'providers')
        
        if(!result || !result.media) {
            throw new Error('No Media provider has been set for this project. Please make sure one of your <a href="#/connections/">Connections</a> has the "is Media provider" setting switched on.');
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
    static getMediaById(id) {
        if(!id) { return Promise.resolve(null); }
        
        return HashBrown.Service.ResourceService.get(HashBrown.Entity.Resource.Media, 'media', id);
    }
    
    /**
     * Gets all Media objects
     *
     * @return {Promise} Media objects
     */
    static getAllMedia(id) {
        return HashBrown.Service.ResourceService.getAll(HashBrown.Entity.Resource.Media, 'media');
    }
}

module.exports = MediaService;
