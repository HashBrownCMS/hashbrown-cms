'use strict';

const Glob = require('glob');
const FileSystem = require('fs');

Glob('./src/**/*.js', (err, files) => {
    if(err) { throw err; }
    
    for(let file of files) {
        let content = FileSystem.readFileSync(file);

        content = content.toString('utf8');

        content = content.replace(/\w+\([a-zA-Z0-9=\s\n',(){}]+\) {/g, (func) => {
            if(!func || func.indexOf('requiredParam') < 0) { return func; }
        
            let paramNames = [];
            let requiredParamNames = [];
            let funcName = func.match(/[^(]+/)[0];
            
            let params = func.substring(func.indexOf('(') + 1, func.lastIndexOf(')')).split(',');
          
            if(!params) { return func; }

            for(let param of params) {
                param = param.replace(/\s/g, '');

                if(!param) { continue; }

                let name = param.match(/([^=]+)/)[1];
                let isRequired = param.indexOf('requiredParam') > -1;

                if(isRequired) {
                    requiredParamNames.push(name);
                } else {
                    let defaultParamIndex = param.lastIndexOf('='); 

                    if(defaultParamIndex > -1) {
                        name += ' = ' + param.substring(defaultParamIndex + 1);
                    }
                }
                
                paramNames.push(name);
            }
                
            let newFunc = funcName + '(' + paramNames.join(', ') + ') {\n';

            for(let name of requiredParamNames) {
                newFunc += '        // checkParam(' + name + ', \'' + name + '\', Type);\n';
            }

            return newFunc;
        });

        FileSystem.writeFileSync(file, content, 'utf8');
    }
});
