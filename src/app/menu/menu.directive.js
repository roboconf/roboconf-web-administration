(function() {
  'use strict';

  angular
  .module('roboconf.menu')
  .directive('rbcfMenu', rbcfMenu);

  // The controller is used to determine whether the
  // "web extension" menu must appear or not.
  rbcfMenuController.$inject = ['$scope', 'rClient', '$cookies', 'COOKIE_NAME', '$window'];
  function rbcfMenuController($scope, rClient, $cookies, COOKIE_NAME, $window) {

    // We are authenticated if we have the right cookie.
    $scope.authenticated = !! $cookies.get(COOKIE_NAME);

    // Check web extensions.
    $scope.hasWebExtensions = false;
    rClient.getPreferences('web.extensions').then(function(prefs) {
      $scope.hasWebExtensions = prefs.length > 0 && !! prefs[0].value;
    });

    // Function declarations
    $scope.logout = logout;

    // Functions
    function logout() {
      rClient.logout().then(function() {
        $cookies.remove(COOKIE_NAME);
        $window.location.reload();
      });
    }
  }

  function rbcfMenu() {
    return {
      restrict: 'E',
      templateUrl: 'templates/menu/_menu.html',
      controller: rbcfMenuController
    };
  }
})();
