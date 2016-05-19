(function() {
  'use strict';

  angular
  .module('roboconf.utils')
  .service('rClient', rClient);

  rClient.$inject = ['Restangular', '$http', 'rPrefs'];
  function rClient(Restangular, $http, rPrefs) {

    // Fields
    var service = {

      listApplications: listApplications,
      listApplicationTemplates: listApplicationTemplates,
      deleteApplication: deleteApplication,
      deleteApplicationTemplate: deleteApplicationTemplate,
      newApplication: newApplication,
      
      uploadIcon: uploadIcon,
      
      listTargets: listTargets,
      findTarget: findTarget,
      findTargetProperties: findTargetProperties,
      findTargetUsage: findTargetUsage,
      deleteTarget: deleteTarget,
      newTarget: newTarget,
      updateTarget: updateTarget,

      listApplicationBindings: listApplicationBindings,
      bindApplications: bindApplications,
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
      executeCommand: executeCommand
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
    
    function uploadIcon(appName, qualifier, file) {
    	var path = rPrefs.getUrl() + '/applications/image?name=' + appName + '&qualifier=' + qualifier;
    	console.log(path);
    	var formData = new FormData();
    	formData.append('file', file);
    	/*return Restangular.one('applications/image?name=' + appName + '&qualifier=' + qualifier ) 
    		   .withHttpConfig({transformRequest: angular.identity})
    		   .customPOST(formData, ' ', false, {'Mime-Type':'multipart/form-data','Content-Type': 'multipart/form-data'});*/
    	return $http.post(path, formData, {
    		   transformRequest: angular.identity,
    		   headers : {'Mime-Type':'multipart/form-data'}
    	});
    	
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

    function bindApplications(appName, bTplName, bAppName) {
      return Restangular.one('app/' + appName + '/bind?bound-tpl=' + bTplName + '&bound-app=' + bAppName).post();
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
        path += '&instance-path=' + instPath;
      }

      return Restangular.one(path).post();
    }

    function dissociateTarget(appName, targetId, instPath) {
      var path = 'targets/' + targetId + '/associations?bind=false&name=' + appName + '&instance-path=' + instPath;
      return Restangular.one(path).post();
    }

    function listCommands(appName) {
      var path = 'app/' + appName + '/commands';
      return Restangular.all(path).getList();
    }

    function executeCommand(appName, cmdName) {
      var path = 'app/' + appName + '/commands/execute?command-name=' + cmdName;
      return Restangular.one(path).post();
    }

    function listInstances(appName) {
      return Restangular.all('app/' + appName + '/children?all-children=true').getList();
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
  }
}());
