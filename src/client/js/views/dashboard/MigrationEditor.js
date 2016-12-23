'use strict';

class MigrationEditor extends View {
    constructor(params) {
        super(params);

        this.data = {
            from: '',
            to: '',
            settings: {
                replace: true
            }
        }

        this.modal =  new MessageModal({
            model: {
                class: 'modal-migrate-content settings-modal',
                title: 'Migrate content',
                body: [
                    _.div({class: 'migration-message'},
                        _.span({class: 'fa fa-warning'}),
                        _.span('It might be a good idea to make a project backup before you proceed')
                    ),
                    _.div({class: 'migration-operation'},
                        _.select({class: 'form-control environment-from'},
                            _.each(this.model.settings.environments.names, (i, environment) => {
                                return _.option({value: environment}, environment);  
                            })
                        ).change(() => {
                            this.updateOptions();
                        }),
                        _.span({class: 'fa fa-arrow-right'}),
                        _.select({class: 'form-control environment-to'})
                    ),
                    _.div({class: 'migration-settings'},
                        _.each({
                            replace: 'Replace content on target'
                        }, (value, label) => {
                            return _.div({class: 'input-group'},      
                                _.span(label),
                                _.div({class: 'input-group-addon'},
                                    _.div({class: 'switch'},
                                        _.input({
                                            id: 'switch-migration-' + value,
                                            class: 'form-control switch',
                                            type: 'checkbox',
                                            checked: this.data.settings[value]
                                        }),
                                        _.label({for: 'switch-migration-' + value})
                                    )
                                )
                            );
                        })
                    )
                ]
            },
            buttons: [
                {
                    label: 'Cancel',
                    class: 'btn-default'
                },
                {
                    label: 'Migrate',
                    class: 'btn-primary',
                    callback: () => {
                        this.onSubmit(); 

                        return false;
                    }
                }
            ]
        });

        this.$element = this.modal.$element;

        this.fetch();

        this.updateOptions();
    }

    /**
     * Updates the displayed options
     */
    updateOptions() {
        _.append(this.modal.$element.find('.environment-to').empty(),
            _.each(this.model.settings.environments.names, (i, environment) => {
                // Filter out "from" environment
                if(environment != this.modal.$element.find('.environment-from').val()) {
                    return _.option({value: environment}, environment);  
                }
            })
        );
    }

    /**
     * Event: Clicked submit
     */
    onSubmit() {
        this.data.from = this.modal.$element.find('.environment-from').val();
        this.data.to = this.modal.$element.find('.environment-to').val();

        this.data.settings.replace = this.modal.$element.find('#switch-migration-replace').is(':checked');
        
        apiCall('post', 'server/migrate/' + this.model.id, this.data)
        .then(() => {
            UI.messageModal('Success', 'Successfully migrated content from "' + this.data.from + '" to "' + this.data.to + '"');
        })
        .catch(UI.errorModal);
    }
}

module.exports = MigrationEditor;
