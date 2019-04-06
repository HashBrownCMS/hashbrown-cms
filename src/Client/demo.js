'use strict';

/**
 * Demo API
 *
 * @memberof HashBrown.Client
 */
class DemoApi {
    /**
     * Request
     */
    static async request(method, url) {
        method = method.toUpperCase();
        
        if(method !== 'GET') { return Promise.resolve(); }
        
        url = url.replace('/api/demo/live/', '');
        url = DemoApi.parseUrl(url);

        let resources = DemoApi.getAll(url.resource);

        if(url.id) {
            for(let resource of resources) {
                if(resource.id === url.id) {
                    return resource;
                }
            }

            return null;
        }
        
        return resources;
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
     * Gets a native resource
     */
    static getAll(category) {
        switch(category) {
            case 'users':
                return [ HashBrown.Context.user ];

            case 'settings':
                return [
                    {
                        id: 'providers',
                        media: '8c75aa0739cf66bcac269f01ab9007e666bd941b'
                    }
                ];

            case 'media':
                return [
					{"id":"50d05eee9088c589bfd5a5a3a3043c0ebcc4972b","remote":true,"icon":"file-image-o","name":"banner.jpg","url":"media/50d05eee9088c589bfd5a5a3a3043c0ebcc4972b/banner-flat-pink.jpg","folder":"banners"} 
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

            case 'content':
                return [
                    {
                        "locked": false,
                        "local": false,
                        "remote": false,
                        "id": "91f1ec2b984f291377c2dc488be2ebbefb46dd9a",
                        "parentId": "",
                        "createdBy": "demouser",
                        "updatedBy": "demouser",
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
                            "sections": [
                                {
                                    "value": {
                                        "image": "50d05eee9088c589bfd5a5a3a3043c0ebcc4972b",
                                        "text": "## HashBrown CMS\n\nCreate once. Publish anywhere." 
                                    },
                                    "schemaId": "f5c4cf4dffb088a2753760ad1da9cd64ff781003"
                                },
                                {
                                    "value": {
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
                    'contentBase': require('Common/Schemas/Content/contentBase.json'),
                    'page': require('Common/Schemas/Content/page.json'),
                    'array': require('Common/Schemas/Field/array.json'),
                    'boolean': require('Common/Schemas/Field/boolean.json'),
                    'contentReference': require('Common/Schemas/Field/contentReference.json'),
                    'contentSchemaReference': require('Common/Schemas/Field/contentSchemaReference.json'),
                    'date': require('Common/Schemas/Field/date.json'),
                    'dropdown': require('Common/Schemas/Field/dropdown.json'),
                    'fieldBase': require('Common/Schemas/Field/fieldBase.json'),
                    'language': require('Common/Schemas/Field/language.json'),
                    'mediaReference': require('Common/Schemas/Field/mediaReference.json'),
                    'number': require('Common/Schemas/Field/number.json'),
                    'resourceReference': require('Common/Schemas/Field/resourceReference.json'),
                    'richText': require('Common/Schemas/Field/richText.json'),
                    'string': require('Common/Schemas/Field/string.json'),
                    'struct': require('Common/Schemas/Field/struct.json'),
                    'tags': require('Common/Schemas/Field/tags.json'),
                    'url': require('Common/Schemas/Field/url.json'),
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
                            "sections": {
                                "tabId": "content",
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
                    "config": {
                        "struct": {
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
                    "config": {
                        "struct": {
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

// Override normal api call
HashBrown.Helpers.RequestHelper.request = DemoApi.request;
HashBrown.Helpers.RequestHelper.customRequest = DemoApi.request;
