'use strict';

/**
 * A UI helper for creating and handling common interface behaviours
 *
 * @memberof HashBrown.Client.Service
 */
class UIService {
    /**
     * Renders a spinner
     *
     * @param {HTMLElement} element
     * @param {Boolean} noBackground
     * @param {String} icon
     *
     * @return {HTMLElement} Spinner
     */
    static spinner(element = null, noBackground = false, icon = 'refresh') {
        let iconIsImage = icon.indexOf('/') === 0;

        let spinner = _.div({class: 'widget widget--spinner ' + (element ? 'embedded ' : '' ) + (noBackground ? 'no-background' : '')},
            _.div({class: 'widget--spinner__inner'},
                _.do(() => {
                    if(iconIsImage) {
                        return _.img({class: 'widget--spinner__image', src: icon});
                    }
                    
                    return _.div({class: 'widget--spinner__image fa fa-' + icon});
                }),
                _.div({class: 'widget--spinner__messages'})
            )
        );

        if(element) {
            _.append(element, spinner);
        } else {
            _.append(document.body, spinner);
        }

        return spinner;
    }
   
    /**
     * Attaches a message to a spinner
     *
     * @param {HTMLElement} spinner
     * @param {Number} index
     * @param {String} message
     * @param {Boolean} isLoaded
     */
    static setSpinnerMessage($spinner, index, message, isLoaded = false) {
        let $messages = $spinner.find('.widget--spinner__messages');
        let $message = $messages.children().eq(index);
        
        if(!$message || $message.length < 1) {
            $message = _.div({class: 'widget--spinner__message'});
            $messages.append($message);
        }

        $message.html(message);
        $message.toggleClass('loaded', isLoaded);
    }

    /**
     * Hides a spinner
     *
     * @param {HTMLElement} spinner
     */
    static hideSpinner($spinner) {
        $spinner.toggleClass('hidden', true);

        setTimeout(() => { $spinner.remove(); }, 1000);
    }

    /**
     * Highlights an element with an optional label
     *
     * @param {Boolean|HTMLElement} element
     * @param {String} label
     * @param {String} direction
     * @param {String} buttonLabel
     *
     * @return {Promise} Callback on dismiss
     */
    static highlight(element, label, direction = 'right', buttonLabel) {
        if(element === false) {
            $('.widget--highlight').remove();

            return;
        }

        if(typeof element === 'string') {
            element = document.querySelector(element);
        }

        if(!element) { return Promise.resolve(); }

        return new Promise((resolve) => {
            let dismiss = () => {
                $highlight.remove();

                resolve(element);
            };
            
            let $highlight = _.div({class: 'widget--highlight' + (label ? ' ' + direction : ''), style: 'top: ' + element.offsetTop + 'px; left: ' + element.offsetLeft + 'px;'},
                _.div({class: 'widget--highlight__backdrop'}),
                _.div({class: 'widget--highlight__frame', style: 'width: ' + element.offsetWidth + 'px; height: ' + element.offsetHeight + 'px;'}),
                _.if(label,
                    _.div({class: 'widget--highlight__label'},
                        _.div({class: 'widget--highlight__label__text'}, label),
                        _.if(buttonLabel,
                            _.button({class: 'widget widget--button widget--highlight__button condensed'}, buttonLabel)
                                .click(() => {
                                    dismiss();
                                })
                        )
                    )
                )
            ).click(() => {
                if(buttonLabel) { return; }

                dismiss();
            });
            
            _.append(element.parentElement, $highlight);
        });
    }

    /**
     * Sets the content of the editor space
     *
     * @param {Array|HTMLElement} content
     * @param {String} className
     */
    static setEditorSpaceContent(content, className) {
        let $space = $('.page--environment__space--editor');

        if(className) {
            content = _.div({class: 'page--environment__space--editor__' + className}, content);
        }

        _.append($space.empty(), content);
    }

