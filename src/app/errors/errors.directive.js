(function() {
  'use strict';

  angular
  .module('roboconf.errors')
  .directive('rbcfErrorMessage', rbcfErrorMessage);

  function rbcfErrorMessage() {
    return {
      restrict: 'E',
      templateUrl: 'templates/errors/_error-message.html'
    };
  }
})();
