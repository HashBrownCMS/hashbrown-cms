'use strict';

/**
 * The info settings editor
 *
 * @memberof HashBrown.Client.View.Dashboard
 */
class InfoEditor extends HashBrown.View.Modal.Modal {
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

        this.fetch();
    }
    
    /**
     * Event: Click save. Posts the model to the modelUrl
     */
    onClickSave() {
        HashBrown.Service.SettingsService.setSettings(this.model.id, null, 'info', this.model.settings.info)
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
            new HashBrown.View.Widget.Input({
                value: this.model.settings.info.name,
                onChange: (newName) => {
                    this.model.settings.info.name = newName
                }
            })
        );
    }
}

module.exports = InfoEditor;
