(function() {
  'use strict';

  angular
  .module('roboconf.applications')
  .config(appConfig);

  appConfig.$inject = ['$routeProvider'];
  function appConfig($routeProvider) {
    $routeProvider

    .when('/', {
      templateUrl: 'templates/applications/html/_app-list.html',
      controller: 'ApplicationsListingController',
      tpl: false
    })

    .when('/applications', {
      templateUrl: 'templates/applications/html/_app-list.html',
      controller: 'ApplicationsListingController',
      tpl: false
    })

    .when('/applications/new', {
      templateUrl: 'templates/applications/html/_app-new.html',
      controller: 'ApplicationsNewController'
    })

    .when('/application-templates', {
      templateUrl: 'templates/applications/html/_tpl-list.html',
      controller: 'ApplicationsListingController',
      tpl: true
    })

    .when('/application-templates/new', {
      templateUrl: 'templates/applications/html/_tpl-upload.html',
      controller: 'ApplicationsUploadController'
    })

    .when('/app/:appName/overview', {
      templateUrl: 'templates/applications/html/_app-single.html',
      controller: 'SingleApplicationController'
    })

    .when('/app/:appName/delete', {
      templateUrl: 'templates/applications/html/_app-delete.html',
      controller: 'SingleApplicationController'
    })

    .when('/tpl/:tplName/:tplQualifier/overview', {
      templateUrl: 'templates/applications/html/_tpl-single.html',
      controller: 'SingleApplicationTemplateController'
    })

    .when('/tpl/:tplName/:tplQualifier/delete', {
      templateUrl: 'templates/applications/html/_tpl-delete.html',
      controller: 'SingleApplicationTemplateController'
    });
  }
})();
