(function() {
  'use strict';

  angular
  .module('roboconf.commands')
  .config(appConfig);

  appConfig.$inject = ['$routeProvider'];
  function appConfig($routeProvider) {

    $routeProvider
    .when('/app/:appName/commands', {
      templateUrl: 'templates/commands/html/_commands.html',
      controller: 'CommandsListingController'
    })

    .when('/app/:appName/commands/history/:pageNumber?', {
      templateUrl: 'templates/commands/html/_history_app.html',
      controller: 'CommandsHistoryController',
      showAppName: false
    })

    .when('/history/commands/:pageNumber?', {
      templateUrl: 'templates/commands/html/_history.html',
      controller: 'CommandsHistoryController',
      showAppName: true
    });
  }
})();