    /**
     * Creates a sortable context specific to arrays using editor fields
     *
     * @param {Array} array
     * @param {HTMLElement} field
     * @param {Function} onChange
     */
    static fieldSortableArray(array, field, onChange) {
        let oldArray = JSON.parse(JSON.stringify(array || []));

        let itemParent = field.querySelector('.editor__field__value');
        
        // Map all elements
        let mappings = [];

        for(let element of Array.from(itemParent.children).filter((x) => { return x.classList.contains('editor__field'); })) {
            mappings.push({element: element, value: oldArray.shift() });
        }

        // Init the sortable context
        this.fieldSortable(field, (element) => {
            if(!element) { return; }

            // Rebuild array using mappings
            let newArray = [];

            for(let element of Array.from(itemParent.children).filter((x) => { return x.classList.contains('editor__field'); })) {
                let mapping = mappings.filter((x) => { return x.element === element; })[0];

                newArray.push(mapping.value);
            }

            onChange(newArray);
        });
    }

    /**
     * Creates a sortable context specific to objects using editor fields
     *
     * @param {Object} object
     * @param {HTMLElement} field
     * @param {Function} onChange
     */
    static fieldSortableObject(object, field, onChange) {
        let oldObject = JSON.parse(JSON.stringify(object || {}));
        
        this.fieldSortable(field, (element) => {
            if(!element) { return; }

            // Rebuild object
            let newObject = {};

            for(let element of Array.from(field.querySelectorAll('.editor__field__value > .editor__field'))) {
                let itemSortKeyElement = element.querySelector('.editor__field__key__label');
                let itemKey = itemSortKeyElement.dataset.sortKey || itemSortKeyElement.value || itemSortKeyElement.innerHTML;
                let itemValue = object[itemKey];

                newObject[itemKey] = itemValue;
            }

            // Fire the change event
            onChange(newObject);
        });
    }

    /**
     * Creates a sortable context specific to fields
     *
     * @param {HTMLElement} field
     * @param {Function} onChange
     */
    static fieldSortable(field, onChange) {
        let btnSort = field.querySelector('.editor__field__key__action--sort');
        let divValue = field.querySelector('.editor__field__value');
        let isSorting = !divValue.classList.contains('sorting');

        if(this.sortable(divValue, 'editor__field', isSorting, onChange)) {
            btnSort.classList.toggle('sorting', isSorting);
            divValue.classList.toggle('sorting', isSorting);
        }
    }

