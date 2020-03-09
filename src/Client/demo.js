'use strict';

const CONNECTIONS = {}; 
const MEDIA = {};
const FORMS = {};

const CONTENT = {
    '3217ea5955478c0b': {
        id: '3217ea5955478c0b',
        createDate: Date.now(),
        updateDate: Date.now(),
        createdBy: 'demoUser',
        updateddBy: 'demoUser',
        schemaId: 'webPage',
        sort: 10000,
        properties: {
            url: '/my-example-page/',
            title: 'My Example Page'
        }
    }
};

const SCHEMAS = {
    // Field
    'array': require('schema/field/array.json'),
    'boolean': require('schema/field/boolean.json'),
    'contentReference': require('schema/field/contentReference.json'),
    'contentSchemaReference': require('schema/field/contentSchemaReference.json'),
    'date': require('schema/field/date.json'),
    'dropdown': require('schema/field/dropdown.json'),
    'fieldBase': require('schema/field/fieldBase.json'),
    'language': require('schema/field/language.json'),
    'mediaReference': require('schema/field/mediaReference.json'),
    'number': require('schema/field/number.json'),
    'resourceReference': require('schema/field/resourceReference.json'),
    'richText': require('schema/field/richText.json'),
    'string': require('schema/field/string.json'),
    'struct': require('schema/field/struct.json'),
    'tags': require('schema/field/tags.json'),
    'url': require('schema/field/url.json'),
    'module': {
        id: 'module',
        name: 'Module',
        type: 'field',
        parentSchemaId: 'struct',
        config: {
            struct: {
                string: {
                    schemaId: 'string',
                    label: 'String',
                    description: 'A simple text string'
                },
                boolean: {
                    schemaId: 'boolean',
                    label: 'Boolean',
                    description: 'A true/false value'
                }
            }
        }
    },

    // Content
    'contentBase': require('schema/content/contentBase.json'),
    'page': require('schema/content/page.json'),
    'webPage': {
        id: 'webPage',
        icon: 'file',
        type: 'content',
        defaultTabId: 'content',
        allowedChildSchemas: [ 'webPage' ],
        allowedAtRoot: true,
        name: 'Web Page',
        parentSchemaId: 'page',
        fields: {
            properties: {
                array: {
                    tabId: 'content',
                    label: 'Array',
                    schemaId: 'array',
                    description: 'A list of values',
                    config: {
                        minItems: 0,
                        maxItems: 4,
                        allowedSchemas: [ 'module', 'string', 'richText' ]
                    }
                },
                boolean: {
                    tabId: 'content',
                    schemaId: 'boolean',
                    label: 'Boolean',
                    description: 'A true/false value'
                },
                contentReference: {
                    tabId: 'content',
                    schemaId: 'contentReference',
                    label: 'Content Reference',
                    description: 'A reference to another Content node',
                    config: {
                        allowedSchemas: [ 'webPage' ]
                    }
                },
                contentSchemaReference: {
                    tabId: 'content',
                    schemaId: 'contentSchemaReference',
                    label: 'Content Schema Reference',
                    description: 'A reference to a Content Schema',
                    config: {
                        allowedSchemas: [ 'webPage' ]
                    }
                },
                date: {
                    tabId: 'content',
                    schemaId: 'date',
                    label: 'Date',
                    description: 'A date picker'
                },
                dropdown: {
                    tabId: 'content',
                    schemaId: 'dropdown',
                    label: 'Dropdown',
                    description: 'A dropdown list of options',
                    config: {
                        options: [
                            {
                                label: 'Option #1',
                                value: 'option1'
                            },
                            {
                                label: 'Option #2',
                                value: 'option2'
                            },
                            {
                                label: 'Option #3',
                                value: 'option3'
                            }
                        ]
                    }
                },
                language: {
                    tabId: 'content',
                    schemaId: 'language',
                    label: 'Language',
                    description: 'A dropdown list of available languages'
                },
                mediaReference: {
                    tabId: 'content',
                    schemaId: 'mediaReference',
                    label: 'Media Reference',
                    description: 'A reference to a Media node'
                },
                number: {
                    tabId: 'content',
                    schemaId: 'number',
                    label: 'Number',
                    description: 'A number picker, which can optionally be a slider',
                    config: {
                        step: 0.5,
                        min: 0,
                        max: 10,
                        isSlider: true
                    }
                },
                richText: {
                    tabId: 'content',
                    schemaId: 'richText',
                    label: 'Rich Text',
                    description: 'A formatted text field'
                },
                string: {
                    tabId: 'content',
                    schemaId: 'string',
                    label: 'String',
                    description: 'A simple text string'
                },
                struct: {
                    tabId: 'content',
                    schemaId: 'module',
                    label: 'Struct',
                    description: 'A combination of fields'
                },
                tags: {
                    tabId: 'content',
                    schemaId: 'tags',
                    label: 'Tags',
                    description: 'A comma-separated list of tags'
                }
            }
        }
    }
};

HashBrown.Service.RequestService.upload = async () => {
    throw new Error('Uploads not available in demo mode');
};

