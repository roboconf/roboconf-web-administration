(function() {
  'use strict';

  angular
  .module('roboconf.applications')
  .controller('SingleApplicationController', singleApplicationController);

  singleApplicationController.$inject = ['Restangular', '$scope', '$routeParams'];
  function singleApplicationController(Restangular, $scope, $routeParams) {

    // Fields
    $scope.invoked = false;
    $scope.error = false;
    $scope.app = findApplication($routeParams.appName);

    // Function definitions
    function findApplication(appName) {

      Restangular.all('applications').getList().
      then(function(applications) {
        $scope.error = false;
        $scope.app = applications.filter(function(val, index, arr) {
          return val.name === appName;
        }).pop();

      }, function() {
        $scope.error = true;
      })

      .finally (function() {
        $scope.invoked = true;
      });
    }
  }
})();
