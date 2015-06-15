(function() {
  'use strict';

  angular.module('roboconf.instances')
  .filter('rbcfRootInstancesFilter', rbcfRootInstancesFilter);

  // Filter instances so that only roots go through.
  // Used in the 'new' template.
  function rbcfRootInstancesFilter() {
    return function(input) {

      var result = [];
      if (angular.isArray(input)) {
        result = input.filter(function(val, index, arr) {
          return !! val && !! val.path && val.path.split('/').length === 2;
        });
      }

      return result;
    };
  }
})();
