(function() {
  'use strict';

  angular
  .module('roboconf.menu')
  .directive('rbcfMenu', rbcfMenu);

  // The controller is used to determine whether the
  // "web extension" menu must appear or not.
  rbcfMenuController.$inject = ['$scope', 'rClient'];
  function rbcfMenuController($scope, rClient) {
    $scope.hasWebExtensions = false;
    rClient.getPreferences('web.extensions').then(function(prefs) {
      $scope.hasWebExtensions = prefs.length > 0 && !! prefs[0].value;
    });
  }

  function rbcfMenu() {
    return {
      restrict: 'E',
      templateUrl: 'templates/menu/_menu.html',
      controller: rbcfMenuController
    };
  }
})();
