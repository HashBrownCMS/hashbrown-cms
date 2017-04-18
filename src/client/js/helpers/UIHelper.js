'use strict';

class UIHelper {
    /**
     * Creates a switch
     *
     * @param {Boolean} initialValue
     * @param {Function} onChange
     *
     * @returns {HTMLElement} Switch element
     */
    static inputSwitch(initialValue, onChange) {
        let id = 'switch-' + (10000 + Math.floor(Math.random() * 10000));
        let $input;

        let $element = _.div({class: 'switch', 'data-checked': initialValue},
            $input = _.input({
                id: id,
                class: 'form-control switch',
                type: 'checkbox'
            }).change(function() {
                this.parentElement.dataset.checked = this.checked;

                if(onChange) {
                    onChange(this.checked);
                }
            }),
            _.label({for: id})
        );

        if(initialValue) {
            $input.attr('checked', true);
        }

        return $element;
    }

    /**
     * Creates a group of chips
     *
     * @param {Array} items
     * @param {Array} dropdownItems
     * @param {Function} onChange
     * @param {Boolean} isDropdownUnique
     *
     * @returns {HtmlElement} Chip group element
     */
    static inputChipGroup(items, dropdownItems, onChange, isDropdownUnique) {
        let $element = _.div({class: 'chip-group'});

        if(!items) { items = []; }

        function render() {
            _.append($element.empty(),

                // Render individual chips
                _.each(items, (itemIndex, item) => {
                    let $chip = _.div({class: 'chip'},

                        // Dropdown
                        _.if(Array.isArray(dropdownItems),
                            _.div({class: 'chip-label dropdown'},
                                _.button({class: 'dropdown-toggle', 'data-toggle': 'dropdown'},
                                    item.label || item.name || item.title || item 
                                ),
                                _.if(onChange,
                                    _.ul({class: 'dropdown-menu'},
                                        _.each(dropdownItems, (dropdownItemIndex, dropdownItem) => {
                                            // Look for unique dropdown items
                                            if(isDropdownUnique) {
                                                for(let item of items) {
                                                    if(item == dropdownItem) {
                                                        return;
                                                    }
                                                }
                                            }

                                            return _.li(
                                                _.a({href: '#'},
                                                    dropdownItem.label || dropdownItem.name || dropdownItem.title || dropdownItem
                                                ).click(function(e) {
                                                    e.preventDefault();
                                                        
                                                    items[itemIndex] = dropdownItem;

                                                    render();
                                
                                                    if(typeof onChange === 'function') {
                                                        onChange(items);
                                                    }
                                                })
                                            );
                                        })
                                    )
                                )
                            )
                        ),

                        // Regular string
                        _.if(!Array.isArray(dropdownItems),
                            _.if(!onChange,
                                _.p({class: 'chip-label'}, item)
                            ),
                            _.if(onChange,
                                _.input({type: 'text', class: 'chip-label', value: item})
                                    .change((e) => {
                                        items[itemIndex] = e.target.value;
                                    })
                            )
                        ),

                        // Remove button
                        _.if(onChange,
                            _.button({class: 'btn chip-remove'},
                                _.span({class: 'fa fa-remove'})
                            ).click(() => {
                                items.splice(itemIndex, 1);

                                render();

                                if(typeof onChange === 'function') {
                                    onChange(items);
                                }
                            })
                        )
                    );
                    
                    return $chip;
                }),

                // Add button
                _.if(onChange,
                    _.button({class: 'btn chip-add'},
                        _.span({class: 'fa fa-plus'})
                    ).click(() => {
                        if(Array.isArray(dropdownItems)) {
                            if(isDropdownUnique) {
                                for(let dropdownItem of dropdownItems) {
                                    let isSelected = false;

                                    for(let item of items) {
                                        if(item == dropdownItem) {
                                            isSelected = true;
                                            break;
                                        }
                                    }

                                    if(!isSelected) {
                                        items.push(dropdownItem);
                                        break;
                                    }
                                }
                            } else {
                                items.push(dropdownItems[0]);
                            }
                        
                        } else if(typeof dropdownItems === 'string') {
                            items.push(dropdownItems);

                        } else {
                            items.push('New item');

                        }

                        render(); 

                        if(typeof onChange === 'function') {
                            onChange(items);
                        }
                    })
                )
            );
        };

        render();

        return $element;
    }

