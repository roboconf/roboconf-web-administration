(function() {
  'use strict';

  angular
  .module('roboconf.utils')
  .service('rClient', rClient);

  rClient.$inject = ['Restangular'];
  function rClient(Restangular) {

    // Fields
    var service = {
      listApplications: listApplications,
      listApplicationTemplates: listApplicationTemplates,
      deleteApplication: deleteApplication,
      deleteApplicationTemplate: deleteApplicationTemplate,
      newApplication: newApplication
    };

    return service;

    // Functions
    function listApplications() {
      return Restangular.all('applications').getList();
    }

    function listApplicationTemplates() {
      return Restangular.all('applications/templates').getList();
    }

    function deleteApplication(appName) {
      return Restangular.one('applications/' + appName).remove();
    }

    function deleteApplicationTemplate(tplName, tplQualifier) {
      return Restangular.one('applications/templates/' + tplName + '/' + tplQualifier).remove();
    }

    function newApplication(newApp) {
      return Restangular.one('applications').post('', newApp);
    }
  }
}());
