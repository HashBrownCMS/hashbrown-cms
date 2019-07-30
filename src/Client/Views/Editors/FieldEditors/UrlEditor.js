'use strict';

/**
 * An editor for content URLs
 *
 * @description Example:
 * <pre>
 * {
 *     "myUrl": {
 *         "label": "My URL",
 *         "tabId": "content",
 *         "schemaId": "url"
 *     }
 * }
 * </pre>
 *
 * @memberof HashBrown.Client.Views.Editors.FieldEditors
 */
class UrlEditor extends HashBrown.Views.Editors.FieldEditors.FieldEditor {
    constructor(params) {
        super(params);

        this.fetch();
    }

    /**
     * Generates a new url based on content id
     *
     * @param {String} contentId
     *
     * @return {String} url
     */
    async generateUrl(contentId) {
        let ancestors = await HashBrown.Helpers.ContentHelper.getContentAncestorsById(contentId, true);
        
        let url = '/';
      
        if(this.multilingual) {
            url += HashBrown.Context.language + '/';
        }

        for(let ancestor of ancestors) {
            let title = '';

            // If the ancestor equals the currently edited ancestor, take the value directly from the "title" field
            if(ancestor.id == Crisp.Router.params.id) {
                title = $('.editor__field[data-key="title"] .editor__field__value input').val();

            // If it's not, try to get the title from the model
            } else {
                // If title is set directly (unlikely), pass it
                if(typeof ancestor.title === 'string') {
                    title = ancestor.title;

                // If title is defined in properties (typical)
                } else if(ancestor.properties && ancestor.properties.title) {
                    // If title is multilingual
                    if(ancestor.properties.title[HashBrown.Context.language]) {
                        title = ancestor.properties.title[HashBrown.Context.language];
                    
                    // If title is not multilingual
                    } else if(typeof ancestor.properties.title === 'string') {
                        title = ancestor.properties.title;
                    
                    }
                }
            }

            url += HashBrown.Helpers.ContentHelper.getSlug(title) + '/';
        }

        // Check for duplicate URLs
        let sameUrls = 0;
        let allContent = await HashBrown.Helpers.ContentHelper.getAllContent();

        for(let content of allContent) {
            if(content.id != contentId) {
                let thatUrl = content.prop('url', HashBrown.Context.language);
                let isMatchWithNumber = new RegExp(url.substring(0, url.lastIndexOf('/')) + '-[0-9]+/').test(thatUrl);
                let isSameUrl = url == thatUrl || isMatchWithNumber;

                if(isSameUrl) {
                    sameUrls++;
                }
            }
        }

        // Append a number, if duplidate URLs were found
        if(sameUrls > 0) {
            url = url.replace(/\/$/, '-' + sameUrls + '/');
        }

        return url;
    }

    /**
     * Regenerates the URL
     */
   async regenerate() {
        let newUrl = await this.generateUrl(Crisp.Router.params.id);

        this.$input.val(newUrl);

        this.trigger('silentchange', this.$input.val());
    };

    /**
     * Fetch the URL from the Content title
     */
    async fetchFromTitle() {
        this.value = this.$titleInput.val();

        await this.regenerate();
    }

    /**
     * Event: Change value
     */
    async onChange() {
        this.value = this.$input.val();

        if(this.value.length > 0) {
            if(this.value[0] != '/') {
                this.value = '/' + this.value;
                this.$input.val(this.value);
            }
            
            if(this.value.length > 1 && this.value[this.value.length - 1] != '/') {
                this.value = this.value + '/';
                this.$input.val(this.value);
            }
        } else {
            await this.fetchFromTitle();
        }

        this.trigger('change', this.value);
    };

    /**
     * Renders this editor
     */
    template() {
        return _.div({class: 'field-editor field-editor--url'},
            _.div({class: 'widget-group'},
                this.$input = _.input({class: 'widget widget--input text', type: 'text', value: this.value})
                    .on('change', () => { this.onChange(); }),
                _.button({class: 'widget widget--button small fa fa-refresh', title: 'Regenerate URL'})
                    .click(() => { this.regenerate(); })
            )
        );
    }

    /**
     * Post render
     */
    postrender() {
        super.postrender();
        
        //  Wait a bit before checking for title field
        setTimeout(() => {
            this.$titleInput = $('.editor__field[data-key="title"] input[type="text"]');

            if(this.$titleInput.length === 1) {
                this.$titleInput.on('input', () => {
                    this.fetchFromTitle();   
                });
            }

            if(!this.value) {
                this.fetchFromTitle();
            }
        }, 100);
    }
}

module.exports = UrlEditor;
