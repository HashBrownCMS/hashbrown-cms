module.exports = View.extend(function ContextMenu(params) {
    var self = this;
    
    // Remove other context menus
    View.removeAll('ContextMenu');
   
    self.register();
    self.adopt(params);

    self.$element = _.ul({ class: 'context-menu dropdown-menu', role: 'menu' });

    self.$element.css({
        position: 'absolute',
        'z-index': 1200,
        top: self.pos.y,
        left: self.pos.x,
        display: 'block'
    });
    
    self.fetch();
},
{
    render: function() {
        var self = this;

        self.$element.html(
            _.each(
                self.model,
                function(label, func) {
                    if(func == '---') {
                        return _.li(
                            { class: 'dropdown-header' },
                            label
                        );
                    } else {
                        return _.li(
                            { class: typeof func === 'function' ? '' : 'disabled' },
                            _.a(
                                { tabindex: '-1', href: '#' },
                                label
                            ).click(function(e) {
                                e.preventDefault();
                                e.stopPropagation();
                                
                                if(func) {
                                    func(e);

                                    View.removeAll('ContextMenu');
                                }
                            })
                        );
                    }
                }
            )
        );

        $('body').append(self.$element);
    }    
});

jQuery.fn.extend({
    context: function(menuItems) {
        return this.each(function() {
            $(this).on('contextmenu', function(e) {
                if(e.ctrlKey) {
                    return;
                }

                e.preventDefault();
                e.stopPropagation();

                if(e.which == 3) {
                    var menu = new ContextMenu({
                        model: menuItems,
                        pos: {
                            x: e.pageX,
                            y: e.pageY
                        }
                    });
                }
            });
        });
    }
});

// 
$('body').click(function(e) {
    if($(e.target).parents('.context-menu').length < 1) {
        View.removeAll('ContextMenu');
    }
});
