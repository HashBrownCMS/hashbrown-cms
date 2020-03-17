'use strict';

/**
 * The media class
 */
class Media extends require('Common/Entity/Resource/Media') {
    /**
     * Gets the media provider
     *
     * @return {HashBrown.Entity.Resource.Connection} Provider
     */
    static async getProvider() {
        let environments = HashBrown.Context.project.settings.environments;
        let environment = HashBrown.Context.environment;

        if(!environments || !environments[environment] || !environments[environment].mediaProvider) { return null; }

        let connection = await HashBrown.Entity.Resource.Connection.get(environments[environment].mediaProvider);

        return connection;
    }

    /**
     * Converts a file to base64 or object URL
     *
     * @param {File} file
     *
     * @return {String} Source string
     */
    static async toSourceString(file) {
        checkParam(file, 'file', File, true);
        
        if(file.type.indexOf('video') === 0) {
            return window.URL.createObjectURL(file);

        } else if(file.type.indexOf('image') === 0) {
            return await new Promise((resolve) => {
                let reader = new FileReader();
               
                reader.onload = (e) => {
                    let base64 = e.target.result;

                    resolve(base64);
                }
                
                reader.readAsDataURL(file);
            });
        
        }

        return '';
    }
}

module.exports = Media;
