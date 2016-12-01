(function() {
  'use strict';

  angular
  .module('roboconf.instances')
  .controller('InstancesListingController', instancesListingController);

  instancesListingController.$inject = [
    '$scope', 'rUtils', '$routeParams',
    'rShare', '$window', 'rClient', 'rWebSocket'
  ];

  function instancesListingController($scope, rUtils, $routeParams, rShare, $window, rClient, rWebSocket) {

    // Fields
    $scope.responseStatus = -1;
    $scope.appName = $routeParams.appName;
    $scope.searchFilter = '';
    $scope.searchVisible = true;
    $scope.template = '';
    $scope.deletionAsked = false;
    $scope.orderingCriteria = 'instance.name';
    $scope.details = 'LIFECYCLE';

    // Menu actions
    $scope.menuActions = [
      {title: 'Create a New Instance', link: '#/app/' + $routeParams.appName + '/instances/new'},
      {title: 'separator'},
      {title: 'Deploy and Start All', fn: function() {
        performAll('deploy-all', false);
      }},
      {title: 'Stop All', fn: function() {
        performAll('stop-all', false);
      }},
      {title: 'Undeploy All', link: '', fn: function() {
        performAll('undeploy-all', false);
      }},
      {title: 'separator'},
      {title: 'Sort by name', link: '', fn: function() {
        if ($scope.orderingCriteria === 'instance.name') {
          $scope.orderingCriteria = '-instance.name';
        } else {
          $scope.orderingCriteria = 'instance.name';
        }
      }},
      {title: 'Sort by state', link: '', fn: function() {
        if ($scope.orderingCriteria === 'instance.status') {
          $scope.orderingCriteria = '-instance.status';
        } else {
          $scope.orderingCriteria = 'instance.status';
        }
      }}
    ];

    // Function declarations
    $scope.loadInstances = loadInstances;
    $scope.showInstance = showInstance;
    $scope.hideInstance = hideInstance;
    $scope.formatStatus = formatStatus;
    $scope.isNodeToHide = isNodeToHide;
    $scope.changeState = changeState;
    $scope.performAll = performAll;
    $scope.createChildInstance = createChildInstance;
    $scope.replicateInstance = replicateInstance;
    $scope.deleteInstance = deleteInstance;
    $scope.showDetailsSection = showDetailsSection;
    $scope.askToDelete = askToDelete;

    // Initial actions
    loadInstances();
    var webSocket = rWebSocket.newWebSocket();
    webSocket.onmessage = onWebSocketMessage;

    // Functions
    function loadInstances() {
      rClient.listInstances($scope.appName).then(function(instances) {
        $scope.responseStatus = 0;
        $scope.rootNodes = rUtils.buildInstancesTree(instances);

      }, function(response) {
        $scope.responseStatus = response.status;
      });
    }

    function showInstance(node, t) {
      var instance = node.instance;
      $scope.selectedInstance = instance;
      rUtils.showRightBlock(t);

      var isRoot = false;
      if (instance && instance.component && instance.component.installer) {
        isRoot = instance.component.installer.toLowerCase() === 'target';
      }

      var parentNotDeployed = isParentNotDeployed(node);
      $scope.template = findTemplateUrl(instance.status, isRoot, parentNotDeployed);
    }

    function showDetailsSection(section) {
      $scope.details = section;
    }

    function hideInstance() {
      $scope.selectedInstance = null;
      rUtils.hideRightBlock();
    }

    function createChildInstance() {
      if ($scope.selectedInstance) {
        rShare.feedLastItem($scope.selectedInstance);
        $window.location = '#/app/' + $scope.appName + '/instances/new';
      }
    }

    function replicateInstance() {
      if ($scope.selectedInstance) {
        $scope.selectedInstance.copy = true;
        createChildInstance();
      }
    }

    function askToDelete() {
      $scope.deletionAsked = true;
    }

    function deleteInstance() {

      rClient.deleteInstance($scope.appName, $scope.selectedInstance.path).then(function() {
        $scope.deletionAsked = false;
        // The instance will be deleted once notified by the web socket.
      });
    }

    function changeState(newState) {
      rClient.changeInstanceState($scope.appName, $scope.selectedInstance.path, newState);
    }

    function performAll(action, useInstance) {

      var path = useInstance ? $scope.selectedInstance.path : null;
      rClient.performActionOnInstance($scope.appName, path, action).then($scope.loadInstances);
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
      case 'WAITING_FOR_ANCESTOR': result = 'waiting for an ancestor to resolve its dependencies'; break;
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

    function onWebSocketMessage(event) {

      if (event.data) {
        var obj = JSON.parse(event.data);
        if (obj.app && obj.app.name === $scope.appName && obj.inst) {
          var instancePath = obj.inst.path;

          // Deletion
          if (obj.event === 'DELETED') {
            rUtils.deleteInstanceNode(instancePath, $scope.rootNodes);
            if ($scope.selectedInstance && $scope.selectedInstance.path === instancePath) {
              hideInstance();
            }
          }

          // Change
          else if (obj.event === 'CHANGED') {
            var node = rUtils.findInstanceNode(instancePath, $scope.rootNodes);
            if (node) {
              node.instance.status = obj.inst.status;
            }
          }

          // Creation
          else if (obj.event === 'CREATED') {
            var instancesToAdd = [obj.inst];
            rUtils.buildInstancesTree(instancesToAdd, null, null, $scope.rootNodes);
          }

          // When doing demos with several web browsers, the view is updated
          // only in the foreground browser. To force the refresh every time,
          // even in background, we must force the refreshment.
          $scope.$apply();
        }
      }
    }
  }
})();
