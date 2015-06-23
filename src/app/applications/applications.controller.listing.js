(function() {
  'use strict';

  angular
  .module('roboconf.applications')
  .controller('ApplicationsListingController', applicationsListingController);

  applicationsListingController.$inject =
    ['Restangular', '$scope', 'rUtils', '$route', 'rAppTemplates'];

  function applicationsListingController(
      Restangular, $scope, rUtils, $route, rAppTemplates) {

    // Fields
    $scope.isTpl = $route.current.tpl;
    $scope.invoked = false;
    $scope.error = false;
    $scope.apps = [];
    $scope.searchFilter = '';
    $scope.searchVisible = true;
    $scope.selectedApp = null;

    // Functions declaration
    $scope.showApplication = showApplication;
    $scope.hideApplication = hideApplication;
    $scope.findAvatar = rUtils.findRandomAvatar;
    $scope.findIcon = rUtils.findIcon;

    // Initial actions
    if ($scope.isTpl) {
      listApplicationTemplates();
    } else {
      listApplications();
    }

    // Function definitions
    function showApplication(app, t) {
      $scope.selectedApp = app;
      rUtils.showRightBlock(t);
    }

    function hideApplication() {
      $scope.selectedApp = null;
      rUtils.hideRightBlock();
    }

    function listApplications() {
      Restangular.all('applications').getList().
      then(function(applications) {
        $scope.apps = applications;
        $scope.error = false;

      }, function() {
        $scope.error = true;
      }).
      finally (function() {
        $scope.invoked = true;
      });
    }

    function listApplicationTemplates() {
      rAppTemplates.refreshTemplates().then(function() {
        $scope.invoked = true;
        $scope.apps = rAppTemplates.getTemplates();
        $scope.error = rAppTemplates.gotErrors();
      });
    }
  }
})();
