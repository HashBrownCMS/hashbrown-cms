'use strict';

module.exports = (_, model, state) =>

model.schema ?
    `(no field${model.schema.editorId ? ` "${model.schema.editorId}"` : ''} available for the "${model.schema.id}" schema)`
:
    'The specified field could not be found'
