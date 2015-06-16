(function() {
  'use strict';

  angular
  .module('roboconf.applications')
  .config(appConfig);

  appConfig.$inject = ['$routeProvider'];
  function appConfig($routeProvider) {
    $routeProvider

    .when('/', {
      templateUrl: 'templates/applications/_list.html',
      controller: 'ApplicationsListingController',
      tpl: false
    })

    .when('/applications', {
      templateUrl: 'templates/applications/_list.html',
      controller: 'ApplicationsListingController',
      tpl: false
    })

    .when('/applications/new', {
      templateUrl: 'templates/applications/_new.html',
      controller: 'ApplicationsNewController'
    })

    .when('/application-templates', {
      templateUrl: 'templates/applications/_list.html',
      controller: 'ApplicationsListingController',
      tpl: true
    })

    .when('/application-templates/new', {
      templateUrl: 'templates/applications/_upload.html',
      controller: 'ApplicationsUploadController'
    })

    .when('/app/:appName/details', {
      templateUrl: 'templates/applications/_single-app.html',
      controller: 'SingleApplicationController'
    })

    .when('/tpl/:tplName/:tplQualifier/details', {
      templateUrl: 'templates/applications/_single-app-tpl.html',
      controller: 'SingleApplicationTemplateController'
    });
  }
})();