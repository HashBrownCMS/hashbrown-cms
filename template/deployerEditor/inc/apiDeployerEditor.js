'use strict';

module.exports = (_, model, state) => [

_.field({label: 'Base URL'},
    _.text({value: model.url, onchange: _.onChangeUrl})
),
_.field({label: 'API Token'},
    _.text({value: model.token, onchange: _.onChangeToken})
)

]
