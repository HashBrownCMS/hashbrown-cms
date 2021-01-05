'use strict';

/**
 * A panel for publication resources
 *
 * @memberof HashBrown.Client.Entity.View.Panel
 */
class PublicationPanel extends HashBrown.Entity.View.Panel.PanelBase {
    /**
     * Gets available sorting options
     *
     * @return {Object} Options
     */
    getSortingOptions() {
        return {
            'Name': 'name:asc',
            'Changed': 'changed:desc',
            'Created': 'created:desc'
        }
    }
}

module.exports = PublicationPanel;
