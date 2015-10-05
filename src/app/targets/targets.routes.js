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

    .when('/target/:targetId', {
      templateUrl: 'templates/targets/html/_target.html',
      controller: 'TargetEditingController'
    });
  }
})();
