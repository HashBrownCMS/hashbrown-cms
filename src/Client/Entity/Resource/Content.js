'use strict';

/**
 * The client-side content model
 *
 * @memberof HashBrown.Client.Entity.Resource
 */
class Content extends require('Common/Entity/Resource/Content') {
    /**
     * Gets the human readable name
     *
     * @return {String} 
     */
    getName() {
        let name = this.getPropertyValue('title', HashBrown.Client.language);

        if(!name) {
            name = 'Untitled';

            for(let language in this.properties.title) {
                let languageTitle = this.properties.title[language];

                if(languageTitle) {
                    name += ' - (' + language + ': ' + languageTitle + ')';
                    break;
                }
            }
        }

        return name;
    }

    /**
     * Gets parent content
     *
     * @returns {HashBrown.Entity.Resource.Content} Parent
     */
    async getParent() {
        if(!this.parentId) { return null; }

        return await this.constructor.get(this.parentId);
    }
}

module.exports = Content;
