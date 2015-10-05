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
      newApplication: newApplication,
      listTargets: listTargets,
      findTarget: findTarget,
      findTargetProperties: findTargetProperties
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

    function listTargets() {
      return Restangular.all('targets').getList();
    }
    
    function findTarget(id) {
      return Restangular.one('targets/' + id + '/details').get();
    }

    function findTargetProperties(id) {
      return Restangular.one('targets/' + id).get();
    }

    function findTargetUsage(id) {
      return Restangular.all('targets/' + id + '/usage').getList();
    }
  }
}());
