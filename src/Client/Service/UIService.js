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

        for(let child of children) {
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
        }
        
        parentElement.classList.toggle('sorting', isActive);

        return true;
    }


    /**
     * Brings up an error modal
     *
     * @param {String|Error} error
     * @param {Function} onClickOK
     */
    static error(error, onClickOK) {
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

        return this.notify('<span class="fa fa-warning"></span> Error', error.message, onClickOK, 'error');
    }
    
    /**
     * Brings up a notification
     *
     * @param {String} heading
     * @param {String} message
     */
    static notify(heading, message, onClickOK) {
        let modal = new HashBrown.Entity.View.Modal.ModalBase({
            model: {
                heading: heading,
                message: message,
                role: 'notification'
            }
        });

        if(typeof onClickOK === 'function') {
            modal.on('ok', onClickOK);
        }

        return modal;
    }

    /**
     * Brings up a prompt modal
     *
     * @param {String} heading
     * @param {String} message
     * @param {String} widget
     * @param {*} value
     * @param {Function} onClickOK
     */
    static prompt(heading, message, widget, value, onClickOK) {
        let modal = new HashBrown.Entity.View.Modal.Prompt({
            model: {
                heading: heading,
                message: message,
                widget: widget,
                value: value
            }
        });

        if(onClickOK) {
            modal.on('ok', onClickOK);
        }

        return modal;
    }
        
    /**
     * Brings up a confirm modal
     *
     * @param {String} heading
     * @param {String} message
     * @param {Function} onClickYes
     * @param {Function} onClickNo
     */
    static confirm(heading, message, onClickYes, onClickNo) {
        let modal = new HashBrown.Entity.View.Modal.Confirm({
            model: {
                heading: heading,
                message: message
            }
        });

        if(onClickYes) {
            modal.on('yes', onClickYes);
        }

        if(onClickNo) {
            modal.on('no', onClickNo);
        }

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
            let pageY = e.touches ? e.touches[0].pageY : e.pageY;
            let pageX = e.touches ? e.touches[0].pageX : e.pageX;

            let contextMenu = new HashBrown.Entity.View.Widget.Popup({
                model: {
                    target: element,
                    options: items,
                    role: 'context-menu',
                    offset: {
                        x: pageX,
                        y: pageY
                    }
                }
            });

            document.body.appendChild(contextMenu.element);
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