    /**
     * Renders a dropdown
     *
     * @param {String|Number} defaultValue
     * @param {Array|Number} options
     * @param {Function} onChange
     * @param {Boolean} useClearButton
     * @param {Boolean} useSearch
     *
     * @returns {HtmlElement} Dropdown element
     */
    static inputDropdown(defaultValue, options, onChange, useClearButton) {
        let $toggle;
        let $clear;

        // If "options" parameter is a number, convert to array
        if(typeof options === 'number') {
            let amount = options;

            options = [];

            for(let i = 0; i < amount; i++) {
                options[options.length] = { label: i.toString(), value: i };
            }
        }

        // Change event
        let onClick = (e, element) => {
            let $button = $(e.target);
            let $li = $button.parents('li');

            $li
            .addClass('active')
            .siblings()
            .removeClass('active');

            $toggle.html($button.html());
            $toggle.click();
            
            onChange($li.attr('data-value'));
        };

        // Highlight selected value
        let highlightSelectedValue = () => {
            $element.find('ul li').removeClass('active');
            $toggle.html('(none)');       
            
            if(!defaultValue) { return; }

            for(let option of options) {
                if(option.value == defaultValue) {
                    $toggle.html(option.label);
                    $element.find('ul li[data-value="' + option.value + '"]').addClass('active');
                    break;
                }
            }
        };

        // Clear event
        let onClear = () => {
            defaultValue = onChange(null);

            highlightSelectedValue();
        };

        let $element = _.div({class: 'dropdown'},
            $toggle = _.button({class: 'btn btn-default dropdown-toggle', type: 'button', 'data-toggle': 'dropdown'},
                '(none)'
            ),
            _.if(useClearButton,
                $clear = _.button({class: 'btn btn-default btn-small dropdown-clear'},
                    _.span({class: 'fa fa-remove'})
                ).on('click', onClear)
            ),
            _.div({class: 'dropdown-menu'}, 
                _.ul({class: 'dropdown-menu-items'},
                    _.each(options, (i, option) => {
                        let optionLabel = option.label || option.id || option.name || option.toString();
                        let isSelected = option.selected || option.value == defaultValue;

                        if(isSelected) {
                            $toggle.html(optionLabel);
                        }

                        let $li = _.li({'data-value': option.value || optionLabel, class: isSelected ? 'active' : ''},
                            _.button(optionLabel).on('click', onClick)
                        );

                        return $li;
                    })
                )
            )
        );

        return $element;
    }
    
    /**
     * Renders a dropdown with typeahead
     *
     * @param {String} label
     * @param {Array|Number} options
     * @param {Function} onClick
     * @param {Boolean} useClearButton
     *
     * @returns {HtmlElement} Dropdown element
     */
    static inputDropdownTypeAhead(label, options, onClick, useClearButton) {
        let $element = this.inputDropdown(label, options, onClick, useClearButton);
        let inputTimeout;

        // Change input event
        let onChangeInput = () => {
            if(inputTimeout) { clearTimeout(inputTimeout); }    

            let query = ($element.find('.dropdown-typeahead input').val() || '').toLowerCase();
            let isQueryEmpty = !query || query.length < 2;

            inputTimeout = setTimeout(() => {
                $element.find('ul li button').each((i, button) => {
                    let $button = $(button);
                    let label = ($button.html() || '').toLowerCase();
                    let isMatch = label.indexOf(query) > -1;

                    $button.toggle(isMatch || isQueryEmpty);
                });
            }, 250);
        };

        // Clear input event
        let onClearInput = (e) => {
            e.preventDefault();
            e.stopPropagation();

            $element.find('.dropdown-typeahead input').val('');

            onChangeInput();
        };

        $element.addClass('typeahead');

        $element.find('.dropdown-menu').prepend(
            _.div({class: 'dropdown-typeahead'},
                _.input({class: 'form-control', placeholder: 'Search...'})
                    .on('keyup paste change propertychange', onChangeInput),
                _.button({class: 'dropdown-typeahead-btn-clear'},
                    _.span({class: 'fa fa-remove'})
                ).on('click', onClearInput)
            )
        );

        return $element;
    }

