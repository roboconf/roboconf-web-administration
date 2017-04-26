(function() {
  'use strict';

  angular
  .module('roboconf.login')
  .config(appConfig);

  appConfig.$inject = ['$routeProvider'];
  function appConfig($routeProvider) {

    $routeProvider
    .when('/login', {
      templateUrl: 'templates/login/_login.html',
      controller: 'LoginController'
    });
  }
})();
