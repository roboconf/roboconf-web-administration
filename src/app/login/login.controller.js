(function() {
  'use strict';

  angular
  .module('roboconf.login')
  .controller('LoginController', loginController);

  loginController.$inject = ['$scope', 'rClient', '$location'];
  function loginController($scope, rClient, $location) {

    // Fields
    $scope.responseStatus = -1;

    // Function declarations
    $scope.login = login;

    // Functions
    function login(username, password) {
      rClient.login(username, password).then(function(response) {
        $scope.responseStatus = 0;
        var path = $location.search().redirect;
        $location.url(decodeURIComponent(path));

      }, function(response) {
        $scope.responseStatus = response.status;
      });
    }
  }
})();