    /**
     * Creates a sortable context
     *
     * @param {HTMLElement} parentElement
     * @param {String} sortableClassName
     * @param {Boolean} isActive
     * @param {Function} onChange
     *
     * @returns {Boolean} Whether or not sorting was initialised
     */
    static sortable(parentElement, sortableClassName, isActive, onChange) {
        let children = Array.prototype.slice.call(parentElement.children || []);
        let canSort = true;
        let currentDraggedChild;
        
        children = children.filter((child) => {
            return child instanceof HTMLElement && child.classList.contains(sortableClassName);
        });

        if(!children || children.length < 1) { return false; }

        if(typeof isActive === 'undefined') {
            isActive = !parentElement.classList.contains('sorting');
        }

        if(isActive) {
            parentElement.ondragover = (e) => {
                if(!canSort || !currentDraggedChild) { return; }

                let bodyRect = document.body.getBoundingClientRect();

                _.each(children, (i, sibling) => {
                    if(sibling === currentDraggedChild || !canSort || e.pageY < 1) { return; }

                    let cursorY = e.pageY;
                    let childY = currentDraggedChild.getBoundingClientRect().y - bodyRect.y;
                    let siblingY = sibling.getBoundingClientRect().y - bodyRect.y;
                    let hasMoved = false;

                    // Dragging above a sibling
                    if(cursorY < siblingY && childY > siblingY) {
                        sibling.parentElement.insertBefore(currentDraggedChild, sibling);    
                        hasMoved = true;
                    }

                    // Dragging below a sibling
                    if(cursorY > siblingY && childY < siblingY) {
                        sibling.parentElement.insertBefore(currentDraggedChild, sibling.nextElementSibling);
                        hasMoved = true;
                    }

                    // Init transition
                    if(hasMoved) {
                        canSort = false;

                        let newChildY = currentDraggedChild.getBoundingClientRect().y - document.body.getBoundingClientRect().y;
                        let newSiblingY = sibling.getBoundingClientRect().y - document.body.getBoundingClientRect().y;

                        currentDraggedChild.style.transform = 'translateY(' + (childY - newChildY) + 'px)';
                        sibling.style.transform = 'translateY(' + (siblingY - newSiblingY) + 'px)';

                        setTimeout(() => {
                            if(currentDraggedChild) { currentDraggedChild.removeAttribute('style'); }
                            if(sibling) { sibling.removeAttribute('style'); }

                            canSort = true;
                        }, 100);
                    }
                });
            };

        } else {
            parentElement.ondragover = null;

        }

        _.each(children, (i, child) => {
            child.draggable = isActive;

            if(isActive) {
                child.ondragstart = (e) => {
                    e.dataTransfer.setData('text/plain', '');
                    child.classList.toggle('dragging', true);
                    currentDraggedChild = child;
                };
                
                child.ondragend = (e) => {
                    onChange(child);
                    currentDraggedChild = null;
                    child.classList.toggle('dragging', false);
                };

                child.ondragcancel = (e) => {
                    onChange(child);
                    currentDraggedChild = null;
                    child.classList.toggle('dragging', false);
                };

            } else {
                child.classList.toggle('dragging', false);
                child.ondragstart = null;
                child.ondrag = null;
                child.ondragstop = null;
                child.ondragcancel = null;
                currentDraggedChild = null;
            }
        });
        
        parentElement.classList.toggle('sorting', isActive);

        return true;
    }


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

        $element.on('set', (e, newValue) => {
            $input[0].checked = newValue;
        });

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
                    let label = item.label || item.name || item.title;
                    
                    if(!label) {
                        for(let dropdownItem of dropdownItems) {
                            let value = dropdownItem.id || dropdownItem.value || dropdownItem;

                            if(value === item) {
                                label = dropdownItem.label || dropdownItem.name || dropdownItem.title || dropdownItem;
                            }
                        }
                    }

                    if(!label) { 
                        label = item;
                    }

                    let $chip = _.div({class: 'chip'},

                        // Dropdown
                        _.if(Array.isArray(dropdownItems),
                            _.div({class: 'chip-label dropdown'},
                                _.button({class: 'dropdown-toggle', 'data-toggle': 'dropdown'},
                                    label
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
                                                        
                                                    items[itemIndex] = dropdownItem.value || dropdownItem.id || dropdownItem;

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
                                        items.push(dropdownItem.value || dropdownItem);
                                        break;
                                    }
                                }
                            } else {
                                items.push(dropdownItems[0].value || dropdownItems[0]);
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
        
        } else if(error.responseText) {
            error = new Error(error.responseText);
        
        } else if(error instanceof ErrorEvent) {
            error = error.error;

        } else if(error instanceof Event) {
            error = error.target.error;
        
        } else if(error instanceof Error === false) {
            error = new Error(error.toString());

        }
       
        debug.log(error.message + ': ' + error.stack, 'HashBrown');
        console.trace();

        return UIService.messageModal('<span class="fa fa-warning"></span> Error', error.message, onClickOK, 'error');
    }
    
    /**
     * Brings up a warning modal
     *
     * @param {String} warning
     * @param {Function} onClickOK
     */
    static warningModal(warning, onClickOK) {
        if(!warning) { return; }

        return UIService.messageModal('<span class="fa fa-warning"></span> Warning', warning, onClickOK, 'warning');
    }

    /**
     * Brings up a notification
     *
     * @param {String} title
     * @param {String} body
     */
    static notify(title, body) {
        let modal = new HashBrown.View.Modal.Modal({
            title: title,
            body: body,
            group : 'notification'
        });

        return modal;
    }

