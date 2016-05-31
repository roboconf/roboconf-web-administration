(function() {
  'use strict';

  angular
  .module('roboconf.applications')
  .controller('SingleApplicationController', singleApplicationController);

  singleApplicationController.$inject = ['rClient', '$scope', '$routeParams', '$window', 'rUtils'];
  function singleApplicationController(rClient, $scope, $routeParams, $window, rUtils) {

    // Fields
    $scope.responseStatus = -1;

    $scope.deleteApplication = deleteApplication;
    $scope.findAvatar = rUtils.findRandomAvatar;
    $scope.findIcon = rUtils.findIcon;
    $scope.uploadIcon = uploadIcon;
    $scope.selectFile = selectFile;

    // Initial actions
    findApplication($routeParams.appName);

    // Function definitions
    function findApplication(appName) {

      rClient.listApplications().then(function(applications) {
        $scope.responseStatus = 0;
        $scope.app = applications.filter(function(val, index, arr) {
          return val.name === appName;
        }).pop();

        if (!$scope.app) {
          $scope.responseStatus = 404;
          $scope.app = {
            name: $routeParams.appName
          };
        }

      }, function(response) {
        $scope.responseStatus = response.status;
      });
    }

    function deleteApplication() {
      rClient.deleteApplication($routeParams.appName).then(function() {
          $window.location = '#/';
      });
    }

    function uploadIcon( appName ) {
      rClient.uploadIcon( appName ).then(function() {
    	  $window.location.reload(true);
      });  
    }

    function selectFile( appName ) {
      $("input[id='file-id']").click();
      setTimeout(function() {
    	  $scope.uploadIcon( appName )
      }, 3000);
    }

  }
})();
