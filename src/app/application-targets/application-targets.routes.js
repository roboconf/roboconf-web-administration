(function() {
  'use strict';

  angular
  .module('roboconf.application-targets')
  .config(appConfig);

  appConfig.$inject = ['$routeProvider'];
  function appConfig($routeProvider) {
    $routeProvider

    .when('/app/:appName/targets', {
      templateUrl: 'templates/application-targets/_associations.html',
      controller: 'ApplicationTargetsController'
    });
  }
})();
