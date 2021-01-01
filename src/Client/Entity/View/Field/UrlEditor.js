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

        this.editorTemplate = require('template/field/editor/urlEditor');
    }

    /**
     * Event: Clicked regenerate
     */
    async onClickRegenerate() {
        let editor = HashBrown.Client.editor;

        if(!editor || !editor.model) { return; }

        let content = editor.model;
        let url = '/';

        while(content) {
            let name = content.prop('title', HashBrown.Client.locale) || content.id || '';

            name = name.toLowerCase();
            name = name.replace(/[^a-z0-9]/g, '');

            url = '/' + name + url;

            if(!content.parentId) { break; }

            content = await HashBrown.Entity.Resource.Content.get(content.parentId);
        }
       
        let locales = this.context.project.settings.locales;

        if(locales.length > 1 && HashBrown.Client.locale) {
            url = '/' + HashBrown.Client.locale + url; 
        }

        url = url.replace(/\/\//g, '/');

        this.state.value = url;
        this.namedElements.input.value = this.state.value;

        this.onChange(this.state.value);
    }
}

module.exports = UrlEditor;
