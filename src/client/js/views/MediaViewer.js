'use strict';

// Views
let MessageModal = require('./MessageModal');

class MediaViewer extends View {
    constructor(params) {
        super(params);

        this.init();
    }

    /**
     * Event: Click delete
     */
    onClickDelete() {
        new MessageModal({
            model: {
                title: 'Delete content',
                body: 'Are you sure you want to delete this?'
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

        this.$element = _.div({class: 'media-viewer panel panel-default'},
            _.div({class: 'panel-heading'},
                _.h4({class: 'panel-title'},
                    this.mediaId
                )
            ),
            _.div({class: 'panel-body'},
                function() {
                    return _.img({class: 'img-responsive', src: '/media/' + view.mediaId})                    
                }()
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
