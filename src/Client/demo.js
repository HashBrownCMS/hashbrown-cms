'use strict';

/**
 * Demo API
 */
class DemoApi {
    /**
     * Clears the cache
     */
    static reset() {
        localStorage.setItem('demo', null);

        location.hash = '/content/';
        location.reload();
    }

    /**
     * Gets the fake API cache
     */
    static getCache(resource, id) {
        let cache = this.cache;
        
        if(!cache) {
            try {
                cache = localStorage.getItem('demo') || '{}';
                cache = JSON.parse(cache);
            } catch(e) {
                cache = {};
            }
            
            cache = cache || {};
        }

        this.cache = cache;

        if(!resource) {
            return cache;
        }

        if(!cache[resource] || !Array.isArray(cache[resource])) {
            cache[resource] = DemoApi.getNativeResource(resource) || [];
        }

        if(!id) {
            return cache[resource];
        }

        for(let i in cache[resource]) {
            if(cache[resource][i].id == id) {
                return cache[resource][i];
            }
        }

        return null;
    }

    /**
     * Sets the fake API
     */
    static setCache(resource, id, data) {
        let cache = DemoApi.getCache();

        if(!cache[resource] || !Array.isArray(cache[resource])) {
            cache[resource] = DemoApi.getNativeResource(resource) || [];
        }

        let foundExisting = false;

        for(let i in cache[resource]) {
            if(cache[resource][i].id == id) {
                // Update data
                if(data) {
                    cache[resource][i] = data;

                // Delete data
                } else {
                    cache[resource].splice(i, 1);
                }

                foundExisting = true;
                
                break;
            }
        }

        if(!foundExisting && data) {
            cache[resource].push(data);
        }

        localStorage.setItem('demo', JSON.stringify(cache));

        console.log(cache);

        return data;
    }

