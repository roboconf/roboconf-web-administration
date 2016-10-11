(function() {
  'use strict';

  angular
  .module('roboconf.scheduling')
  .controller('ScheduleUpdateController', scheduleUpdateController);

  scheduleUpdateController.$inject = ['$scope', 'rClient', '$routeParams', '$window'];
  function scheduleUpdateController($scope, rClient, $routeParams, $window) {

    // Fields
    $scope.responseStatus = -1;
    $scope.job = {};
    $scope.apps = [];
    $scope.cmdNames = [];
    $scope.errorMessage = null;

    $scope.cronEditorConfig = {
      allowMultiple: true,
      quartz: true
    };

    // Function declarations
    $scope.loadJob = loadJob;
    $scope.loadApplications = loadApplications;
    $scope.loadCommands = loadCommands;
    $scope.deleteJob = deleteJob;
    $scope.createOrUpdateJob = createOrUpdateJob;
    $scope.startEdit = startEdit;
    $scope.cancelEdit = cancelEdit;
    $scope.completeEdit = completeEdit;

    // Initial actions
    if ($routeParams.jobId) {
      loadJob($routeParams.jobId);

    } else {
      $scope.responseStatus = 0;
      if ($routeParams.appName) {
        $scope.job.app = {
          name: $routeParams.appName
        };

        loadCommands();
      }
    }

    loadApplications();
    

    // Functions
    function loadJob(jobId) {

      $scope.job.id = jobId;
      rClient.findScheduledJob(jobId).then(function(job) {
        $scope.responseStatus = 0;
        $scope.job.name = job['job-name'];
        $scope.job.app = {
          name: job['app-name']
        };

        loadCommands();
        $scope.job.cmdName = job['cmd-name'];
        $scope.job.cron = job.cron;

      }, function(response) {
        $scope.responseStatus = response.status;
      });
    }

    function loadApplications() {

      rClient.listApplications().then(function(apps) {
        $scope.apps = apps;

      }, function() {
        $scope.errorMessage = 'Applications could not be listed.';
      });
    }

    function deleteJob() {

      rClient.deleteScheduledJob($scope.job.id).then(function() {
        $window.location = '#/scheduler';
      });
    }

    function createOrUpdateJob() {

      // Post the value
      rClient.postScheduledJob(
          $scope.job.id,
          $scope.job.name,
          $scope.job.app.name,
          $scope.job.cmdName,
          $scope.job.cron).then(function(wrappedJobId) {

            $scope.errorMessage = null;
            $window.location = '#/scheduler/job/' + wrappedJobId.s;

      }, function(response) {

          $scope.errorMessage = 'An error occured.';
          if (response.data && response.data.reason) {
            $scope.errorMessage += ' ' + response.data.reason;
          } else {
            $scope.errorMessage += ' The CRON expression is most likely incorrect.';
          }
      });
    }

    function loadCommands() {

      rClient.listCommands($scope.job.app.name).then(function(cmdNames) {
        $scope.cmdNames = cmdNames;

      }, function() {
        $scope.errorMessage = 'Application commands could not be listed.';
      });
    }

    function startEdit() {
      $scope.editMode = true;
      $scope.jobBackup = angular.copy($scope.job);
    }

    function cancelEdit() {
      $scope.editMode = false;
      $scope.job = $scope.jobBackup;
    }

    function completeEdit() {
      $scope.editMode = false;
      $scope.jobBackup = null;
    }
  }
})();
