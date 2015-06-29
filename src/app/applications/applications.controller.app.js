(function() {
  'use strict';

  angular
  .module('roboconf.applications')
  .controller('SingleApplicationController', singleApplicationController);

  singleApplicationController.$inject = ['rClient', '$scope', '$routeParams', '$window', 'rUtils'];
  function singleApplicationController(rClient, $scope, $routeParams, $window, rUtils) {

    // Fields
    $scope.invoked = false;
    $scope.error = false;
    $scope.showRestError = false;
    $scope.found = true;

    $scope.deleteApplication = deleteApplication;
    $scope.findAvatar = rUtils.findRandomAvatar;
    $scope.findIcon = rUtils.findIcon;

    // Initial actions
    findApplication($routeParams.appName);

    // Function definitions
    function findApplication(appName) {

      rClient.listApplications().then(function(applications) {
        $scope.error = false;
        $scope.app = applications.filter(function(val, index, arr) {
          return val.name === appName;
        }).pop();

        if (!$scope.app) {
          $scope.found = false;
          $scope.app = {
            name: $routeParams.appName
          };
        }

      }, function() {
        $scope.error = true;

      }).finally (function() {
        $scope.invoked = true;
      });
    }

    function deleteApplication() {
      rClient.deleteApplication($routeParams.appName).then(function() {
        $window.location = '#/';

      }, function() {
        $scope.showRestError = true;

      }).finally (function() {
        $scope.askToDelete = false;
      });
    }
  }
})();
