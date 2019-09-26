'use strict';

module.exports = (_, model, state) =>

`(no field${model.schema.editorId ? ` "${model.schema.editorId}"` : ''} available for the "${model.schema.id}" schema)`
