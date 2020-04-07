'use strict';

module.exports = (_, model, state) =>

_.field({label: 'Root path', description: 'A path to a directory on this machine'},
    _.text({value: model.rootPath, onchange: _.onChangeRootPath})
)