    /**
     * Brings up a message modal
     *
     * @param {String} title
     * @param {String} body
     * @param {Function} onClickOK
     * @param {String} group
     */
    static messageModal(title, body, onClickOK, group) {
        let modal = new HashBrown.View.Modal.Modal({
            isBlocking: onClickOK === false,
            title: title,
            group: group,
            body: body
        });

        if(onClickOK) {
            modal.on('ok', onClickOK);
        }

        return modal;
    }

    /**
     * Brings up an iframe modal
     *
     * @param {String} title
     * @param {String} url
     * @param {Function} onSubmit
     * @param {Function} onCancel
     */
    static iframeModal(title, url, onSubmit, onCancel) {
        let modal = new HashBrown.View.Modal.IframeModal({
            title: title,
            url: url
        });

        if(typeof onSubmit === 'function') {
            modal.on('ok', onSubmit);
        }

        if(typeof onCancel === 'function') {
            modal.on('cancel', onCancel);
        }
       
        return modal;
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
        let modal = new HashBrown.View.Modal.ConfirmModal({
            type: type ? type.toLowerCase() : null,
            title: title,
            body: body
        });

        modal.on('cancel', onCancel);
        modal.on('ok', onSubmit);

        return modal;
    }

    /**
     * Creates a context menu
     *
     * @param {HTMLElement} element
     * @param {Object} items
     * @param {HTMLElement} button
     */
    static context(element, items, button) {
        if(!element) { return; }
        
        let openContextMenu = (e) => {
            // Find any existing context menu targets and remove their classes
            let clearTargets = () => {
                let targets = document.querySelectorAll('.context-menu-target');
            
                if(!targets) { return; }
            
                for(let i = 0; i < targets.length; i++) {
                    targets[i].classList.remove('context-menu-target');
                }
            };

            clearTargets();

            // Set new target
            element.classList.toggle('context-menu-target', true);
            
            // Remove existing dropdowns
            let existingMenu = _.find('.widget--dropdown.context-menu');

            if(existingMenu) { existingMenu.remove(); }

            // Init new dropdown
            let dropdown = new HashBrown.View.Widget.Dropdown({
                options: items,
                reverseKeys: true,
                onChange: (pickedItem) => {
                    if(typeof pickedItem !== 'function') { return; }

                    pickedItem();
                }
            });
                
            dropdown.toggle(false);

            // Prevent the toggle button from blocking new context menu events
            let toggle = dropdown.element.querySelector('.widget--dropdown__toggle');
            let options = dropdown.element.querySelector('.widget--dropdown__options');

            toggle.addEventListener('contextmenu', (e) => {
                e.preventDefault();
                dropdown.toggle(false);
            });

            // Set cancel event
            dropdown.on('cancel', () => {
                dropdown.remove();

                // Wait a bit before removing the classes, as they are often used as references in the functions executed by the context menu
                setTimeout(clearTargets, 100);
            });
            
            // Append to body
            document.body.appendChild(dropdown.element);

            setTimeout(() => {
                // Set styles
                let pageY = e.touches ? e.touches[0].pageY : e.pageY;
                let pageX = e.touches ? e.touches[0].pageX : e.pageX;

                dropdown.element.classList.toggle('context-menu', true);
                dropdown.element.style.top = pageY + 'px';
                dropdown.element.style.left = pageX + 'px';

                // Open it
                dropdown.toggle(true);
            }, 1);
        };
        
        element.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            e.stopPropagation();
                
            openContextMenu(e);
        });

        element.addEventListener('touchstart', (e) => {
            if(e.touchTargets && e.touchTargets.length > 1) {
                e.preventDefault();
                e.stopPropagation();

                openContextMenu(e);
            }
        });

        if(button) {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
            
                openContextMenu(e);
            });
        }
    }
}

module.exports = UIService;
