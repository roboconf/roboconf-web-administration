(function() {
  'use strict';

  angular.module('roboconf.instances')
  .filter('rbcfInstancesFilter', rbcfInstancesFilter);

  // Filter instances based on the search bar input.
  // Used in the 'listing' template.
  function rbcfInstancesFilter() {
    return function(input, text) {

      var result = [];
      var t = text.toLowerCase();
      if (angular.isArray(input)) {
        result = input.filter(function(val, index, arr) {
          return val.instance && val.instance.path &&
          val.instance.path.toLowerCase().indexOf(t) >= 0;
        });
      }

      return result;
    };
  }
})();
