'use strict';

module.exports = (_, model, state) => [

_.field({label: 'API URL', description: 'The URL to read/write files from/to'},
    _.text({value: model.url, onchange: _.onChangeUrl})
),
_.field({label: 'API token', description: 'A unique token to send along with the API requests'},
    _.text({value: model.token, onchange: _.onChangeToken})
)

]