    /**
     * Request
     */
    static request(method, url, data) {
        url = url.replace('/api/demo/live/', '');
        method = method.toUpperCase();

        debug.log(method + ' ' + url, DemoApi);

        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve(DemoApi.requestSync(method, url, data));
            }, 100);
        });
    }

    static requestSync(method, url, data) {
        url = url.replace('/api/demo/live/', '');
        method = method.toUpperCase();
        
        debug.log(method + ' ' + url, DemoApi);
        
        switch(method) {
            case 'GET':
                return DemoApi.get(url);

            case 'POST':
                return DemoApi.post(url, data);

            case 'DELETE':
                return DemoApi.delete(url);
        }

        return data;
    }

    /**
     * Parses a resource url
     */
    static parseUrl(url) {
        let query = {};
        let split = url.split('/');

        query.resource = split[0];
        query.params = url.split('?')[1];

        if(split.length > 1) {
            query.id = split[1].replace('?' + query.params, '');
        }

        return query;
    }

    /**
     * Delete
     */
    static delete(url) {
        let query = DemoApi.parseUrl(url);

        return DemoApi.setCache(query.resource, query.id, null);
    }

    /**
     * Get
     */
    static get(url) {
        let query = DemoApi.parseUrl(url);

        return DemoApi.getCache(query.resource, query.id);
    }

    /**
     * Post
     */
    static post(url, data) {
        let query = DemoApi.parseUrl(url);

        // Publish
        if(url == 'content/publish' || url == 'content/unpublish' || url == 'content/preview') {
            return Promise.resolve();
        }

        // Create new
        if(url.indexOf('content/new') > -1) {
            let schemaId = url.match(/content\/new\/([a-zA-Z0-9]+)/);

            if(!schemaId) {
                throw new Error('No Schema id specified');
            }

            schemaId = schemaId[1];

            let sort = url.match(/\?sort=([0-9]*)/);

            if(sort) {
                sort = sort[2];
            }
            
            let parentId = url.match(/\&parent=([0-9a-z]*)/);

            if(parentId) {
                parentId = parentId[1];
            }

            data = HashBrown.Models.Content.create(schemaId);
                
            data.parentId = parentId;
            data.sort = sort;

            query = {
                resource: 'content',
                id: data.id
            };
        }

        console.log('--- POST data:', data);

        return DemoApi.setCache(query.resource, query.id, data);
    }

    /**
     * Gets a native resource
     */
    static getNativeResource(type) {
        switch(type) {
            case 'users':
                return [
                    {
                        id: '4173f094621d4a882f912ccaf1cc6613a386519e',
                        isAdmin: true,
                        isCurrent: true,
                        username: 'demouser',
                        fullName: 'Demo User',
                        email: 'demo@user.com',
                        scopes: {}
                    }
                ];

            case 'settings':
                return [
                    {
                        id: 'providers',
                        media: '8c75aa0739cf66bcac269f01ab9007e666bd941b',
                        template: '8c75aa0739cf66bcac269f01ab9007e666bd941b'
                    }
                ];

            case 'media':
                return [
					{"id":"50d05eee9088c589bfd5a5a3a3043c0ebcc4972b","remote":true,"icon":"file-image-o","name":"banner-flat-pink.jpg","url":"media/50d05eee9088c589bfd5a5a3a3043c0ebcc4972b/banner-flat-pink.jpg","folder":"banners"} 
                ];

            case 'connections':
                return [
                    {
                        id: '8c75aa0739cf66bcac269f01ab9007e666bd941b',
                        title: 'My website',
                        url: 'example.com',
                        locked: true
                    }
                ];

            case 'templates':
                return [
                    {"id":"sectionPage","parentId":"","remote":true,"icon":"code","name":"sectionPage.html","type":"page","remotePath":"_layouts/sectionPage.html","folder":"","markup":""},
                    {"id":"heroSection","parentId":"","remote":true,"icon":"code","name":"heroSection.html","type":"partial","remotePath":"_includes/partials/heroSection.html","folder":"","markup":""},
                    {"id":"richTextSection","parentId":"","remote":true,"icon":"code","name":"richTextSection.html","type":"partial","remotePath":"_includes/partials/richTextSection.html","folder":"","markup":""}
                ];

            case 'content':
                return [
                    {
                        "locked": false,
                        "local": false,
                        "remote": false,
                        "id": "91f1ec2b984f291377c2dc488be2ebbefb46dd9a",
                        "parentId": "",
                        "createdBy": "4173f094621d4a882f912ccaf1cc6613a386519e",
                        "updatedBy": "4173f094621d4a882f912ccaf1cc6613a386519e",
                        "createDate": "2016-09-05T06:52:17.646Z",
                        "updateDate": "2017-08-03T15:55:10.590Z",
                        "publishOn": null,
                        "unpublishOn": null,
                        "schemaId": "591a897ad572cadae5115ef05726d9ead2725dc5",
                        "isPublished": true,
                        "hasPreview": false,
                        "sort": -1,
                        "properties": {
                            "title": "HashBrown CMS",
                            "url": "/",
                            "template": "sectionPage",
                            "sections": [
                                {
                                    "value": {
                                        "template": "heroSection",
                                        "image": "50d05eee9088c589bfd5a5a3a3043c0ebcc4972b",
                                        "text": "## HashBrown CMS\n\nCreate once. Publish anywhere." 
                                    },
                                    "schemaId": "f5c4cf4dffb088a2753760ad1da9cd64ff781003"
                                },
                                {
                                    "value": {
                                        "template": "richTextSection",
                                        "text": "## Why HashBrown?\n\n### Remote management\n\nSeparate your concerns with a truly modern approach to content management. Your websites won't know what hit them.\n\n### Multiple projects at once\n\nWhy worry about several CMS'es, when you only need one?\n\n### Several environments for each project\n\nWe get it. You need to test your content before you go live.\n\n### Multilingual\n\nRemember the last time you used a truly elegant localisation solution in a CMS? We don't either.\n\n### Plugin support\n\nIf your needs aren't met at the core level, you can add anything you can imagine.\n\n### Content format consistency\n\nWhen you are passing complex, format-agnostic data around, document databases are the way to go. HashBrown knows what's up.\n\n### Painless backups\n\nHashBrown has your back in seconds.\n\n### Small footprint\n\nYou could probably run HashBrown on your toaster at home."
                                    },
                                    "schemaId": "904e8e7570ddb37ea1f31d210db47cd15f92ff92"
                                }
                            ],
                            "description": "Create once. Publish anywhere."
                        },
                        "settings": {
                            "publishing": {
                                "connectionId": "8c75aa0739cf66bcac269f01ab9007e666bd941b",
                                "applyToChildren": true
                            }
                        }
                    }
                ];

            case 'schemas':
                let schemas = {
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
                    'url': require('Common/Schemas/Field/url.schema'),
                };
       
                let result = [];

                for(let k in schemas) {
                    schemas[k].id = k;

                    if(k === 'contentBase' || k === 'page' || schemas[k].type == 'content') {
                        schemas[k].type = 'content';
                    } else {
                        schemas[k].type = 'field';
                    }

                    if(schemas[k].isLocked !== false) {
                        schemas[k].isLocked = true;
                    }

                    result.push(HashBrown.Helpers.SchemaHelper.getModel(schemas[k]));
                }

                // Section page
                result.push(new HashBrown.Models.ContentSchema({
                    "isLocked": false,
                    "sync": {
                        "hasRemote": false,
                        "isRemote": false
                    },
                    "id": "591a897ad572cadae5115ef05726d9ead2725dc5",
                    "name": "Section Page",
                    "icon": "file",
                    "parentSchemaId": "page",
                    "hiddenProperties": [],
                    "defaultTabId": "content",
                    "tabs": {},
                    "fields": {
                        "properties": {
                            "template": {
                                "label": "Template",
                                "schemaId": "templateReference",
                                "config": {
                                    "allowedTemplates": ["sectionPage"],
                                    "type": "page"
                                }
                            },
                            "sections": {
                                "label": "Sections",
                                "tabId": "content",
                                "schemaId": "array",
                                "config": {
                                    "allowedSchemas": ["904e8e7570ddb37ea1f31d210db47cd15f92ff92", "f5c4cf4dffb088a2753760ad1da9cd64ff781003"]
                                }
                            }
                        }
                    },
                    "allowedChildSchemas": ["591a897ad572cadae5115ef05726d9ead2725dc5"],
                    "type": "content"
                }));

                // Section
                result.push(new HashBrown.Models.FieldSchema({
                    "isLocked": false,
                    "sync": {
                        "hasRemote": false,
                        "isRemote": false
                    },
                    "local": false,
                    "remote": false,
                    "id": "7ccbf2d613a4da3e5543abdde33b9eb0e5fbb8f3",
                    "name": "Section",
                    "icon": "file",
                    "parentSchemaId": "struct",
                    "hiddenProperties": [],
                    "editorId": "struct",
                    "previewTemplate": "",
                    "config": {
                        "template": {
                            "label": "Template",
                                "schemaId": "templateReference",
                                "config": {
                                    "type": "partial"
                                }
                        }
                    },
                    "type": "field"
                }));

                // Rich text section
                result.push(new HashBrown.Models.FieldSchema({
                    "isLocked": false,
                    "sync": {
                        "hasRemote": false,
                        "isRemote": false
                    },
                    "id": "904e8e7570ddb37ea1f31d210db47cd15f92ff92",
                    "name": "Rich Text Section",
                    "icon": "file-text-o",
                    "parentSchemaId": "7ccbf2d613a4da3e5543abdde33b9eb0e5fbb8f3",
                    "hiddenProperties": [],
                    "editorId": "struct",
                    "previewTemplate": "",
                    "config": {
                        "struct": {
                            "template": {
                                "label": "Template",
                                "schemaId": "templateReference",
                                "config": {
                                    "allowedTemplates": ["richTextSection"],
                                    "type": "partial"
                                }
                            },
                            "text": {
                                "label": "Text",
                                "tabId": "content",
                                "schemaId": "richText"
                            }
                        }
                    },
                    "type": "field"
                }));

                // Hero
                result.push(new HashBrown.Models.FieldSchema({
                    "isLocked": false,
                    "sync": {
                        "hasRemote": false,
                        "isRemote": false
                    },
                    "id": "f5c4cf4dffb088a2753760ad1da9cd64ff781003",
                    "name": "Hero Section",
                    "icon": "image",
                    "parentSchemaId": "7ccbf2d613a4da3e5543abdde33b9eb0e5fbb8f3",
                    "hiddenProperties": [],
                    "editorId": "struct",
                    "previewTemplate": "",
                    "config": {
                        "struct": {
                            "template": {
                                "label": "Template",
                                    "schemaId": "templateReference",
                                    "config": {
                                        "allowedTemplates": ["heroSection"],
                                        "type": "partial"
                                    }
                            },
                            "image": {
                                "label": "Image",
                                "schemaId": "mediaReference"
                            },
                            "text": {
                                "label": "Text",
                                "schemaId": "richText"
                            }
                        }
                    },
                    "type": "field"
                }));

                return result;

            default:
                return [];
        }
    }
}

