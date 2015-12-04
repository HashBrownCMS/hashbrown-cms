require('../client');
require('./partials/navbar');

api.collaborators(function(collaborators) {
    $('.page-content').html(
        _.div({class: 'container'},
            _.div({class: 'row'}, [
                _.each(
                    collaborators,
                    function(i, collaborator) {
                        return _.div({class: 'col-xs-2'},
                            _.div({class: 'thumbnail'}, [
                                _.img({src: collaborator.avatarUrl}),
                                _.h4({class: 'text-center'},
                                    collaborator.login
                                ),
                                _.button({class: 'btn btn-danger form-control'},
                                    'Remove'
                                )
                            ])
                        ); 
                    }
                ),
                _.div({class: 'col-xs-2'},
                    _.div({class: 'thumbnail'},
                        _.button({class: 'btn btn-success form-control'},
                            'Add'
                        )
                    )
                )
            ])
        )
    )
});
