(function() {
  'use strict';

  angular
  .module('roboconf.applications')
  .directive('rbcfIconManagement', rbcfIconManagement);

  function rbcfIconManagement() {
    return {
      restrict: 'A',
      link: function(scope, element, attrs) {
        var onChangeHandler = scope.$eval(attrs.rbcfIconManagement);
        element.bind('change', onChangeHandler);
      }
    };
  }
})();