HashBrown.DemoApi = DemoApi;

// Override normal api call
HashBrown.Helpers.RequestHelper.request = DemoApi.request;
HashBrown.Helpers.RequestHelper.customRequest = DemoApi.request;

// ----------
// Debug socket
// ----------
debug.startSocket = () => {}

// ----------
// SchemaHelper
// ----------
HashBrown.Helpers.SchemaHelper.getSchemaWithParentFields = (id) => {
    let schema = DemoApi.requestSync('get', 'schemas/' + id);

    if(schema.parentSchemaId) {
        return HashBrown.Helpers.SchemaHelper.getSchemaWithParentFields(schema.parentSchemaId)
        .then((parentSchema) => {
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    if(typeof parentSchema.getObject === 'function') {
                        parentSchema = parentSchema.getObject();
                    }

                    let mergedSchema = HashBrown.Helpers.SchemaHelper.mergeSchemas(schema, parentSchema);

                    resolve(mergedSchema);
                }, 100);
            });
        });
    }

    schema = HashBrown.Helpers.SchemaHelper.getModel(schema);

    return Promise.resolve(schema);
};

// ----------
// Crisp UI
// ----------
View.prototype.fetch = function fetch() {
    let view = this;

    function getModel() {
        // Get model from URL
        if(!view.model && typeof view.modelUrl === 'string') {
            view.model = DemoApi.requestSync('get', view.modelUrl);
            view.init();
        
        // Get model with function
        } else if(!view.model && typeof view.modelFunction === 'function') {
            view.modelFunction(function(data) {
                view.model = data;

                view.init();
            });

        // Just perform the initialisation
        } else {
            view.init();
        }
    }

    // Get the model
    getModel();    
}

// ----------
// Resource loading
// ----------
HashBrown.Helpers.RequestHelper.reloadResource = function reloadResource(name) {
    let model = null;
    let result = HashBrown.DemoApi.requestSync('get', name);
    
    switch(name) {
        case 'content':
            model = HashBrown.Models.Content;
            break;

        case 'templates':
            model = HashBrown.Models.Template;
            break;

        case 'users':
            model = HashBrown.Models.User;
            break;

        case 'media':
            model = HashBrown.Models.Media;
            break;

        case 'connections':
            model = HashBrown.Models.Connection;
            break;

        case 'schemas':
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
