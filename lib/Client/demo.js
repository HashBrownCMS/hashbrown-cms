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
        schemaId: 'demoPage',
        sort: 10000,
        properties: {
            url: '/my-example-page/',
            title: 'My Example Page'
        }
    }
};

const SCHEMAS = {
    // Field
    'array': require('../Common/Schema/Field/array.json'),
    'boolean': require('../Common/Schema/Field/boolean.json'),
    'contentReference': require('../Common/Schema/Field/contentReference.json'),
    'contentSchemaReference': require('../Common/Schema/Field/contentSchemaReference.json'),
    'date': require('../Common/Schema/Field/date.json'),
    'dropdown': require('../Common/Schema/Field/dropdown.json'),
    'fieldBase': require('../Common/Schema/Field/fieldBase.json'),
    'language': require('../Common/Schema/Field/language.json'),
    'mediaReference': require('../Common/Schema/Field/mediaReference.json'),
    'number': require('../Common/Schema/Field/number.json'),
    'resourceReference': require('../Common/Schema/Field/resourceReference.json'),
    'richText': require('../Common/Schema/Field/richText.json'),
    'string': require('../Common/Schema/Field/string.json'),
    'struct': require('../Common/Schema/Field/struct.json'),
    'tags': require('../Common/Schema/Field/tags.json'),
    'url': require('../Common/Schema/Field/url.json'),
    
    // Content
    'contentBase': require('../Common/Schema/Content/contentBase.json'),
    'page': require('../Common/Schema/Content/page.json'),
    'demoPage': {
        id: 'demoPage',
        icon: 'file',
        type: 'content',
        defaultTabId: 'content',
        allowedChildSchemas: [ 'demoPage' ],
        name: 'Demo Page',
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
                        maxItems: 2,
                        allowedSchemas: [ 'string', 'richText' ]
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
                        allowedSchemas: [ 'demoPage' ]
                    }
                },
                contentSchemaReference: {
                    tabId: 'content',
                    schemaId: 'contentSchemaReference',
                    label: 'Content Schema Reference',
                    description: 'A reference to a Content Schema',
                    config: {
                        allowedSchemas: [ 'demoPage' ]
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
                    schemaId: 'struct',
                    label: 'Struct',
                    description: 'A combination of fields',
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

HashBrown.Service.RequestService.customRequest = async (method, url, data, headers) => {
    const query = url.split('?')[1];
    const path = url.split('?')[0].split('/');
    const category = path[4];
    const id = path[5];

    await new Promise((resolve) => { setTimeout(resolve, 100); });

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
                    let schemaId = getQueryParam('schemaId', query);
                    let content = HashBrown.Entity.Resource.Content.create(schemaId);

                    content.parentId = getQueryParam('parentId', query);

                    CONTENT[content.id] = content.getObject();

                    return content;
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
                let schemas = [];

                for(let id in SCHEMAS) {
                    let schema = SCHEMAS[id];
                  
                    schema.id = id;
                    schema.isLocked = id !== 'demoPage';
                    schema.type = id === 'contentBase' || id === 'page' || id === 'demoPage' ? 'content' : 'field';
               
                    schemas.push(schema);
                }

                return schemas;
    
            } else {
                if(id === 'new') {
                    let parentSchemaId = getQueryParam('parentSchemaId', query);
                    let parentSchema = await HashBrown.Service.SchemaService.getSchemaById(parentSchemaId);
                    let schema = HashBrown.Entity.Resource.Schema.SchemaBase.create(parentSchema);

                    SCHEMAS[schema.id] = schema;

                    return schema;
                }

                if(method === 'post') {
                    SCHEMAS[id] = data;
                    return data;
                }

                if(SCHEMAS[id]) {
                    let schema = SCHEMAS[id];

                    schema.type = id === 'contentBase' || id === 'page' || id === 'demoPage' ? 'content' : 'field';
                    
                    return SCHEMAS[id];

                } else {
                    throw new Error('Custom schemas should not be requested in demo mode. Id requested was "' + id + '"');
                
                }
            }
        
        case 'users':
            if(!id) {
                return [HashBrown.Context.user];

            } else if(id === 'demoUser') {
                return HashBrown.Context.user;

            }

            throw new Error('Custom users not allowed in demo');

        case 'settings':
            return HashBrown.Context.projectSettings;
    }

    throw new Error('Unknown resource category "' + category + '"');
};
