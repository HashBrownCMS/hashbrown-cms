'use strict';

const SettingsHelper = require('Client/Helpers/SettingsHelper');

/**
 * The info settings editor
 *
 * @memberof HashBrown.Client.Views.Dashboard
 */
class InfoEditor extends HashBrown.Views.Modals.Modal {
    constructor(params) {
        params.title = 'Project info';
        params.actions = [
            {
                label: 'Save',
                onClick: () => {
                    this.onClickSave();

                    return false;
                }
            }
        ];

        params.autoFetch = false;

        super(params);

        SettingsHelper.getSettings(this.projectId, null, 'info')
        .then((infoSettings) => {
            this.model = infoSettings || {};

            this.fetch();
        });
    }
    
    /**
     * Event: Click save. Posts the model to the modelUrl
     */
    onClickSave() {
        SettingsHelper.setSettings(this.projectId, null, 'info', this.model)
        .then(() => {
            this.close();

            this.trigger('change', this.model);
        })
        .catch(UI.errorModal);
    }
    
    /**
     * Renders the modal body
     *
     * @returns {HTMLElement} Body
     */
    renderBody() {
        if(!this.model) { return; }

        return _.div({class: 'widget-group'},
            _.span({class: 'widget widget--label'}, 'Name'),
            new HashBrown.Views.Widgets.Input({
                value: this.model.name,
                onChange: (newName) => {
                    this.model.name = newName
                }
            })
        );
    }
}

module.exports = InfoEditor;
