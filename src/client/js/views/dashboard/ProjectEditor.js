'use strict';

class ProjectEditor extends View {
    constructor(params) {
        super(params);

        this.init();
    }

    render() {
        this.$element = _.div({class: 'raised project-editor'},
            _.div({class: 'body'},
                _.div({class: 'info'},
                    _.h4(this.model.name)
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
