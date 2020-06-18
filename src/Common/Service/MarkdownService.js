'use strict';

const Turndown = require('turndown');
const Marked = require('marked');

/**
 * A helper class for handling markdown
 *
 * @memberof HashBrown.Client.Service
 */
class MarkdownService {
    /**
     * Converts a HTML string to markdown
     *
     * @param {String} html
     *
     * @return {String} Markdown
     */
    static toMarkdown(html) {
        if(!html) { return ''; }

        let turndown = Turndown.default ? new Turndown.default() : new Turndown();
        turndown.escape = (s) => s;

        return turndown.turndown(html);
    }

    /**
     * Converts a markdown string to HTML
     *
     * @param {String} markdown
     *
     * @return {String} HTML
     */
    static toHtml(markdown) {
        if(!markdown) { return ''; }

        return Marked(markdown);
    }
}

module.exports = MarkdownService;
