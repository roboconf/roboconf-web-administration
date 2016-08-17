(function() {
  'use strict';

  angular
  .module('roboconf.preferences')
  .config(appConfig);

  appConfig.$inject = ['$routeProvider'];
  function appConfig($routeProvider) {

    $routeProvider
    .when('/preferences', {
      templateUrl: 'templates/preferences/_preferences.html',
      controller: 'PreferencesController'
    })

    .when('/preferences/language', {
      templateUrl: 'templates/preferences/_preferences-language.html',
      controller: 'PreferencesController'
    });
  }
})();
