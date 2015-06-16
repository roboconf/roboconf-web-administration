(function() {
  'use strict';

  angular
  .module('roboconf.instances')
  .directive('rbcfDeleteInstance', rbcfDeleteInstance);

  function rbcfDeleteInstance() {
    return {
      restrict: 'E',
      templateUrl: 'templates/instances/_delete.html'
    };
  }
})();
