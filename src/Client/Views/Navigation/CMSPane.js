'use strict';

const NavbarMain = require('./NavbarMain');
const NavbarPane = require('./NavbarPane');

/**
 * The CMS navbar pane
 * 
 * @memberof HashBrown.Client.Views.Navigation
 */
class CMSPane extends NavbarPane {
    /**
     * Init
     */
    static init() {
        NavbarMain.addTabPane('/', 'HashBrown', _.img({src: '/svg/logo_white.svg', class: 'logo'}), {
            items: [
                {
                    name: 'Welcome'
                },
                {
                    name: 'Readme',
                    path: 'readme'
                },
                {
                    name: 'License',
                    path: 'license'
                }
            ]
        });
    }
}

module.exports = CMSPane;
