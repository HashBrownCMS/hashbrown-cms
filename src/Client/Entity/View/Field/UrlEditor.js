'use strict';

/**
 * A editor of URLs with auto generate functionality
 *
 * @memberof {HashBrown.Client.Entity.View.Field}
 */
class UrlEditor extends HashBrown.Entity.View.Field.FieldBase {
    /**
     * Constructor
     */
    constructor(params) {
        super(params);

        this.template = require('template/field/urlEditor');
    }

    /**
     * Event: Clicked regenerate
     */
    async onClickRegenerate() {
        let category = HashBrown.Service.NavigationService.getRoute(0);

        if(!category) { return; }

        let contentId = HashBrown.Service.NavigationService.getRoute(1);

        if(!contentId) { return; }

        let content = await HashBrown.Service.ContentService.getContentById(contentId);

        let url = '/';

        while(content) {
            let name = content.prop('title', HashBrown.Context.language) || content.id || '';

            name = name.toLowerCase();
            name = name.replace(/[^a-z0-9]/g, '');

            url = '/' + name + url;

            if(!content.parentId) { break; }

            content = await HashBrown.Service.ContentService.getContentById(content.parentId);
        }
        
        if(HashBrown.Context.language) {
            url = '/' + HashBrown.Context.language + url; 
        }

        url = url.replace(/\/\//g, '/');

        this.model.value = url;
        this.namedElements.input.value = this.model.value;

        this.onChange(this.model.value);
    }
}

module.exports = UrlEditor;