HashBrown.Service.RequestService.customRequest = async (method, url, data, headers) => {
    if(url === '/api/server/update/check') { return; }
    if(url.indexOf('heartbeat') > -1) { return; }

    let query = url.split('?')[1];
    let path = url.split('?')[0].split('/');
    let category = path[4];
    let id = path[5];

    switch(category) {
        case 'connections':
            if(!id) {
                return Object.values(CONNECTIONS);

            } else {
                if(id === 'new') {
                    let connection = HashBrown.Entity.Resource.Connection.create();
                    
                    CONNECTIONS[connection.id] = connection.getObject();

                    return connection;
                }
                
                if(method === 'post') {
                    CONNECTIONS[id] = data;
                    return data;
                }

                if(CONNECTIONS[id]) {
                    return CONNECTIONS[id];
                
                } else if(id === 'processors') {
                    return [{"alias":"jekyll","name":"Jekyll"},{"alias":"json","name":"JSON"},{"alias":"uischema","name":"uischema.org"}];
                
                } else if(id === 'deployers') {
                    return [{"alias":"api","name":"API"},{"alias":"filesystem","name":"File system"},{"alias":"git","name":"Git"}];

                } else {
                    throw new Error('Connection "' + id + '" not found');

                }

            }

        case 'content':
            if(!id) {
                return Object.values(CONTENT);

            } else {
                if(id === 'new') {
                    let schemaId = HashBrown.Service.NavigationService.getQuery('schemaId', query);
                    let content = HashBrown.Entity.Resource.Content.create(schemaId);

                    content.parentId = HashBrown.Service.NavigationService.getQuery('parentId', query);

                    CONTENT[content.id] = content.getObject();

                    return content;
                }
                
                if(id === 'insert') {
                    let contentId = HashBrown.Service.NavigationService.getQuery('contentId', query);
                    let parentId = HashBrown.Service.NavigationService.getQuery('parentId', query);
                    let position = parseInt(HashBrown.Service.NavigationService.getQuery('position', query));
                
                    let siblings = Object.values(CONTENT).filter((x) => { return x.parentId === parentId; });
                    let content = CONTENT[contentId];

                    if(parentId) {
                        if(parentId === contentId) { throw new Error('Content cannot be a parent of itself'); }
                    }

                    // Assign the new position
                    let result = [];

                    if(position < 0) { position = 0; }

                    for(let i = 0; i < siblings.length; i++) {
                        if(siblings[i].id === contentId) { continue; }

                        if(i === position) {
                            result.push(content);
                        }

                        result.push(siblings[i]);
                    }

                    if(result.indexOf(content) < 0) {
                        result.push(content);
                    }

                    // Update all nodes with their new sort index
                    for(let i = 0; i < result.length; i++) {
                        let node = result[i];

                        node.sort = i;
                        node.parentId = parentId;
                    }
                
                    return;
                }
               
                if(method === 'post') {
                    CONTENT[id] = data;
                    return data;
                }

                if(CONTENT[id]) {
                    return CONTENT[id];
                
                } else {
                    throw new Error('Content "' + id + '" not found');

                }
            }
        
        case 'forms':
            if(!id) {
                return Object.values(FORMS);

            } else {
                if(id === 'new') {
                    let form = HashBrown.Entity.Resource.Form.create();
                    
                    FORMS[form.id] = form.getObject();

                    return form;
                }
                
                if(method === 'post') {
                    FORMS[id] = data;
                    return data;
                }

                if(FORMS[id]) {
                    return FORMS[id];
                
                } else {
                    throw new Error('Form "' + id + '" not found');

                }

            }

        case 'media':
            if(!id) {
                return Object.values(MEDIA);

            } else {
                if(id === 'new') {
                    let media = HashBrown.Entity.Resource.Media.create();
                    
                    MEDIA[media.id] = media.getObject();

                    return media;
                }
                
                if(method === 'post') {
                    MEDIA[id] = data;
                    return data;
                }

                if(MEDIA[id]) {
                    return MEDIA[id];
                
                } else {
                    throw new Error('Media "' + id + '" not found');

                }

            }
        
        case 'schemas':
            if(!id) {
                return Object.values(SCHEMAS);
    
            } else {
                if(id === 'new') {
                    let parentSchemaId = HashBrown.Service.NavigationService.getQuery('parentSchemaId', query);
                    let parentSchema = await HashBrown.Entity.Resource.SchemaBase.get(parentSchemaId);
                    let schema = await HashBrown.Entity.Resource.Schema.SchemaBase.create({ parentId: parentSchemaId });

                    SCHEMAS[schema.id] = schema;

                    return schema;
                }

                if(method === 'post') {
                    SCHEMAS[id] = data;
                    return data;
                }

                if(SCHEMAS[id]) {
                    return SCHEMAS[id];

                } else {
                    throw new Error('Schema "' + id + '" could not be found');
                
                }
            }
        
        case 'users':
            if(!id) {
                return [HashBrown.Context.user];

            } else if(id === 'demoUser') {
                return HashBrown.Context.user;

            }

            throw new Error('Custom users not available in demo');

        case 'settings':
            return HashBrown.Context.projectSettings;
    }

    throw new Error('Unknown resource category "' + category + '". URL was ' + url);
};

for(let id in SCHEMAS) {
    let schema = SCHEMAS[id];

    schema.id = id;
    schema.isLocked = schema.parentSchemaId === 'fieldBase' || schema.parentSchemaId === 'contentBase' || schema.id === 'fieldBase' || schema.id === 'contentBase';
    
    if(!schema.type) {
        schema.type = schema.parentSchemaId === 'fieldBase' || schema.id === 'fieldBase' ? 'field' : 'content';
    }
}
