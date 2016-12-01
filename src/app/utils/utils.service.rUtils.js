(function() {
  'use strict';

  angular
  .module('roboconf.utils')
  .service('rUtils', rUtils);

  rUtils.$inject = ['$timeout', 'rPrefs'];
  function rUtils($timeout, rPrefs) {

    // Fields
    var service = {
        endsWith: endsWith,
        startsWith: startsWith,
        findPosition: findPosition,
        showRightBlock: showRightBlock,
        hideRightBlock: hideRightBlock,
        findInstancePath: findInstancePath,
        findRandomAvatar: findRandomAvatar,
        findIcon: findIcon,
        removeArrayItem: removeArrayItem,

        buildInstancesTree: buildInstancesTree,
        findInstanceNode: findInstanceNode,
        deleteInstanceNode: deleteInstanceNode
    };

    return service;

    // Functions
    function removeArrayItem(arr, item) {

      if (item !== undefined && item !== null) {
        var index = arr.indexOf(item);
        if (index > -1) {
          arr.splice(index, 1);
        }
      }
    }

    function startsWith(string, prefix) {
      return typeof string === 'string' &&
          typeof prefix === 'string' &&
          string.indexOf(prefix) === 0;
    }

    function endsWith(string, suffix) {
      return typeof string === 'string' &&
          typeof suffix === 'string' &&
          string.indexOf(suffix, string.length - suffix.length) !== -1;
    }

    function showRightBlock(delay) {
      $('#left-block').css('width', '50%');
      $timeout(function() {
        $('#right-block').css('visibility', 'visible');
        $('#right-block').css('position', 'static');
        $('#right-block').css('opacity', '1.0');
      }, delay);
    }

    function hideRightBlock() {
      $('#right-block').css('visibility', 'hidden');
      $('#right-block').css('opacity', '0');

      $timeout(function() {
        $('#left-block').css('width', '100%');
        $('#right-block').css('position', 'absolute');
      }, 1000);
    }


    /**
     * Builds or updates a tree of instances.
     * <p>
     * This without a doubt the most complex function of all the
     * web administration.
     * </p>
     *
     * @param {instances} an array of instances
     * @param {filterInstancePath} a filter for instance path
     * @param {fn} a function that returns an object with a 'path' property
     * @param {rootInstances} a tree of instances (will be created if null)
     */
    function buildInstancesTree(instances, filterInstancePath, fn, rootNodes) {

      if (!fn) {
        fn = createInstanceNode;
      }

      var myMap = {};
      if (! angular.isArray(rootNodes)) {
        rootNodes = [];
      }

      // Index the existing nodes
      var nodesToCheck = [].concat(rootNodes);
      while (nodesToCheck.length > 0) {
        var curr = nodesToCheck.shift();
        if (curr.instance.path) {
          myMap[curr.instance.path] = curr;
        }

        if (curr.children) {
          nodesToCheck = nodesToCheck.concat(curr.children);
        }
      }

      // Add the new instances
      if (angular.isArray(instances)) {
        instances.filter(function(val) {
          // Filter time: no need to put useless data in the result
          return ! filterInstancePath || (
              val.path === filterInstancePath ||
              filterInstancePath.indexOf(val.path + '/') === 0 ||
              val.path.indexOf(filterInstancePath + '/') === 0
          );

        }).map(function(val) {
          // Reference time: associate an instance with its path
          myMap[val.path] = fn(val);
          return val;

        }).forEach(function(val) {
          // Association time: for every instance, find its parent
          var current = myMap[val.path],
          parentPath = val.path.replace(/\/([^/]+)$/g, ''),
          parent = myMap[parentPath];

          if (parent) {
            parent.children.push(current);
            current.parent = parent;
          } else {
            rootNodes.push(current);
          }
        });
      }

      // When there is a filter, the result should contain at most 1 root node.
      return rootNodes;
    }

    function findInstanceNode(instancePath, rootNodes) {

      var nodesToCheck = [].concat(rootNodes);
      while (nodesToCheck.length > 0) {
        var curr = nodesToCheck.shift();
        if (curr.instance.path === instancePath) {
          return curr;

        } else if (curr.children) {
          nodesToCheck = nodesToCheck.concat(curr.children);
        }
      }

      return null;
    }

    function deleteInstanceNode(instancePath, rootNodes) {

      var node = findInstanceNode(instancePath, rootNodes);
      if (node) {
        var array = node.parent ? node.parent.children : rootNodes;
        for (var i = 0; i < array.length; i++) {
          if (array[i] === node) {
            array.splice(i, 1);
            break;
          }
        }
      }
    }

    function findPosition(instancePath) {
      var result = instancePath.match(/\//g);
      // Invalid path return the same position than a root instance, i.e. 1.
      return result ? result.length : 1;
    }

    function findInstancePath(inst) {
      var curr = inst;
      var res = '';
      while (curr && curr.name) {
          res = '/' + curr.name + res;
          curr = curr.parent;
      }

      return res;
    }

    function findIcon(app) {
      var icon = 'img/default-avatar.png';
      if (app && app.icon) {
        icon = rPrefs.getUrl().replace('roboconf-dm', 'roboconf-icons') + app.icon;
      }

      return icon;
    }

    function findRandomAvatar(app) {
      if (!app || app.icon) {
        return '';
      }

      // Result depends on the length and the first letter
      var id = (app.name.charCodeAt(0) + app.name.length + 11) % 4;
      switch (id) {
      case 0: return 'avatar-yellow';
      case 1: return 'avatar-green';
      case 2: return 'avatar-orange';
      default: return 'avatar-blue';
      }
    }

    // Internal functions
    function createInstanceNode(val) {
      return {instance: val, children: []};
    }
  }
}());
