(function() {
  'use strict';

  angular
  .module('roboconf.scheduling')
  .controller('ScheduleListingController', scheduleListingController);

  scheduleListingController.$inject = ['$scope', 'rClient', '$routeParams', '$window'];
  function scheduleListingController($scope, rClient, $routeParams, $window) {

    // Fields
    $scope.responseStatus = -1;
    $scope.appName = $routeParams.appName;
    $scope.searchFilter = '';
    $scope.searchVisible = true;
    $scope.jobs = [];

    // Initial actions
    loadSchedules();

    // Functions
    function loadSchedules() {

      var p;
      if ($scope.appName) {
        p = rClient.listScheduledJobs($scope.appName);
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
