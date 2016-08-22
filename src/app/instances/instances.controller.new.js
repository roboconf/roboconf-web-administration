(function() {
  'use strict';

  angular
  .module('roboconf.instances')
  .controller('InstancesNewController', instancesNewController);

  instancesNewController.$inject = ['rClient', '$scope', '$routeParams', 'rUtils', 'rShare', '$window'];
  function instancesNewController(rClient, $scope, $routeParams, rUtils, rShare, $window) {

    // Fields
    $scope.appName = $routeParams.appName;
    $scope.error = false;

    /*
     * editedInstance has the following properties:
     * - name: the instance name
     * - component: the component
     * - writable: true if it can be modified
    */
    $scope.editedInstance;

    /*
     * Various variables that keep an editing context.
     */
    $scope.oldName, $scope.oldComponent, $scope.mode;

    /*
     * rootNode is the root of an instance tree.
     * It has the same properties than editedInstance, plus a 'children' property.
     */
    $scope.rootNode;

    /*
     * Variables used to initialize the editor with
     * an existing instance.
     */
    $scope.existingInstances, $scope.selectedInstance;

    /*
     * A list of children components for editedInstance.
     */
    $scope.possibleComponents = {};

    // For internationalization
    $scope.instNewData = {
       editedInstName: '',
       appName: '<strong>' + '::' + $routeParams.appName + '</strong>'
    };

    // Function declarations
    $scope.ok = ok;
    $scope.cancel = cancel;
    $scope.createInstance = createInstance;
    $scope.editInstance = editInstance;
    $scope.deleteInstance = deleteInstance;
    $scope.askToDeleteInstance = askToDeleteInstance;
    $scope.findArticle = findArticle;
    $scope.askToSelectInstance = askToSelectInstance;
    $scope.selectInstance = selectInstance;
    $scope.askToReset = askToReset;
    $scope.reset = reset;
    $scope.hardReset = hardReset;
    $scope.createThemAll = createThemAll;
    $scope.showGlobalButtons = showGlobalButtons;

    // Initial actions
    var startingPassedInstance = rShare.eatLastItem();
    if (startingPassedInstance && startingPassedInstance.path) {
      $scope.selectedInstance = startingPassedInstance;
      loadInstances().then(function() {
        selectInstance(true);
      });
    }

    // Functions
    function showGlobalButtons() {

      var res = false;
      if ($scope.rootNode && ! $scope.mode) {

        var arr = [$scope.rootNode];
        while (!res && arr.length > 0) {

          var curr = arr.shift();
          if (curr.writable) {
            res = true;
          } else if (curr.children) {
            arr = arr.concat(curr.children);
          }
        }
      }

      return res;
    }

    function askToReset() {
      $scope.mode = 'reset';
    }

    function reset(confirm) {
      $scope.mode = null;
      if (confirm) {
        hardReset();
        $window.location = '#/app/' + $scope.appName + '/instances';
      }
    }

    function hardReset() {
      $scope.rootNode = null;
      $scope.mode = null;
    }

    function createThemAll() {

      // Go through the entire tree and post writable instances.
      var toDo = [$scope.rootNode];
      while (toDo.length > 0) {

        // Deal with the iteration
        var current = toDo.shift();
        if (current.children) {
          toDo = toDo.concat(current.children);
        }

        if (!current.writable) {
          continue;
        }

        // Prepare the invocation
        var newInst = {name: current.name, component: {name: current.component.name}};
        var instancePath = null;
        if (current.parent) {
          instancePath = rUtils.findInstancePath(current.parent);
        }

        // Post
        postNewInstance(instancePath, current, newInst);
      }

      $scope.mode = 'posted';
    }

    function askToSelectInstance() {
      $scope.mode = 'select-instance';
      loadInstances();
    }

    function selectInstance(confirm) {

      if (confirm) {
        // Build the tree
        $scope.rootNode = rUtils.buildInstancesTree(
            $scope.existingInstances,
            $scope.selectedInstance.path,
            createNewNode).pop();

        // Case of replication: update the root node
        if ($scope.selectedInstance.copy) {
          var oldName = $scope.rootNode.name;
          $scope.rootNode.name = 'Copy of ' + oldName;
          var nodesToCheck = [$scope.rootNode];
          while (nodesToCheck.length > 0) {
            var curr = nodesToCheck.shift();
            curr.writable = true;
            curr.path = curr.path.replace('/' + oldName, '/Copy of ' + oldName);
            nodesToCheck = nodesToCheck.concat(curr.children);
          }
        }
      }

      $scope.mode = null;
      $scope.selectedInstance = null;
    }

    function createInstance(parentNode) {
      $scope.mode = 'new';
      var instName = parentNode ? 'instance' : 'root-instance';
      var node = {name: instName, writable: true};
      $scope.editedInstance = node;

      updateComponentsList(parentNode);
      if (parentNode) {
        if (! parentNode.children) {
          parentNode.children = [];
        }

        parentNode.children.push(node);
        node.parent = parentNode;
      } else if (!parentNode) {
        $scope.rootNode = node;
      }
    }

    function editInstance(node) {
      $scope.mode = 'edit';
      updateComponentsList(node.parent);
      $scope.editedInstance = node;
      $scope.oldName = node.name;
      $scope.oldComponent = node.component;
    }

    function cancel() {

      if ($scope.mode === 'edit') {
        $scope.editedInstance.name = $scope.oldName;
        $scope.editedInstance.component = $scope.oldComponent;
        $scope.instNewData.editedInstName = '<strong>' + $scope.editedInstance.name + '</strong>';

      } else if ($scope.mode === 'new') {
        // Parent? It is a child node.
        if ($scope.editedInstance.parent) {
          var arr = $scope.editedInstance.parent.children;
          var index = arr.indexOf($scope.editedInstance);
          if (index >= 0) {
            arr.splice(index, 1);
          }
        }

        // Otherwise, it is the root node.
        else {
          $scope.rootNode = null;
        }
      }

      ok();
    }

    function ok() {
      $scope.mode = null;
      $scope.oldName = null;
      $scope.oldComponent = null;
      $scope.editedInstance = null;
    }

    function deleteInstance(confirm) {

      if ($scope.editedInstance && confirm) {
        // A parent? We deal with a child node.
        if ($scope.editedInstance.parent && $scope.editedInstance.parent.children) {
          var arr = $scope.editedInstance.parent.children;
          var index = arr.indexOf($scope.editedInstance);
          if (index >= 0) {
            arr.splice(index, 1);
          }
        }
        // Otherwise, remove the root node.
        else {
          $scope.rootNode = null;
        }
      }

      $scope.mode = null;
      $scope.editedInstance = null;
    }

    function askToDeleteInstance(node) {
      if (node) {
        $scope.editedInstance = node;
        $scope.mode = 'delete';
      }
    }

    function findArticle(node) {
      return node.component && node.component.name &&
        -1 !== 'aeiouAEIOU'.indexOf(node.component.name.charAt(0)) ? 'an' : 'a';
    }

    // Internal functions
    function updateComponentsList(parentNode) {
      if (parentNode && parentNode.component) {
        findComponents(parentNode.component.name);
      } else {
        findComponents();
      }
    }

    function findComponents(componentName) {

      rClient.listChildrenComponents($scope.appName, componentName).then(function(components) {
        $scope.possibleComponents = components;
        $scope.error = false;

        // Try to set a default component
        var node = $scope.editedInstance;
        if (!node.component && $scope.possibleComponents.length === 1) {
          node.component = $scope.possibleComponents[0];
        }
      }, function() {
        $scope.error = true;
      });
    }

    function loadInstances(fn) {
      return rClient.listInstances($scope.appName).then(function(instances) {
        $scope.error = false;
        $scope.existingInstances = instances;

      }, function() {
        $scope.error = true;
      });
    }

    function createNewNode(val) {
      return {
        name: val.name,
        path: val.path,
        component: {name: val.component.name},
        children: []
      };
    }

    function postNewInstance(instancePath, node, newInst) {
      node.progress = 'in progress';
      rClient.postNewInstance($scope.appName, instancePath, newInst).then(function() {
        node.progress = 'ok';

      }, function(response) {
        node.progress = 'ko';

      }).finally(function() {
        node.writable = false;
      });
    }
  }
})();
