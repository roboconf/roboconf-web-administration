(function() {
  'use strict';

  angular
  .module('roboconf.targets')
  .controller('TargetSingleController', targetSingleController);

  targetSingleController.$inject = ['$scope', 'rClient', '$routeParams', '$route'];
  function targetSingleController($scope, rClient, $routeParams, $route) {

    // Fields
    $scope.responseStatus = -1;
    $scope.targetId = $routeParams.targetId;
    $scope.targetAlias = $scope.targetId;
    $scope.stats = [];
    
    // Function declarations
    $scope.findLink = findLink;
    $scope.deleteTarget = deleteTarget;

    // Initial actions
    rClient.findTarget($scope.targetId).then(function(bean) {
      $scope.targetAlias = bean.name ? bean.name : 'no name';
      $scope.target = bean;
      $scope.responseStatus = 0;

    }, function(response) {
      $scope.responseStatus = response.status;
    });

    if ($route.current.usage) {
      rClient.findTargetUsage($scope.targetId).then(function(stats) {
        $scope.stats = stats;
      });
    }

    // Functions
    function findLink(s) {

      if (s.qualifier) {
        return 'tpl/' + s.name + '/' + s.qualifier;
      } else {
        return 'app/' + s.name;
      }
    }

    function deleteTarget() {
      rClient.deleteTarget($scope.targetId).then(function() {
        $window.location = '#/targets';
      });
    }
  }
})();