'use strict';

let Content = require('./Content');

/**
 * The base type for all Pages
 */
class Page extends Content {
    constructor(data) {
        super(data);
    }

    /**
     * Creates a new Page object
     *
     * @param {Object} data
     *
     * @return {Page} page
     */
    static create(data){
        let content = Content.create(data);

        let page = new Page(content.data);

        page.data.createDate = Date.now();
        page.data.updateDate = Date.now();
        page.data.schemaId = page.data.schemaId || '10000';

        page.data.title = 'New page';

        return page;
    }
}

module.exports = Page;
