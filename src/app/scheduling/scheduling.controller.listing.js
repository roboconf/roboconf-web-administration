(function() {
  'use strict';

  angular
  .module('roboconf.scheduling')
  .controller('ScheduleListingController', scheduleListingController);

  scheduleListingController.$inject = ['$scope', 'rClient', '$routeParams', '$window'];
  function scheduleListingController($scope, rClient, $routeParams, $window) {

    // Fields
    $scope.responseStatus = -1;
    $scope.searchFilter = '';
    $scope.searchVisible = true;
    $scope.jobs = [];

    // Initial actions
    if (! $routeParams.appName) {
      loadSchedules();

    } else {
      rClient.findApplication($routeParams.appName).then(function(app) {
        $scope.app = app;
        if (app.fake) {
          $scope.responseStatus = 404;
        } else {
          $scope.responseStatus = 0;
          loadSchedules();
        }
      });
    }

    // Functions
    function loadSchedules() {

      var p;
      if ($routeParams.appName) {
        p = rClient.listScheduledJobs($routeParams.appName);
      } else {
        p = rClient.listScheduledJobs();
      }

      p.then(function(jobs) {
        $scope.responseStatus = 0;
        $scope.jobs = jobs;

      }, function(response) {
        $scope.responseStatus = response.status;
      });
    }
  }
})();
