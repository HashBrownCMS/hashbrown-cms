'use strict';

let Pane = require('./Pane');

class CMSPane extends Pane {
    /**
     * Renders the toolbar
     *
     * @returns {HTMLElement} Toolbar
     */
    static renderToolbar() {
        function onClickLogOut() {
            document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';

            location.reload();
        }

        function onClickDashboard() {
            location = '/';
        }

        let $toolbar = _.div({class: 'pane-toolbar'},
            _.div({},
                _.label('Server'),
                _.button({class: 'btn btn-primary'}, 'Dashboard')
                    .click(onClickDashboard)
            ),
            _.div({},
                _.label('Session'),
                _.button({class: 'btn btn-primary'}, 'Log out')
                    .click(onClickLogOut)
            )
        );

        return $toolbar;
    }

    /**
     * Gets the render settings
     *
     * @returns {Object} Settings
     */
    static getRenderSettings() {
        return {
            label: 'HashBrown',
            sublabel: 'v' + app.version,
            route: '/',
            $icon: _.img({src: '/svg/logo_grey.svg', class: 'logo'}),
            toolbar: this.renderToolbar(),
            items: [
                {
                    name: 'Readme',
                    path: 'readme'
                },
                {
                    name: 'License',
                    path: 'license'
                }
            ]
        };
    }
}

module.exports = CMSPane;
