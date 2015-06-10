(function() {
  'use strict';

  angular
  .module('roboconf.instances')
  .controller('InstancesListingController', instancesListingController);

  instancesListingController.$inject =
    ['Restangular', '$scope', 'rUtils', '$routeParams'];

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
    $scope.formatStatus = formatStatus;
    $scope.isNodeToHide = isNodeToHide;
    $scope.changeState = changeState;
    $scope.performAll = performAll;

    // Initial actions
    loadInstances();

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

    function showInstance(node, t) {
      var instance = node.instance;
      $scope.selectedInstance = instance;
      rUtils.showRightBlock(t);

      var isRoot = rUtils.findPosition(instance.path) === 1;
      var parentNotDeployed = isParentNotDeployed(node);
      $scope.template = findTemplateUrl(instance.status, isRoot, parentNotDeployed);
    }

    function hideInstance() {
      $scope.selectedInstance = null;
      rUtils.hideRightBlock();
    }

    function changeState(newState) {
      var path = 'app/' + $scope.appName + '/change-state?new-state=' +
      newState + '&instance-path=' + $scope.selectedInstance.path;

      Restangular.one(path).post();
      $scope.selectedInstance.status = 'CUSTOM';
    }

    function performAll(action, useInstance) {
      var path = 'app/' + $scope.appName + '/' + action;
      if (useInstance) {
        path += '?instance-path=' + $scope.selectedInstance.path;
      }

      Restangular.one(path).post().then($scope.loadInstances);
      if (useInstance) {
        $scope.selectedInstance.status = 'CUSTOM';
      }
    }

    function formatStatus(status) {
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
    }

    function isParentNotDeployed(node) {
      node = node || {};
      while (node.parent) {
        node = node.parent;
      }

      return node.instance.status === 'NOT_DEPLOYED';
    }

    function findTemplateUrl(status, isRoot, isParentNotDeployed) {

      var result;
      if (! isRoot && isParentNotDeployed) {
        result = 'app-not-deployed-no-action';
      } else {
        result = 'app' + (isRoot ? '-root' : '') + '-';
        result += status.toLowerCase().replace('_', '-');
      }

      return 'templates/instances/includes/' + result + '.html';
    }

    function isNodeToHide(instancePath) {

      // This method is only invoked on root nodes.
      // So, paths are always like '/a-sequence-without-other-slashes'
      return !! $scope.selectedInstance &&
        typeof $scope.selectedInstance.path === 'string' &&
        $scope.selectedInstance.path !== instancePath &&
        ! rUtils.startsWith($scope.selectedInstance.path, instancePath + '/');
    }
  }
})();
