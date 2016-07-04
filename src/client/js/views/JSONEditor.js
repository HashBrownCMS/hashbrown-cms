'use strict';

// Lib
let beautify = require('js-beautify').js_beautify;

// Views
let MessageModal = require('./MessageModal');

/**
 * A basic JSON editor for any object
 */
class JSONEditor extends View {
    constructor(params) {
        super(params);

        this.$element = _.div({class: 'json-editor flex-vertical'});
        this.$error = _.div({class: 'panel panel-danger'},
            _.div({class: 'panel-heading'}),
            _.div({class: 'panel-body'})
        ).hide();

        this.fetch();
    }

    /**
     * Event: Click basic. Returns to the regular editor
     */
    onClickBasic() {
        let url = $('.navbar-main .pane-container.active .pane-item-container.active .pane-item').attr('href');
    
        if(url) {
            location = url;
        } else {
            debug.log('Invalid url "' + url + '"', this);
        }
    }

    /**
     * Event: Click save. Posts the model to the modelUrl
     */
    onClickSave() {
        let view = this;

        try {
            this.model = JSON.parse(this.value);

            $.post(this.modelUrl, this.model, function() {
                // Post successful
            });

        } catch(e) {
            new MessageModal({
                model: {
                    title: 'Invalid JSON',
                    body: e
                }
            });

        }
    }

    /**
     * Event: On click remove
     */
    onClickDelete() {
        let view = this;

        function onSuccess() {
            debug.log('Removed content with id "' + view.model.id + '"', view); 
        
            reloadResource('content')
            .then(function() {
                ViewHelper.get('NavbarMain').reload();
                
                // Cancel the JSONEditor view
                location.hash = '/content/';
            });
        }

        new MessageModal({
            model: {
                title: 'Delete item',
                body: 'Are you sure you want to delete the item "' + (view.model.title || view.model.name || view.model.id) + '"?'
            },
            buttons: [
                {
                    label: 'Cancel',
                    class: 'btn-default',
                    callback: function() {
                    }
                },
                {
                    label: 'OK',
                    class: 'btn-danger',
                    callback: function() {
                        $.ajax({
                            url: apiUrl('content/' + view.model.id),
                            type: 'DELETE',
                            success: onSuccess
                        });
                    }
                }
            ]
        });
    }

    /**
     * Event: Click beautify button
     */
    onClickBeautify() {
        try {
            this.value = beautify(this.value);
            this.$element.find('textarea').val(this.value);
        
        } catch(e) {
            this.$error.children('.panel-heading').html('JSON error');
            this.$error.children('.panel-body').html(e);
            this.$error.show();

        }
    }

    /**
     * Event: Change text. Make sure the value is up to date
     */
    onChangeText($textarea) {
        this.value = $textarea.val();

        try {
            this.model = JSON.parse(this.value);
            this.$error.hide();

        } catch(e) {
            this.$error.children('.panel-heading').html('JSON error');
            this.$error.children('.panel-body').html(e);
            this.$error.show();
        }
    }

    render() {
        this.value = beautify(JSON.stringify(this.model));

        this.$element.html([
            _.textarea({class: 'flex-expand', disabled: this.model.locked},
                this.value
            ).on('keyup change propertychange paste', (e) => { this.onChangeText(this.$element.find('textarea')); }),
            this.$error,
            _.div({class: 'panel panel-default panel-buttons'}, 
                _.button({class: 'btn btn-default btn-raised'},
                    _.span('{ }')
                ).click(() => { this.onClickBeautify(); }),
                _.div({class: 'btn-group'},
                    _.button({class: 'btn btn-embedded'},
                        'Basic'
                    ).click(() => { this.onClickBasic(); }),
                    _.if(!this.model.locked,
                        _.button({class: 'btn btn-danger btn-raised'},
                            'Delete'
                        ).click(() => { this.onClickDelete(); }),
                        _.button({class: 'btn btn-raised btn-success'},
                            'Save '
                        ).click(() => { this.onClickSave(); })
                    )
                )
            )
        ]);
    }
}

module.exports = JSONEditor;
