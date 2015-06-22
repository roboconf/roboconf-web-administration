(function() {
  'use strict';

  angular
  .module('roboconf.applications')
  .controller('SingleApplicationController', singleApplicationController);

  singleApplicationController.$inject = ['Restangular', '$scope', '$routeParams', '$window', 'rUtils'];
  function singleApplicationController(Restangular, $scope, $routeParams, $window, rUtils) {

    // Fields
    $scope.invoked = false;
    $scope.error = false;
    $scope.askToDelete = false;
    $scope.showRestError = false;

    $scope.deleteApplication = deleteApplication;
    $scope.findAvatar = rUtils.findRandomAvatar;
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

    function deleteApplication() {
      Restangular.one('applications/' + $routeParams.appName + '/delete').remove().then(function() {
        $window.location = '#/';
      }, function() {
        $scope.showRestError = true;
      }).finally (function() {
        $scope.askToDelete = false;
      });
    }
  }
})();
