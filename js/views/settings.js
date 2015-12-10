require('../client');
require('./partials/navbar');

env.get(function(config) {
    api.labels.get(function(labels) {
        function render() {
            function onClickAddLabel() {
                var label = {
                    name: 'new label',
                    color: 'cccccc'
                };

                var occurrences = 0;

                for(var i in labels) {
                    occurrences += labels[i].name == 'new label' ? 1 : 0;
                }

                if(occurrences < 1) {
                    labels.push(label);

                    render();
                }
            }

            function onClickSave() {
                var $btn = $(self);
                $btn.toggleClass('disabled', true);
                $btn.html('Saving...');

                env.set(config, function() {
                    $btn.toggleClass('disabled', false);
                    $btn.html([
                        'Save ',
                        _.span({class: 'glyphicon glyphicon-floppy-disk'})
                    ]);
                });
/*
                if(labels.length > 0) {
                    var processed = 0;

                    function process() {
                        api.labels.set(labels[processed], function(res) {
                            processed++;

                            if(processed < labels.length - 1) {
                                process();
                            } else {
                                $btn.toggleClass('disabled', false);
                                $btn.html([
                                    'Save ',
                                    _.span({class: 'glyphicon glyphicon-floppy-disk'})
                                ]);
                            } 
                        });
                    }

                    process();
                }
  */          }

            $('.page-content').html(
                _.div({class: 'container'},[
                    _.button({class: 'btn btn-success pull-right'}, [
                        'Save ',
                        _.span({class: 'glyphicon glyphicon-floppy-disk'})
                    ]).click(onClickSave),
                    _.ul({class: 'nav nav-tabs', role:'tablist'}, [
                        _.li({role: 'presentation', class: 'active'},
                            _.a({href:'#issues', 'aria-controls': 'home', role: 'tab', 'data-toggle': 'tab'},
                                'Issues'
                            )
                        )
                    ]),
                    _.div({class: 'tab-content'}, [
                        _.div({role: 'tabpanel', class: 'tab-pane active', id: 'issues'}, [
                            _.div({class: 'row'}, [
                                _.div({class: 'col-xs-6'}, [
                                    _.h4('Columns'),
                                    _.ul({class: 'list-group'}, [
                                        _.li({class: 'list-group-item'}, 'backlog'),
                                        _.each(config.putaitu.issues.columns,
                                            function(i, column) {
                                                var $li = _.li({class: 'list-group-item', 'data-name': column}, [
                                                    _.span({class: 'name'},
                                                        column
                                                    ),
                                                    _.button({class: 'btn close'},
                                                        _.span({class: 'glyphicon glyphicon-remove'})
                                                    ).click(onClickRemove)
                                                ]);

                                                function onClickRemove() {
                                                    config.putaitu.issues.columns.splice(i, 1);
                                                    $li.remove();
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
                                                        _.input({type: 'text', class: 'form-control', value: label.name}).bind('change keyup propertychange paste', onChangeName),
                                                        _.div({class: 'input-group-btn'}, [
                                                            _.input({type: 'color', class: 'btn btn-default', value: '#' + label.color}).bind('change keyup propertychange paste', onChangeColor),
                                                            _.button({class: 'btn btn-danger'},
                                                                _.span({class: 'glyphicon glyphicon-remove'})
                                                            ).click(onClickRemove)
                                                        ])
                                                    ])
                                                );
                                              
                                                function onChangeColor() {
                                                    label.color = $(this).val().replace('#', '');
                                                }

                                                function onChangeName() {
                                                    var oldName = label.name;
                                                    var newName = $(this).val();
                                                    var index = config.putaitu.issues.columns.indexOf(oldName);

                                                    label.name = newName;

                                                    if(index > -1) {
                                                        config.putaitu.issues.columns[index] = newName;
                                                    
                                                        $('li[data-name="' + oldName + '"]').each(function(i) {
                                                            $(this).attr('data-name', newName);
                                                            $(this).children('.name').html(newName);
                                                        });
                                                    }
                                                }

                                                function onClickAdd() {
                                                    var index = config.putaitu.issues.columns.indexOf(label.name);

                                                    if(index < 0) {
                                                        config.putaitu.issues.columns.push(label.name);
                                                        render();
                                                    }
                                                }

                                                function onClickRemove() {
                                                    labels.splice(i, 1);
                                                    
                                                    var index = config.putaitu.issues.columns.indexOf(label.name);

                                                    if(index > -1) {
                                                        config.putaitu.issues.columns.splice(index, 1);
                                                    }

                                                    render();
                                                }

                                                return $li;
                                            }
                                        ),
                                        _.li({class: 'list-group-item'},
                                            _.button({class: 'btn btn-primary center-block'}, [
                                                'Add label ',
                                                _.span({class: 'glyphicon glyphicon-plus'})
                                            ]).click(onClickAddLabel)
                                        )
                                    ])
                                ])
                            ])
                        ])
                    ])
                ])
            );
        }

        render();
    });
});
