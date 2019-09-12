'use strict';

/**
 * The editor for migrating content between environments
 *
 * @memberof HashBrown.Client.View.Dashboard
 */
class MigrationEditor extends HashBrown.View.Modal.Modal {
    constructor(params) {
        params.title = 'Migrate content';

        params.actions = [
            {
                label: 'Migrate',
                onClick: () => {
                    this.onSubmit(); 

                    return false;
                }
            }
        ];

        params.data = {
            from: params.model.environments[0],
            to: '',
            settings: {
                schemas: true,
                replace: true
            }
        };

        super(params);
    }

    /**
     * Pre render
     */
    prerender() {
        if(!this.data.to || this.getToOptions().indexOf(this.data.to) < 0) {
            this.data.to = this.getToOptions()[0];
        }
    }

    /**
     * Renders this modal body
     *
     * @returns {HTMLElement} Body
     */
    renderBody() {
        return [
            _.div({class: 'widget-group'},
                new HashBrown.View.Widget.Dropdown({
                    value: this.data.from,
                    options: this.model.environments,
                    onChange: (newValue) => {
                        this.data.from = newValue;

                        this.fetch();
                    }
                }).$element,
                _.div({class: 'widget-group__separator fa fa-arrow-right'}),
                new HashBrown.View.Widget.Dropdown({
                    value: this.data.to,
                    options: this.getToOptions(),
                    onChange: (newValue) => {
                        this.data.to = newValue;
                    }
                }).$element
            ),
            _.each({
                replace: 'Overwrite on target',
                schemas: 'Schema',
                content: 'Content',
                forms: 'Forms',
                media: 'Media',
                connections: 'Connections'
            }, (key, label) => {
                return _.div({class: 'widget-group'},      
                    _.label({class: 'widget widget--label'}, label),
                    new HashBrown.View.Widget.Input({
                        type: 'checkbox',
                        value: this.data.settings[key] === true,
                        onChange: (newValue) => {
                            this.data.settings[key] = newValue;
                        }
                    }).$element
                );
            })
        ];
    }

    /**
     * Gets the displayed "to" options
     */
    getToOptions() {
        return this.model.environments.filter((environment) => {
            return environment !== this.data.from;   
        });
    }

    /**
     * Event: Clicked submit
     */
    onSubmit() {
        HashBrown.Service.RequestService.request('post', 'server/migrate/' + this.model.id, this.data)
        .then(() => {
            UI.messageModal('Success', 'Successfully migrated content from "' + this.data.from + '" to "' + this.data.to + '"', () => {
                this.trigger('change');

                this.close();
            });
        })
        .catch(UI.errorModal);
    }
}

module.exports = MigrationEditor;
