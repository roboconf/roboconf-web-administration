(function() {
  'use strict';

  angular
  .module('roboconf.instances')
  .config(appConfig);

  appConfig.$inject = ['$routeProvider'];
  function appConfig($routeProvider) {

    $routeProvider
    .when('/app/:appName/instances', {
      templateUrl: 'templates/instances/_instances.html',
      controller: 'InstancesListingController'
    });
  }
})();
