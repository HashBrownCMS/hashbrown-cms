'use strict';

class UrlEditor extends View {
    constructor(params) {
        super(params);

        this.init();
    }

    /**
     * Gets url-friendly name of string
     *
     * @param {String} string
     *
     * @return {String} slug
     */
    static getSlug(string) {
        return string
            .toLowerCase()
            .replace(/[^\w ]+/g, '')
            .replace(/ +/g, '-')
            ;
    }

    /**
     * Get all parent content nodes
     *
     * @param {String} contentId
     *
     * @return {Array} nodes
     */
    static getAllParents(contentId) {
        let nodes = [];    

        function iterate(id) {
            let node;
            let contentEditor = ViewHelper.get('ContentEditor');
        
            if(contentEditor && contentEditor.model && contentEditor.model.id == id) {
                node = contentEditor.model;
            } else {
                node = window.resources.content.filter((node) => {
                    return node.id == id;
                })[0];
            }

            if(node) {
                nodes.push(node);

                if(node.parentId) {
                    iterate(node.parentId);
                }

            } else {
                console.log('[Helper] Content not found: "' + id + '"');
            }
        }

        iterate(contentId);

        nodes.reverse();

        return nodes;
    }

    /**
     * Generates a new url based on content id
     *
     * @param {String} contentId
     *
     * @return {String} url
     */
    static generateUrl(contentId) {
        let nodes = UrlEditor.getAllParents(contentId);
        let url = '';

        url += '/';

        for(let node of nodes) {
            let title = (node.title && node.title[window.language] ? node.title[window.language] : null) || node.title;

            url += UrlEditor.getSlug(title) + '/';
        }

        for(let node of window.resources.content) {
            let nodeUrl = (node.url && node.url[window.language] ? node.url[window.language] : null) || node.url;

            if(nodeUrl == url) {
                messageModal('URL error', 'Node of same URL "' + url + '" already exists');
                url = '';
            }
        }

        return url;
    }

    regenerate() {
        let newUrl = UrlEditor.generateUrl(location.hash.replace('#', '').replace('/content/', ''));

        this.$input.val(newUrl);

        this.trigger('change', this.$input.val());
    };

    onChange() {
        this.trigger('change', this.$input.val());
    };

    render() {
        var editor = this;

        this.$element = _.div({class: 'field-editor url-editor input-group'},
            this.$input = _.input({class: 'form-control', value: this.value})
                .on('change propertychange paste keyup', function() { editor.onChange(); }),
            _.div({class: 'input-group-btn'},
                _.button({class: 'btn btn-primary'},
                    'Regenerate '
                ).click(function() { editor.regenerate(); })
            )
        );
    }
}

resources.editors.url = UrlEditor;
