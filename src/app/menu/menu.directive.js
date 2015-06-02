(function() {
  'use strict';

  angular
  .module('roboconf.menu')
  .directive('rbcfMenu', rbcfMenu);

  function rbcfMenu() {
    return {
      restrict: 'E',
      templateUrl: 'templates/menu/_menu.html'
    };
  }
})();
