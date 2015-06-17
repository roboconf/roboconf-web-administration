(function() {
  'use strict';

  angular
  .module('roboconf.instances')
  .directive('instance', instance);

  function instance() {
    return {
      restrict: 'A',
      require: 'ngModel',
      link: function(scope, elm, attrs, ctrl) {

        ctrl.$validators.instance = isInstanceNameUnique;
        function isInstanceNameUnique(modelValue, viewValue) {

          // scope.editedInstance is not always up to date.
          // The real instance name is 'modelValue'.
          var valid = true;
          var instance = {name: modelValue};
          if (scope.editedInstance) {
            instance.parent = scope.editedInstance.parent;
          }

          // If there is a parent, we can compare with sibling names.
          if (modelValue && instance.parent && instance.parent.children) {
            var obj = {};
            instance.parent.children.map(function(val, index, arr) {
              return val === scope.editedInstance ? instance : val;
            }).forEach(function(val, index, arr) {
              obj[val.name] = true;
            });

            // Names are unique if there are as many names as instances
            valid = Object.keys(obj).length === instance.parent.children.length;
          }

          return valid;
        }
      }
    };
  }
})();
