(function() {
  'use strict';

  angular
  .module('roboconf.web-extensions')
  .config(appConfig);

  appConfig.$inject = ['$routeProvider'];
  function appConfig($routeProvider) {
    $routeProvider

    .when('/web-extensions', {
      templateUrl: 'templates/web-extensions/_extensions.html',
      controller: 'WebExtensionsListingController'
    })

    .when('/web-extensions/:ext', {
      templateUrl: 'templates/web-extensions/_extensions.html',
      controller: 'WebExtensionsListingController'
    });
  }
})();
