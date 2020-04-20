'use strict';

// Initialise schemas
let schemas = {
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

    'contentBase': require('schema/content/contentBase.json'),
    'page': require('schema/content/page.json')
};

for(let id in schemas) {
    let schema = schemas[id];

    schema.id = id;
    schema.isLocked = true;
    
    schema.type = schema.parentId === 'fieldBase' || schema.id === 'fieldBase' ? 'field' : 'content';
}
    
// Override API calls
HashBrown.Service.RequestService.customRequest = async (method, url, data, headers) => {
    if(url === '/api/server/update/check') { return; }
    if(url.indexOf('heartbeat') > -1) { return; }

    method = method.toUpperCase();

    let query = new URLSearchParams(url.split('?')[1]);
    let path = url.split('?')[0].split('/').filter(Boolean);

    // Users
    if(path[1] === 'users') {
        let id = path[2];

        switch(method) {
            case 'GET': 
                if(id) {
                    return HashBrown.Client.context.user.getObject();
                }

                return [ HashBrown.Client.context.user.getObject() ];

            case 'POST':
                throw new Error('User settings cannot be changed in the demo');
        }
    
    // Projects
    } else if(path[1] === 'projects') {
        let id = path[2];

        switch(method) {
            case 'GET': 
                if(id) {
                    return HashBrown.Client.context.project.getObject();
                }

                return [ HashBrown.Client.context.project.getObject() ];

            case 'POST':
                throw new Error('Project settings cannot be changed in the demo');
        }
    
    // Resources
    } else if(path.length > 3) {
        let library = path[3];
        let id = path[4];
        
        switch(method) {
            case 'GET':
                if(id) {
                    let item = null;

                    if(library === 'schemas') {
                        if(id === 'icons') {
                            let schemas = await HashBrown.Entity.Resource.SchemaBase.list();
                            let icons = {};

                            for(let schema of schemas) {
                                icons[schema.id] = schema.icon || 'cogs';
                            }

                            return icons;
                        }

                        if(schemas[id]) {
                            item = JSON.parse(JSON.stringify(schemas[id]));
                        }
                    }
                    
                    if(!item) {
                        item = JSON.parse(localStorage.getItem(`${library}/${id}`));
                    }

                    if(library === 'schemas' && query.get('withParentFields') && item && item.parentId) {
                        let parent = await HashBrown.Entity.Resource.SchemaBase.get(item.parentId, { withParentFields: true });

                        if(parent) {
                            item = HashBrown.Entity.Resource.SchemaBase.merge(HashBrown.Entity.Resource.SchemaBase.new(item), parent);
                        }
                    }

                    return item;
                }

                let items = [];

                if(library === 'schemas') {
                    for(let item of Object.values(schemas)) {
                        if(query.get('type') && item.type !== query.get('type')) { continue; }

                        item = JSON.parse(JSON.stringify(item));

                        items.push(item);
                    }
                }

                for(let key of Object.keys(localStorage)) {
                    if(key.indexOf(library) !== 0) { continue; }

                    let item = JSON.parse(localStorage.getItem(key));

                    items.push(item);
                }

                return items;

            case 'POST':
                if(id === 'new') {
                    let model = HashBrown.Service.LibraryService.getClass(library, HashBrown.Entity.Resource.ResourceBase);
                    
                    id = model.createId();
                    data.id = id;

                    if(library === 'schemas') {
                        let schema = await HashBrown.Entity.Resource.SchemaBase.get(data.parentId);

                        data.type = schema.type;
                        data.customIcon = schema.customIcon;
                    }
                }

                localStorage.setItem(`${library}/${id}`, JSON.stringify(data));
                return data;
                
            case 'DELETE':
                localStorage.removeItem(`${library}/${id}`);
                return 'OK';
        }
    }

    throw new Error(`The API endpoint ${url} cannot be used in this demo`);
};
