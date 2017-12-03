'use strict';

const Exec = require('child_process').exec;
const Yaml = require('yamljs');
const FileSystem = require('fs');

Exec('jsdoc ../src/ -X -r > output.json', (err, stdout, stderr) => {
    if(err) { throw err; }

    let json = require('./output.json');

    FileSystem.unlinkSync('./output.json');

    // Create namespaces
    let namespaces = {};

    for(let entry of json) {
        if(entry.undocumented || entry.kind !== 'namespace') { continue; }

        if(!namespaces[entry.longname]) {
            namespaces[entry.longname] = entry;
        }
    }

    // Create classes
    let classes = {};
    
    for(let entry of json) {
        if(entry.undocumented || entry.kind !== 'class') { continue; }

        if(!namespaces[entry.memberof]) {
            throw new Error(entry.longname + ' does not belong to a registered namespace');
        }

        entry.methods = [];

        classes[entry.longname] = entry;
    }
    
    // Create methods
    for(let entry of json) {
        if(!entry.memberof || entry.undocumented || entry.kind !== 'function') { continue; }

        if(!classes[entry.memberof]) {
            continue;
        }
        
        classes[entry.memberof].methods.push(entry);
    }

    // Write namespaces
    for(let name in namespaces) {
        let namespace = namespaces[name];

        namespace.shortname = namespace.name;
        namespace.layout = 'docPage';
        namespace.permalink = '/docs/' + namespace.longname.toLowerCase().replace(/\./g, '/') + '/';
        namespace.title = 'API: ' + namespace.name;
        namespace.description = namespace.description || namespace.longname;

        let yaml = Yaml.stringify(namespace, 20);

        yaml = '---\n' + yaml + '\n---';

        FileSystem.writeFile('../../hashbrown.rocks/docs/' + namespace.longname.toLowerCase() + '.md', yaml, 'utf8', (err) => {
            if(err) { throw err; }
        });
    }
    
    // Write classes
    for(let name in classes) {
        let entry = classes[name];

        entry.shortname = entry.name;
        entry.layout = 'docPage';
        entry.permalink = '/docs/' + entry.longname.toLowerCase().replace(/\./g, '/') + '/';
        entry.title = 'API: ' + entry.name;
        entry.description = entry.classdesc || entry.longname;

        let yaml = Yaml.stringify(entry, 20);

        yaml = '---\n' + yaml + '\n---';

        FileSystem.writeFile('../../hashbrown.rocks/docs/' + entry.longname.toLowerCase() + '.md', yaml, 'utf8', (err) => {
            if(err) { throw err; }
        });
    }
});
