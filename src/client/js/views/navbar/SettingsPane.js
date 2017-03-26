'use strict';

let Pane = require('./Pane');

class SettingsPane extends Pane {
    /**
     * Init
     */
    static init() {
        NavbarMain.addTabPane('/settings/', 'Settings', 'wrench', {
            items: [
                {
                    name: 'Sync',
                    path: 'sync',
                    icon: 'refresh'
                },
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
