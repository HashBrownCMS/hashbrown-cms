require('../client');
require('./partials/navbar');

class Settings extends View {
    constructor(args) {
        super(args);

        // Register events
        this.on('clickSave', this.onClickSave);
        this.on('clickAddLabel', this.onClickAddLabel);

        let view = this;

        env.get(function(config) {
            api.labels.fetch(function(labels) {
                view.config = config;
                view.labels = labels;

                view.init();
            });
        });
    }

    /**
     * Events
     */
    // Labels
    onClickAddLabel(e, element, view) {
        let label = {
            name: 'new label',
            color: 'cccccc'
        };

        let occurrences = 0;

        for(let i in labels) {
            occurrences += labels[i].name == 'new label' ? 1 : 0;
        }

        if(occurrences < 1) {
            labels.push(label);

            view.render();
        }
    }

    // Global
    onClickSave(e, element, view) {
        let $btn = $(element);
        $btn.toggleClass('disabled', true);
        $btn.html('Saving...');

        env.set(config, function() {
            $btn.toggleClass('disabled', false);
            $btn.html([
                'Save ',
                _.span({class: 'glyphicon glyphicon-floppy-disk'})
            ]);
        });

        // Async saving logic for labels
/*
        if(labels.length > 0) {
            let processed = 0;

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
*/  }

    render() {
        let view = this;

        $('.page-content').html(
            _.div({class: 'container'}, [
                // Save button
                _.button({class: 'btn btn-success pull-right'}, [
                    'Save ',
                    _.span({class: 'glyphicon glyphicon-floppy-disk'})
                ]).click(view.events.clickSave),
                
                // Tabs
                _.ul({class: 'nav nav-tabs', role:'tablist'}, [

                    // Issues
                    _.li({role: 'presentation', class: 'active'},
                        _.a({href:'#issues', 'aria-controls': 'issues', role: 'tab', 'data-toggle': 'tab'},
                            'Issues'
                        )
                    ),

                    // CMS
                    _.li({role: 'presentation'},
                        _.a({href:'#cms', 'aria-controls': 'cms', role: 'tab', 'data-toggle': 'tab'},
                            'CMS'
                        )
                    )
                ]),

                // Tab content
                _.div({class: 'tab-content'}, [

                    // Issues
                    _.div({role: 'tabpanel', class: 'tab-pane active', id: 'issues'}, [
                        _.div({class: 'row'}, [
                            _.div({class: 'col-xs-6'}, [
                                _.h4('Columns'),
                                _.ul({class: 'list-group'}, [
                                    _.li({class: 'list-group-item'}, 'backlog'),
                                    _.each(view.config.putaitu.issues.columns,
                                        function(i, column) {
                                            let $li = _.li({class: 'list-group-item', 'data-name': column}, [
                                                _.span({class: 'name'},
                                                    column
                                                ),
                                                _.button({class: 'btn close'},
                                                    _.span({class: 'glyphicon glyphicon-remove'})
                                                ).click(onClickRemove)
                                            ]);

                                            function onClickRemove() {
                                                view.config.putaitu.issues.columns.splice(i, 1);
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
                                    _.each(view.labels,
                                        function(i, label) {
                                            let $li = _.li({class: 'list-group-item'},
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
                                                let oldName = label.name;
                                                let newName = $(this).val();
                                                let index = view.config.putaitu.issues.columns.indexOf(oldName);

                                                label.name = newName;

                                                if(index > -1) {
                                                    view.config.putaitu.issues.columns[index] = newName;
                                                
                                                    $('li[data-name="' + oldName + '"]').each(function(i) {
                                                        $(this).attr('data-name', newName);
                                                        $(this).children('.name').html(newName);
                                                    });
                                                }
                                            }

                                            function onClickAdd() {
                                                let index = view.config.putaitu.issues.columns.indexOf(label.name);

                                                if(index < 0) {
                                                    view.config.putaitu.issues.columns.push(label.name);
                                                    view.render();
                                                }
                                            }

                                            function onClickRemove() {
                                                view.labels.splice(i, 1);
                                                
                                                let index = view.config.putaitu.issues.columns.indexOf(label.name);

                                                if(index > -1) {
                                                    view.config.putaitu.issues.columns.splice(index, 1);
                                                }

                                                view.render();
                                            }

                                            return $li;
                                        }
                                    ),
                                    _.li({class: 'list-group-item'},
                                        _.button({class: 'btn btn-primary center-block'}, [
                                            'Add label ',
                                            _.span({class: 'glyphicon glyphicon-plus'})
                                        ]).click(view.events.clickAddLabel)
                                    )
                                ])
                            ])
                        ])
                    ]),

                    // CMS
                    _.div({role: 'tabpanel', class: 'tab-pane', id: 'cms'}, [
                        
                    ])
                ])
            ])
        );
    }
}

new Settings();
