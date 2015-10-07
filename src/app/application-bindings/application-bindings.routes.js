(function() {
  'use strict';

  angular
  .module('roboconf.application-bindings')
  .config(appConfig);

  appConfig.$inject = ['$routeProvider'];
  function appConfig($routeProvider) {
    $routeProvider

    .when('/app/:appName/application-bindings', {
      templateUrl: 'templates/application-bindings/_bindings.html',
      controller: 'ApplicationBindingsController'
    });
  }
})();
