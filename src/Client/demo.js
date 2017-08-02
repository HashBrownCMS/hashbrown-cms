'use strict';

window.currentUserIsAdmin = () => { return true; }
window.currentUserHasScope = () => { return true; }
window.startDebugSocket = () => {}

HashBrown.Models.User.current = new HashBrown.Models.User({
    id: '93afb0e4cd9e7545c589a084079e340766f94xb1',
    isAdmin: true,
    isCurrent: true,
    username: 'demouser',
    fullName: 'Demo User',
    email: 'demo@user.com',
    scopes: {}
});

/**
 * Wraps an API call with a custom path
 *
 * @param {String} method
 * @param {String} url
 * @param {Object} data
 *
 * @returns {Promise} Response
 */
window.customApiCall = function customApiCall(method, url, data) {
    let cache = localStorage.getItem('demo') || '{}';

    try {
        cache = JSON.parse(cache);
    } catch(e) {
        cache = {};
    }

    cache.api = cache.api || {};

    method = method.toUpperCase();

    return new Promise((resolve, reject) => {
        // Set a timeout, so we feel like it's an ajax call
        setTimeout(() => {
            switch(method) {
                case 'GET':
                    return resolve({});
            }

            resolve();
        }, 100);
    });
};

/**
 * Reloads a resource
 */
window.reloadResource = function reloadResource(name) {
    let model = null;
    let result = [];

    switch(name) {
        case 'templates':
            model = HashBrown.Models.Template;
            break;

        case 'users':
            model = HashBrown.Models.User;
            break;

        case 'media':
            model = HashBrown.Models.Media;
            break;

        case 'schemas':
            result = {
                'contentBase': require('Common/Schemas/Content/contentBase.schema'),
                'page': require('Common/Schemas/Content/page.schema'),
                'array': require('Common/Schemas/Field/array.schema'),
                'boolean': require('Common/Schemas/Field/boolean.schema'),
                'contentReference': require('Common/Schemas/Field/contentReference.schema'),
                'contentSchemaReference': require('Common/Schemas/Field/contentSchemaReference.schema'),
                'date': require('Common/Schemas/Field/date.schema'),
                'dropdown': require('Common/Schemas/Field/dropdown.schema'),
                'fieldBase': require('Common/Schemas/Field/fieldBase.schema'),
                'language': require('Common/Schemas/Field/language.schema'),
                'mediaReference': require('Common/Schemas/Field/mediaReference.schema'),
                'number': require('Common/Schemas/Field/number.schema'),
                'resourceReference': require('Common/Schemas/Field/resourceReference.schema'),
                'richText': require('Common/Schemas/Field/richText.schema'),
                'string': require('Common/Schemas/Field/string.schema'),
                'struct': require('Common/Schemas/Field/struct.schema'),
                'tags': require('Common/Schemas/Field/tags.schema'),
                'templateReference': require('Common/Schemas/Field/templateReference.schema'),
                'url': require('Common/Schemas/Field/url.schema')
            };
    
            for(let k in result) {
                if(k === 'contentBase' || k === 'page') {
                    result[k].type = 'content';
                } else {
                    result[k].type = 'field';
                }

                result[k].locked = true;
            }

            break;
    }

    return new Promise((resolve, reject) => {
        setTimeout(() => {
            window.resources[name] = result;

            // If a model is specified, use it to initialise every resource
            if(model) {
                for(let i in window.resources[name]) {
                    window.resources[name][i] = new model(window.resources[name][i]);
                }
            }

            resolve(result);
        }, 100);
    });
};

