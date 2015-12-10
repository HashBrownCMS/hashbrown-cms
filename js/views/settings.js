require('../client');
require('./partials/navbar');

env.get(function(json) {
    api.labels(function(labels) {
        function render() {
            function onClickAddLabel() {
                labels.push({
                    name: 'new label'
                });
            }

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
                        _.div({role: 'tabpanel', class: 'tab-pane active', id: 'issues'},
                            _.div({class: 'row'}, [
                                _.div({class: 'col-xs-6'}, [
                                    _.h4('Columns'),
                                    _.ul({class: 'list-group'}, [
                                        _.li({class: 'list-group-item'}, 'backlog'),
                                        _.each(json.putaitu.issues.columns,
                                            function(i, column) {
                                                var $li = _.li({class: 'list-group-item'}, [
                                                    column,
                                                    _.button({class: 'btn close'},
                                                        _.span({class: 'glyphicon glyphicon-remove'})
                                                    ).click(onClickRemove)
                                                ]);

                                                function onClickRemove() {
                                                    json.putaitu.issues.columns.splice(i, 1);
                                                    $li.remove();

                                                    // TODO: sync
                                                }

                                                return $li;
                                            }
                                        ),
                                        _.li({class: 'list-group-item'}, 'done')
                                    ])
                                ]),
                                _.div({class: 'col-xs-6'}, [
                                    _.h4('Labels'),
                                    _.ul({class: 'list-group'}, [
                                        _.each(labels,
                                            function(i, label) {
                                                var $li = _.li({class: 'list-group-item'},
                                                    _.div({class: 'input-group'}, [
                                                        _.div({class: 'input-group-btn'},
                                                            _.button({class: 'btn btn-primary'},
                                                                _.span({class: 'glyphicon glyphicon-arrow-left'})
                                                            ).click(onClickAdd)
                                                        ),
                                                        _.input({type: 'text', class: 'form-control', value: label.name}),
                                                        _.div({class: 'input-group-btn'},
                                                            _.button({class: 'btn btn-danger'},
                                                                _.span({class: 'glyphicon glyphicon-remove'})
                                                            ).click(onClickRemove)
                                                        )
                                                    ])
                                                );
                                                
                                                function onClickAdd() {
                                                    var index = json.putaitu.issues.columns.indexOf(label.name);

                                                    if(index < 0) {
                                                        json.putaitu.issues.columns.push(label.name);
                                                        render();

                                                        // TODO: sync
                                                    }
                                                }

                                                function onClickRemove() {
                                                    labels.splice(i, 1);
                                                    $li.remove();

                                                    // TODO: sync
                                                }

                                                return $li;
                                            }
                                        ),
                                        _.li({class: 'list-group-item'},
                                            _.button({class: 'btn btn-default block-center'}, [
                                                'Add label ',
                                                _.span({class: 'glyphicon glyphicon-plus'})
                                            ]).click(onClickAddLabel)
                                        )
                                    ])
                                ])
                            ])
                        )
                    ])
                ])
            );
        }

        render();
    });
});
