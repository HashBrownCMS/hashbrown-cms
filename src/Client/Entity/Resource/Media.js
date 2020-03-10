'use strict';

/**
 * The media class
 */
class Media extends require('Common/Entity/Resource/Media') {
    static get icon() { return 'file-image-o'; }

    /**
     * Gets the icon name
     *
     * @return {String} Icon
     */
    get icon() {
        if(this.isVideo()) {
            return 'file-video-o';
        }
        
        if(this.isImage()) {
            return 'file-image-o';
        }

        return super.icon;
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

                    base64 = base64.replace('data:' + file.type + ';base64,', '');

                    resolve(base64);
                }
                
                reader.readAsDataURL(file);
            });
        
        }

        return '';
    }
}

module.exports = Media;
