'use strict';

module.exports = (_, model, state) =>

_.div({class: 'page--dashboard__user'},
    _.div({class: 'page--dashboard__user__body'},
        _.dropdown({
            icon: 'ellipsis-v',
            reverseKeys: true,
            options: HashBrown.Context.user.id === model.id ? {
                'Edit': _.onClickEdit
            } : {
                'Edit': _.onClickEdit,
                'Delete': _.onClickDelete,
            }
        }),
        _.h3({class: 'page--dashboard__user__name'},
            (model.fullName || model.username || model.email || model.id) + (model.id == HashBrown.Context.user.id ? ' (you)' : '')
        ),
        _.div({class: 'page--dashboard__user__type'},
            _.if(model.isAdmin,
                _.span({class: 'page--dashboard__user__type__icon fa fa-black-tie'}),
                'Admin'
            ),
            _.if(!model.isAdmin,
                _.span({class: 'page--dashboard__user__type__icon fa fa-user'}),
                'Editor'
            )
        )
    )
)
