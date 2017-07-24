(function() {
  'use strict';

  angular
  .module('roboconf.commands')
  .controller('CommandsListingController', commandsListingController);

  commandsListingController.$inject = ['$scope', 'rClient', 'rUtils', '$routeParams', '$timeout', '$translate'];
  function commandsListingController($scope, rClient, rUtils, $routeParams, $timeout, $translate) {

    // Fields
    $scope.responseStatus = -1;
    $scope.searchFilter = '';
    $scope.searchVisible = true;
    $scope.commands = [];
    $scope.status = [];

    // Function declarations
    $scope.loadCommands = loadCommands;
    $scope.execute = execute;
    $scope.removeStatus = rUtils.removeArrayItem;

    // Initial actions
    rClient.findApplication($routeParams.appName).then(function(app) {
      $scope.app = app;
      if (app.fake) {
        $scope.responseStatus = 404;
      } else {
        $scope.responseStatus = 0;
        loadCommands();
      }
    });

    // Functions
    function loadCommands() {

      rClient.listCommands($routeParams.appName).then(function(commands) {
        $scope.responseStatus = 0;
        $scope.commands = commands;

      }, function(response) {
        $scope.responseStatus = response.status;
      });
    }

    function execute(cmd) {

      rClient.executeCommand($routeParams.appName, cmd).then(function() {
        $translate('COMMANDS_EXECUTION_OK', {cmd: cmd}).then(function(translatedValue) {
          $scope.status.splice(0, 0, {
            msg: translatedValue,
            ok: true
          });
        });

      }, function(response) {
        $translate('COMMANDS_EXECUTION_KO', {cmd: cmd}).then(function(translatedValue) {
          $scope.status.splice(0, 0, {
            msg: translatedValue,
            ok: false
          });
        });

        // Keep it for debug
        console.log(response);
      });
    }
  }
})();
