(function() {
  'use strict';

  angular
  .module('roboconf.applications')
  .directive('rbcfSingleApp', rbcfSingleApp)
  .directive('customOnChange', customOnChange);

  function rbcfSingleApp() {
    return {
      restrict: 'E',
      templateUrl: 'templates/applications/html/_app-directive.html'
    };
  }

  function customOnChange() {
    return {
      restrict: 'A',
      link: function(scope, element, attrs) {
        var onChangeHandler = scope.$eval(attrs.customOnChange);
        element.bind('change', onChangeHandler);
      }
    };
  }
})();
