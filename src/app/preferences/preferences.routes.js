(function() {
  'use strict';

  angular
  .module('roboconf.applications')
  .config(appConfig);

  appConfig.$inject = ['$routeProvider'];
  function appConfig($routeProvider) {

    $routeProvider
    .when('/preferences', {
      templateUrl: 'templates/preferences/_preferences.html',
      controller: 'PreferencesController'
    });
  }
})();
