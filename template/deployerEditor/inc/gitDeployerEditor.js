'use strict';

module.exports = (_, model, state) => [

_.field({label: 'Repository'},
    _.text({value: model.repo, placeholder: 'e.g. https://example.com/repo.git', onchange: _.onChangeRepo})
),
_.field({label: 'Branch'},
    _.text({value: model.branch, placeholder: 'e.g. master', onchange: _.onChangeBranch})
),
_.field({label: 'Username'},
    _.text({value: model.username, onchange: _.onChangeUsername})
),
_.field({label: 'Password'},
    _.text({value: model.password, type: 'password', onchange: _.onChangePassword})
)

]
