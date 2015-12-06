require('../client');
require('./partials/navbar');

env.get(function(json) {
    $('.page-content').html(
        _.div({class: 'container'},[
            _.ul({class: 'nav nav-tabs', role:'tablist'}, [
                _.li({role: 'presentation', class: 'active'},
                    _.a({href:'#issues', 'aria-controls': 'home', role: 'tab', 'data-toggle': 'tab'},
                        'Issues'
                    )
                )
            ]),
            _.div({class: 'tab-content'}, [
                _.div({role: 'tabpanel', class: 'tab-pane active', id: 'issues'}, [
                    _.h4('Columns'),
                    _.ul({class: 'list-group'}, [
                        _.li({class: 'list-group-item'}, 'backlog'),
                        _.each(json.putaitu.issues.columns,
                            function(i, column) {
                                return _.li({class: 'list-group-item'},
                                    _.input({type: 'text', class: 'form-control', value: column})
                                );
                            }
                        ),
                        _.li({class: 'list-group-item'},
                            _.button({class: 'btn btn-default block-center'}, [
                                'Add column ',
                                _.span({class: 'glyphicon glyphicon-plus'})
                            ])
                        ),
                        _.li({class: 'list-group-item'}, 'done')
                    ])
                ])
            ])
        ])
    );
});
