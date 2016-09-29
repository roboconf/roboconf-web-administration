(function() {
  'use strict';

  angular
  .module('roboconf.commands')
  .controller('CommandsListingController', instancesListingController);

  instancesListingController.$inject = ['$scope', 'rClient', 'rUtils', '$routeParams', '$timeout'];
  function instancesListingController($scope, rClient, rUtils, $routeParams, $timeout) {

    // Fields
    $scope.responseStatus = -1;
    $scope.appName = $routeParams.appName;
    $scope.searchFilter = '';
    $scope.searchVisible = true;
    $scope.commands = [];
    $scope.status = [];

    // Function declarations
    $scope.loadCommands = loadCommands;
    $scope.execute = execute;
    $scope.removeStatus = rUtils.removeArrayItem;

    // Initial actions
    loadCommands();

    // Functions
    function loadCommands() {

      rClient.listCommands($scope.appName).then(function(commands) {
        $scope.responseStatus = 0;
        $scope.commands = commands;

      }, function(response) {
        $scope.responseStatus = response.status;
      });
    }

    function execute(cmd) {

      rClient.executeCommand($scope.appName, cmd).then(function() {
        $scope.status.splice(0, 0, {
          msg: 'Command \'' + cmd + '\' was successfully launched.',
          ok: true
        });

      }, function(response) {
        $scope.status.splice(0, 0, {
          msg: 'Command \'' + cmd + '\' could not be launched. An error occurred.',
          ok: false
        });

        // Keep it for debug
        console.log(response);
      });
    }
  }
})();
