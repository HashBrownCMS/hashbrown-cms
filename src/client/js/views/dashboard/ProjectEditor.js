'use strict';

class ProjectEditor extends View {
    constructor(params) {
        super(params);

        this.init();
    }
    
    onClickRemove() {
        let modal = new MessageModal({
            model: {
                title: 'Remove project',
                body: 'Are you sure?'
            },
            buttons: [
                {
                    label: 'Cancel',
                    class: 'btn-default'
                },
                {
                    label: 'Remove',
                    class: 'btn-danger',
                    callback: () => {
                        apiCall('delete', 'server/projects/' + this.model.name)
                        .then(() => {
                            location.reload();
                        })
                        .catch(errorModal);
                    }
                }
            ]
        });
    }

    render() {
        let environmentCount = this.model.settings.environments.names.length;
        let languageCount = this.model.settings.language.selected.length;
        let userCount = this.model.users.length;

        this.$element = _.div({class: 'raised project-editor'},
            _.button({class: 'btn btn-embedded btn-remove'},
                _.span({class: 'fa fa-remove'})
            ).click(() => { this.onClickRemove(); }),
            _.div({class: 'body'},
                _.div({class: 'info'},
                    _.h4(this.model.name),
                    _.p(environmentCount + ' environment' + (environmentCount != 1 ? 's' : '')),
                    _.p(userCount + ' user' + (userCount != 1 ? 's' : '')),
                    _.p(languageCount + ' language' + (languageCount != 1 ? 's' : '') + ' (' + this.model.settings.language.selected.join(', ') + ')')
                ),
                _.div({class: 'environments'},
                    _.each(this.model.settings.environments.names, (i, environment) => {
                        return _.a({href: '/' + this.model.name + '/' + environment, class: 'btn btn-primary environment'},
                            environment
                        )
                    })
                )
            )
        );
    }
}

module.exports = ProjectEditor;
