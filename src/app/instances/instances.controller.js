(function() {
  'use strict';

  // Declare the controllers first
  angular
  .module('roboconf.instances')
  .controller('InstancesListingController', instancesListingController);

  // Declare the controller functions then
  // Specify the injection to prevent errors on minification
  instancesListingController.$inject =
    ['Restangular', '$scope', 'rUtils', '$routeParams'];

  // Then comes the function
  function instancesListingController(
      Restangular, $scope, rUtils, $routeParams) {

    // Fields
    $scope.noError = true;
    $scope.invoked = false;
    $scope.appName = $routeParams.appName;
    $scope.searchFilter = '';
    $scope.searchVisible = true;
    $scope.template = '';

    // Function declarations
    $scope.loadInstances = loadInstances;
    $scope.showInstance = showInstance;
    $scope.hideInstance = hideInstance;

    // Functions
    function loadInstances() {
      Restangular.all('app/' + $scope.appName + '/children?all-children=true')
      .getList().then(function(instances) {
        $scope.rootNodes = rUtils.buildInstancesTree(instances);
        $scope.error = false;

      }, function() {
        $scope.error = true;
      })
      .finally (function() {
        $scope.invoked = true;
      });
    }

    function showInstance(instance, t) {
      $scope.selectedInstance = instance;
      rUtils.showRightBlock(t);

      var isRoot = rUtils.findPosition(instance.path) === 1;
      var parentNotDeployed = $scope.isParentNotDeployed(instance);
      $scope.template =
        $scope.findTemplateUrl(instance.status, isRoot, parentNotDeployed);
    }

    function hideInstance() {
      $scope.selectedInstance = null;
      rUtils.hideRightBlock();
    }

    // Perform an action on a given instances
    $scope.changeState = function(newState) {
      var path = 'app/' + $scope.appName + '/change-state?new-state=' +
                newState + '&instance-path=' + $scope.selectedInstance.path;

      Restangular.one(path).post();
      $scope.selectedInstance.status = 'CUSTOM';
    };

    $scope.performAll = function(action, useInstance) {
      var path = 'app/' + $scope.appName + '/' + action;
      if (useInstance) {
        path += '?instance-path=' + $scope.selectedInstance.path;
      }

      Restangular.one(path).post().then($scope.loadInstances);
      if (useInstance) {
        $scope.selectedInstance.status = 'CUSTOM';
      }
    };

    // Regularly poll the server
    // FIXME: shouldn't we stop the timeout at some time?
    $scope.updateFromServer = function() {
      setTimeout(
          function() {

            Restangular.all('app/' + $scope.appName + '/children?all-children=true')
            .getList().then(function(instances) {

              // Update the model
              $scope.rootNodes = rUtils.sortInstances(instances);
              $scope.updateSelectedInstance(instances);

              // Refresh in 5 s
              //$scope.updateFromServer();
            });
          }, 5000);
    };



    $scope.formatStatus = function(status) {
      var result = '';

      switch (status) {
      case 'NOT_DEPLOYED': result = 'not deployed'; break;
      case 'STARTING': result = 'starting'; break;
      case 'DEPLOYING': result = 'being deployed'; break;
      case 'UNDEPLOYING': result = 'being undeployed'; break;
      case 'STOPPING': result = 'stopping'; break;
      case 'UNRESOLVED': result = 'waiting for its dependencies to be resolved'; break;
      case 'DEPLOYED_STOPPED': result = 'deployed but stopped'; break;
      case 'DEPLOYED_STARTED': result = 'deployed and started'; break;
      case 'PROBLEM': result = 'undetermined'; break;
      case 'CUSTOM': result = 'being updated...'; break;
      }

      return result;
    };

    $scope.updateSelectedInstance = function(rawInstances) {

      var instanceCandidate = rawInstances.filter(function(instance) {
        return instance.path === $scope.selectedInstance.path && instance.status !== $scope.selectedInstance.status;
      }).pop();

      if (instanceCandidate) {
        $scope.setSelectedInstance(instanceCandidate);
      }
    };

    $scope.isParentNotDeployed = function(instance) {

      var node = instance.treeNode;
      while (node.parent) {
        node = node.parent;
      }

      return node.instance.status === 'NOT_DEPLOYED';
    };

    $scope.findTemplateUrl = function(status, isRoot, isParentNotDeployed) {
      var result = '';

      if (status === 'NOT_DEPLOYED') {
        result = isRoot ? 'app-root-not-deployed.html' : isParentNotDeployed ?
                 'app-not-deployed-no-action.html' : 'app-not-deployed.html';
      } else if (status === 'STARTING') {
        result = 'app-starting.html';
      } else if (status === 'DEPLOYING') {
        result = isRoot ? 'app-root-deploying.html' : 'app-deploying.html';
      } else if (status === 'UNDEPLOYING') {
        result = isRoot ? 'app-root-undeploying.html' : 'app-undeploying.html';
      } else if (status === 'STOPPING') {
        result = 'app-stopping.html';
      } else if (status === 'DEPLOYED_STOPPED') {
        result = 'app-deployed-stopped.html';
      } else if (status === 'PROBLEM') {
        result = 'app-problem.html';
      } else if (status === 'UNRESOLVED') {
        result = 'app-unresolved.html';
      } else if (status === 'DEPLOYED_STARTED') {
        result = isRoot ? 'app-root-deployed-started.html' :
                 'app-deployed-started.html';
      }

      return 'templates/instances/includes/' + result;
    };

    $scope.isNodeToHide = function(instancePath) {
      return $scope.selectedInstance &&
      $scope.selectedInstance.path !== instancePath &&
      ! $scope.selectedInstance.path.startsWith(instancePath + '/');
    };




    // Initialize the page
    $scope.loadInstances();
    //$scope.updateFromServer();
  }
})();
