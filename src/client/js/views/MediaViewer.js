'use strict';

// Views
let MessageModal = require('./MessageModal');

class MediaViewer extends View {
    constructor(params) {
        super(params);
        
        this.$element = _.div({class: 'media-viewer panel panel-default'});

        this.fetch();
    }

    /**
     * Event: Click delete
     */
    onClickDelete() {
        new MessageModal({
            model: {
                title: 'Delete content',
                body: 'Are you sure you want to delete "' + this.model.name + '"?'
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
                    }
                }
            ]
        });
    }

    render() {
        let view = this;

        this.$element.empty().append(
            _.div({class: 'panel-heading'},
                _.h4({class: 'panel-title'},
                    this.model.name
                )
            ),
            _.div({class: 'panel-body'},
                _.img({class: 'img-responsive', src: this.model.url})                    
            ),
            _.div({class: 'panel-footer'},
                _.div({class: 'btn-group'},
                    _.button({class: 'btn btn-danger'},
                        _.span({class: 'fa fa-trash'})
                    ).click(this.onClickDelete)
                )
            )
        );
    }
}

module.exports = MediaViewer;
