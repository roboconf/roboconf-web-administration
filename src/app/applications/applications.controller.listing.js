(function() {
  'use strict';

  angular
  .module('roboconf.applications')
  .controller('ApplicationsListingController', applicationsListingController);

  applicationsListingController.$inject = ['$scope', 'rUtils', '$route', 'rClient'];
  function applicationsListingController($scope, rUtils, $route, rClient) {

    // Fields
    $scope.isTpl = $route.current.tpl;
    $scope.invoked = false;
    $scope.error = false;
    $scope.apps = [];
    $scope.searchFilter = '';
    $scope.searchVisible = true;

    // For the APP and TPL directives
    $scope.showLinks = true;

    // Functions declaration
    $scope.findAvatar = rUtils.findRandomAvatar;
    $scope.findIcon = rUtils.findIcon;
    $scope.deleteApplication = deleteApplication;

    // Initial actions
    listApplications();

    // Function definitions
    function listApplications() {

      var fct = $scope.isTpl ? rClient.listApplicationTemplates : rClient.listApplications;
      fct().then(function(applications) {
        $scope.apps = applications;
        $scope.error = false;

      }, function() {
        $scope.error = true;

      }).finally(function() {
        $scope.invoked = true;
      });
    }

    function deleteApplication(appOrTpl) {

      var promise = $scope.isTpl ?
        rClient.deleteApplicationTemplate(appOrTpl.name, appOrTpl.qualifier) :
        rClient.deleteApplication(appOrTpl.name);

      promise.then(function() {
        listApplications();

      }, function() {
        console.log('Application ' + appOrTpl.name + ' could not be deleted.');
      });
    }
  }
})();
