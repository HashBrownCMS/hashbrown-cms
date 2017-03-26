'use strict';

let Pane = require('./Pane');

class CMSPane extends Pane {
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
