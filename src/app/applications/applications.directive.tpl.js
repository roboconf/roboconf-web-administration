(function() {
  'use strict';

  angular
  .module('roboconf.applications')
  .directive('rbcfSingleTpl', rbcfSingleTpl);

  function rbcfSingleTpl() {
    return {
      restrict: 'E',
      templateUrl: 'templates/applications/html/_tpl-directive.html'
    };
  }
})();
