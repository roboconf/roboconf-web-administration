(function() {
  'use strict';

  angular
  .module('roboconf.scheduling')
  .config(appConfig);

  appConfig.$inject = ['$routeProvider'];
  function appConfig($routeProvider) {

    $routeProvider
    .when('/scheduler', {
      templateUrl: 'templates/scheduling/_html/_list.html',
      controller: 'ScheduleListingController'
    })

    .when('/scheduler/new', {
      templateUrl: 'templates/scheduling/_html/_new.html',
      controller: 'ScheduleUpdateController'
    })

    .when('/scheduler/new/:appName', {
      templateUrl: 'templates/scheduling/_html/_new.html',
      controller: 'ScheduleUpdateController'
    })

    .when('/scheduler/job/:jobId', {
      templateUrl: 'templates/scheduling/_html/_update.html',
      controller: 'ScheduleUpdateController'
    })

    .when('/scheduler/job/:jobId/delete', {
      templateUrl: 'templates/scheduling/_html/_delete.html',
      controller: 'ScheduleUpdateController'
    })

    .when('/app/:appName/jobs', {
      templateUrl: 'templates/scheduling/_html/_list_for_app.html',
      controller: 'ScheduleListingController'
    });
  }
})();
