(function() {
  var PreferLibraryOverNativePromises, allPromises, newPromise, ref, ref1, ref2;

  ref = require('../../helpers/promise-find-library'), newPromise = ref.newPromise, allPromises = ref.allPromises;

  if (!(newPromise && allPromises)) {
    ref1 = require('../../helpers/promise-find-native'), newPromise = ref1.newPromise, allPromises = ref1.allPromises;
  }

  if (!((typeof window !== "undefined" && window !== null) || newPromise)) {
    ref2 = require('../../helpers/promise-node'), newPromise = ref2.newPromise, allPromises = ref2.allPromises;
  }

  if ((typeof window !== "undefined" && window !== null) && !newPromise) {
    if (typeof console !== "undefined" && console !== null) {
      if (typeof console.warn === "function") {
        console.warn('Octokat: A Promise API was not found. Supported libraries that have Promises are jQuery, angularjs, and es6-promise');
      }
    }
  } else if ((typeof window === "undefined" || window === null) && !newPromise) {
    throw new Error('Could not find a promise lib for node. Seems like a bug');
  }

  module.exports = new (PreferLibraryOverNativePromises = (function() {
    function PreferLibraryOverNativePromises() {}

    PreferLibraryOverNativePromises.prototype.promiseCreator = {
      newPromise: newPromise,
      allPromises: allPromises
    };

    return PreferLibraryOverNativePromises;

  })());

}).call(this);
