(function() {
  'use strict';

  angular
  .module('roboconf.commands')
  .config(appConfig);

  appConfig.$inject = ['$routeProvider'];
  function appConfig($routeProvider) {

    $routeProvider
    .when('/app/:appName/commands', {
      templateUrl: 'templates/commands/_commands.html',
      controller: 'CommandsListingController'
    });
  }
})();
