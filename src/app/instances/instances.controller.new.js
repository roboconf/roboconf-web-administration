(function() {
  'use strict';

  angular
  .module('roboconf.instances')
  .controller('InstancesNewController', instancesNewController);

  instancesNewController.$inject = ['Restangular', '$scope', '$routeParams', 'rUtils', 'rShare'];
  function instancesNewController(Restangular, $scope, $routeParams, rUtils, rShare) {

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
        $scope.rootNode = null;
      }
    }

    function createThemAll() {

      // Go through the entire tree and post writable instances.
      var rootPath = 'app/' + $scope.appName + '/instances';
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
        var path = rootPath;
        if (current.parent) {
          path += '?instance-path=' + rUtils.findInstancePath(current.parent);
        }

        // Post
        postNewInstance(path, current, newInst);
      }

      $scope.mode = 'posted';
    }

    function askToSelectInstance() {
      $scope.mode = 'select-instance';
      loadInstances();
    }

    function selectInstance(confirm) {

      if (confirm) {
        $scope.rootNode = rUtils.buildInstancesTree(
            $scope.existingInstances,
            $scope.selectedInstance.path,
            createNewNode).pop();
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

      var path = 'app/' + $scope.appName + '/components/children';
      if (componentName) {
        path += '?name=' + componentName;
      }

      Restangular.all(path).getList().then(function(components) {
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
      return Restangular.all('app/' + $scope.appName + '/children?all-children=true')
      .getList().then(function(instances) {
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

    function postNewInstance(path, node, newInst) {
      node.progress = 'in progress';
      Restangular.one(path).post('', newInst).then(function() {
        node.progress = 'ok';

      }, function(response) {
        node.progress = 'ko';

      }).finally (function() {
        node.writable = false;
      });
    }
  }
})();
