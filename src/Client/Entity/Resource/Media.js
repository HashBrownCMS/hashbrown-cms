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
}

module.exports = Media;
