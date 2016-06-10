(function() {
  'use strict';

  angular
  .module('roboconf.applications')
  .directive('rbcfSingleApp', rbcfSingleApp)
  .directive('rbcfIconManagement', rbcfIconManagement);

  function rbcfSingleApp() {
    return {
      restrict: 'E',
      templateUrl: 'templates/applications/html/_app-directive.html'
    };
  }

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
