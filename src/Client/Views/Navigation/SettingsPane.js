'use strict';

const NavbarPane = require('./NavbarPane');
const NavbarMain = require('./NavbarMain');

class SettingsPane extends NavbarPane {
    /**
     * Init
     */
    static init() {
        NavbarMain.addTabPane('/settings/', 'Settings', 'wrench', {
            items: [
                {
                    name: 'Providers',
                    path: 'providers',
                    icon: 'gift'
                }
            ]
        });
    }
}

module.exports = SettingsPane;