    /**
     * Renders a carousel
     *
     * @param {Array} items
     * @param {Boolean} useIndicators
     * @param {Boolean} useControls
     * @param {String} height
     *
     * @returns {HtmlElement} Carousel element
     */
    static carousel(items, useIndicators, useControls, height) {
        let id = 'carousel-' + (10000 + Math.floor(Math.random() * 10000));
        
        return _.div({class: 'carousel slide', id: id, 'data-ride': 'carousel', 'data-interval': 0},
            _.if(useIndicators,
                _.ol({class: 'carousel-indicators'},
                    _.each(items, (i, item) => {
                        return _.li({'data-target': '#' + id, 'data-slide-to': i, class: i == 0 ? 'active' : ''});
                    })
                )
            ),
            _.div({class: 'carousel-inner', role: 'listbox'},
                _.each(items, (i, item) => {
                    return _.div({class: 'item' + (i == 0? ' active': ''), style: 'height:' + (height || '500px')},
                        item
                    );
                })
            ),
            _.if(useControls,
                _.a({href: '#' + id, role: 'button', class: 'left carousel-control', 'data-slide': 'prev'},
                    _.span({class: 'fa fa-arrow-left'})
                ),
                _.a({href: '#' + id, role: 'button', class: 'right carousel-control', 'data-slide': 'next'},
                    _.span({class: 'fa fa-arrow-right'})
                )
            )
        );
    }

    /**
     * Brings up an error modal
     *
     * @param {String|Error} error
     * @param {Function} onClickOK
     */
    static errorModal(error, onClickOK) {
        if(!error) { return; }

        if(error instanceof String) {
            error = new Error(error);
        
        } else if(error instanceof Object) {
            if(error.responseText) {
                error = new Error(error.responseText);
            }
        
        } else if(error instanceof Error == false) {
            error = new Error(error.toString());

        }

        let modal = messageModal('<span class="fa fa-warning"></span> Error', error.message + '<br /><br />Please check the JavaScript console for details', onClickOK);

        modal.$element.toggleClass('error-modal', true);

        throw error;
    }

    /**
     * Brings up a message modal
     *
     * @param {String} title
     * @param {String} body
     */
    static messageModal(title, body, onSubmit) {
        return new MessageModal({
            model: {
                title: title,
                body: body,
                onSubmit: onSubmit
            }
        });
    }

    /**
     * Brings up an iframe modal
     *
     * @param {String} title
     * @param {String} url
     * @param {Function} onload
     * @param {Function} onerror
     */
    static iframeModal(title, url, onload, onerror) {
        let $iframe = _.iframe({src: url});

        return new MessageModal({
            model: {
                title: title,
                body: [
                    _.span({class: 'iframe-modal-error'}, 'If the preview didn\'t show up, please try the "reload" or "open" buttons'),
                    $iframe
                ],
                class: 'iframe-modal'
            },
            buttons: [
                {
                    label: 'Reload',
                    class: 'btn-primary',
                    callback: () => {
                        $iframe[0].src += '';

                        return false;
                    }
                },
                {
                    label: 'Open',
                    class: 'btn-primary',
                    callback: () => {
                        window.open($iframe[0].src);

                        return false;
                    }
                },
                {
                    label: 'OK',
                    class: 'btn-default'
                }
            ]
        });
    }

    /**
     * Brings up a confirm modal
     *
     * @param {String} type
     * @param {String} title
     * @param {String} body
     * @param {Function} onSubmit
     */
    static confirmModal(type, title, body, onSubmit, onCancel) {
        let submitClass = 'btn-primary';

        type = (type || '').toLowerCase();

        switch(type) {
            case 'delete': case 'remove': case 'discard': case 'clear':
                submitClass = 'btn-danger';
                break;
        }

        return new MessageModal({
            model: {
                title: title,
                body: body,
                onSubmit: onSubmit,
                class: 'confirm-modal'
            },
            buttons: [
                {
                    label: 'Cancel',
                    class: 'btn-default',
                    callback: onCancel
                },
                {
                    label: type,
                    class: submitClass,
                    callback: onSubmit
                }
            ]
        });
    }
}

window.errorModal = UIHelper.errorModal;
window.messageModal = UIHelper.messageModal;
window.confirmModal = UIHelper.confirmModal;

module.exports = UIHelper;
