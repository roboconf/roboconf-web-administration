(function() {
  'use strict';

  angular
  .module('roboconf.targets')
  .config(appConfig);

  appConfig.$inject = ['$routeProvider'];
  function appConfig($routeProvider) {
    $routeProvider

    .when('/targets', {
      templateUrl: 'templates/targets/html/_targets-list.html',
      controller: 'TargetsListingController'
    })

    .when('/target/:targetId/overview', {
      templateUrl: 'templates/targets/html/ _target-overview.html',
      controller: 'TargetSingleController'
    })

    .when('/target/:targetId/properties', {
      templateUrl: 'templates/targets/html/_target-properties.html',
      controller: 'TargetEditingController'
    })

    .when('/target/:targetId/usage', {
      templateUrl: 'templates/targets/html/_target-usage.html',
      controller: 'TargetSingleController',
      usage: true
    })

    .when('/target/:targetId/delete', {
      templateUrl: 'templates/targets/html/_target-delete.html',
      controller: 'TargetSingleController',
      usage: true
    });
  }
})();
