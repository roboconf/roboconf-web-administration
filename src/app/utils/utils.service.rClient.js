(function() {
  'use strict';

  angular
  .module('roboconf.utils')
  .service('rClient', rClient);

  rClient.$inject = ['Restangular', '$http'];
  function rClient(Restangular, $http) {

    // Fields
    var service = {

      listApplications: listApplications,
      listApplicationTemplates: listApplicationTemplates,
      deleteApplication: deleteApplication,
      deleteApplicationTemplate: deleteApplicationTemplate,
      newApplication: newApplication,

      findApplication: findApplication,
      login: login,
      logout: logout,

      uploadIcon: uploadIcon,
      savePreferences: savePreferences,
      getPreferences: getPreferences,

      listTargets: listTargets,
      findTarget: findTarget,
      findTargetProperties: findTargetProperties,
      findTargetUsage: findTargetUsage,
      deleteTarget: deleteTarget,
      newTarget: newTarget,
      updateTarget: updateTarget,

      listApplicationBindings: listApplicationBindings,
      updateApplicationBindings: updateApplicationBindings,

      findTargetAssociations: findTargetAssociations,
      associateTarget: associateTarget,
      dissociateTarget: dissociateTarget,
      findPossibleTargets: findPossibleTargets,

      listInstances: listInstances,
      deleteInstance: deleteInstance,
      changeInstanceState: changeInstanceState,
      performActionOnInstance: performActionOnInstance,
      postNewInstance: postNewInstance,
      listChildrenComponents: listChildrenComponents,

      listCommands: listCommands,
      executeCommand: executeCommand,
      loadCommandsHistory: loadCommandsHistory,
      getCommandsHistoryPageCount: getCommandsHistoryPageCount,

      listScheduledJobs: listScheduledJobs,
      postScheduledJob: postScheduledJob,
      deleteScheduledJob: deleteScheduledJob,
      findScheduledJob: findScheduledJob
    };

    return service;

    // Functions
    function listApplications() {
      return Restangular.all('applications').getList();
    }

    function findApplication(appName) {
      return Restangular.all('applications?name=' + appName).getList().then(function(apps) {
        if (apps && apps.length > 0) {
          return apps[0];
        }

        var app = {
          name: appName,
          displayName: appName,
          fake: true
        };

        return app;
      });
    }

    function listApplicationTemplates() {
      return Restangular.all('applications/templates').getList();
    }

    function deleteApplication(appName) {
      return Restangular.one('applications/' + appName).remove();
    }

    function deleteApplicationTemplate(tplName, tplVersion) {
      return Restangular.one('applications/templates/' + tplName + '/' + tplVersion).remove();
    }

    function newApplication(newApp) {
      return Restangular.one('applications').post('', newApp);
    }

    function uploadIcon(appName, formData) {
        return Restangular.one('applications/image?name=' + appName)
              .withHttpConfig({transformRequest: angular.identity})
              .customPOST(formData, '', undefined, {'Mime-Type': 'multipart/form-data', 'Content-Type': undefined});
    }

    function savePreferences(key, value) {
        return Restangular.one('/preferences?key=' + key + '&value=' + value).post();
    }

    function getPreferences(key) {

        var path = 'preferences';
        if (key) {
          path += '?key=' + key;
        }

        return Restangular.one(path).getList();
    }

    function listTargets() {
      return Restangular.all('targets').getList();
    }

    function newTarget(targetContent) {
      return Restangular.one('targets').post('', targetContent);
    }

    function updateTarget(targetId, targetContent) {
      return Restangular.one('targets?target-id=' + targetId).post('', targetContent);
    }

    function findTarget(id) {
      return Restangular.one('targets/' + id + '/details').get();
    }

    function deleteTarget(id) {
      return Restangular.one('targets/' + id).remove();
    }

    function findTargetProperties(id) {
      return Restangular.one('targets/' + id).get();
    }

    function findTargetUsage(id) {
      return Restangular.all('targets/' + id + '/usage').getList();
    }

    function listApplicationBindings(appName) {
      return Restangular.one('app/' + appName + '/bind').get();
    }

    function updateApplicationBindings(appName, bTplName, bAppNames) {

      var path = 'app/' + appName + '/bind-x?bound-tpl=' + bTplName;
      bAppNames.forEach(function(val, index, arr) {
        path += '&app=' + val;
      });

      return Restangular.one(path).post();
    }

    function findTargetAssociations(appName) {
      return Restangular.all('app/' + appName + '/targets').getList();
    }

    function findPossibleTargets(appName) {
      return Restangular.all('targets?name=' + appName).getList();
    }

    function associateTarget(appName, targetId, instPath) {
      var path = 'targets/' + targetId + '/associations?bind=true&name=' + appName;
      if (instPath) {
        path += '&elt=' + instPath;
      }

      return Restangular.one(path).post();
    }

    function dissociateTarget(appName, targetId, instPath) {
      var path = 'targets/' + targetId + '/associations?bind=false&name=' + appName + '&elt=' + instPath;
      return Restangular.one(path).post();
    }

    function listCommands(appName) {
      var path = 'app/' + appName + '/commands';
      return Restangular.all(path).getList();
    }

    function postScheduledJob(jobId, jobName, appName, cmdName, cron) {

      var path = 'scheduler?job-name=';
      path += jobName;
      path += '&app-name=';
      path += appName;
      path += '&cmd-name=';
      path += cmdName;
      path += '&cron=';
      path += cron;

      if (jobId) {
        path += '&job-id=' + jobId;
      }

      return Restangular.one(path).post();
    }

    function listScheduledJobs(appName, cmdName) {
      var path = 'scheduler';
      return Restangular.all(path).getList();
    }

    function deleteScheduledJob(jobId) {
      var path = 'scheduler/' + jobId;
      return Restangular.one(path).remove();
    }

    function findScheduledJob(jobId) {
      var path = 'scheduler/' + jobId;
      return Restangular.one(path).get();
    }

    function executeCommand(appName, cmdName) {
      var path = 'app/' + appName + '/commands/execute?command-name=' + cmdName;
      return Restangular.one(path).post();
    }

    function loadCommandsHistory(pageNumber, itemsPerPage, sortingCriteria, sortingOrder, appName) {

      var path = 'history/commands?page=' + pageNumber + '&itemsPerPage=' + itemsPerPage;
      path += '&sortingCriteria=' + sortingCriteria;
      path += '&sortingOrder=' + sortingOrder;
      if (appName) {
        path += '&name=' + appName;
      }

      return Restangular.all(path).getList();
    }

    function getCommandsHistoryPageCount(itemsPerPage, appName) {
      var path = 'history/size/commands?itemsPerPage=' + itemsPerPage;
      if (appName) {
        path += '&name=' + appName;
      }

      return Restangular.one(path).get();
    }

    function listInstances(appName) {
      return Restangular.all('app/' + appName + '/instances?all-children=true').getList();
    }

    function deleteInstance(appName, instancePath) {
      var path = 'app/' + appName + '/instances?instance-path=' + instancePath;
      return Restangular.one(path).remove();
    }

    function changeInstanceState(appName, instancePath, newState) {
      var path = 'app/' + appName + '/change-state?new-state=' +
      newState + '&instance-path=' + instancePath;

      return Restangular.one(path).post();
    }

    function performActionOnInstance(appName, instancePath, action) {
      var path = 'app/' + appName + '/' + action;
      if (instancePath) {
        path += '?instance-path=' + instancePath;
      }

      return Restangular.one(path).post();
    }

    function listChildrenComponents(appName, componentName) {
      var path = 'app/' + appName + '/components/children';
      if (componentName) {
        path += '?component-name=' + componentName;
      }

      return Restangular.all(path).getList();
    }

    function postNewInstance(appName, instancePath, newInst) {
      var path = 'app/' + appName + '/instances';
      if (instancePath) {
        path += '?instance-path=' + instancePath;
      }

      return Restangular.one(path).post('', newInst);
    }

    function login(username, password) {
      return Restangular.one('auth/e').post('', undefined, {}, { 'u': username, 'p': password });
    }

    function logout() {
      return Restangular.one('auth/s').post();
    }
  }
}());
