(function() {
  'use strict';

  angular
  .module('roboconf.applications')
  .directive('rbcfSingleApp', rbcfSingleApp);

  function rbcfSingleApp() {
    return {
      restrict: 'E',
      templateUrl: 'templates/applications/html/_app-directive.html'
    };
  }

})();
