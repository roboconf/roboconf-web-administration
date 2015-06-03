(function() {
  'use strict';

  angular
  .module('roboconf.utils')
  .service('rUtils', rUtils);

  rUtils.$inject = ['$timeout'];
  function rUtils($timeout) {

    // Fields
    var service = {
        endsWith: endsWith,
        startsWith: startsWith,
        buildInstancesTree: buildInstancesTree,
        findPosition: findPosition,
        showRightBlock: showRightBlock,
        hideRightBlock: hideRightBlock
    };

    return service;

    // Functions
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

    function buildInstancesTree(instances) {

      var rootInstances = [];
      if (angular.isArray(instances)) {

        var myMap = {};
        instances.map(function(val, index, array) {
          // Reference time: associate an instance with its path
          myMap[val.path] = { instance: val, children: []};
          return val;

        }).forEach(function(val, index, array) {
          // Association time: for every instance, find its parent
          var current = myMap[val.path],
          parentPath = val.path.replace(/\/([^/]+)$/g, ''),
          parent = myMap[parentPath];

          current.instance.treeNode = current;
          if (parent) {
            parent.children.push(current);
            current.parent = parent;
          } else {
            rootInstances.push(current);
          }
        });
      }

      return rootInstances;
    }

    function findPosition(instancePath) {
      var result = instancePath.match(/\//g);
      // Invalid path return the same position than a root instance, i.e. 1.
      return result ? result.length : 1;
    }
  }
}());
