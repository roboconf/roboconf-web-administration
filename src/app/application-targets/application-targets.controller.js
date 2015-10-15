(function() {
  'use strict';

  angular
  .module('roboconf.application-targets')
  .controller('ApplicationTargetsController', applicationTargetsController);

  applicationTargetsController.$inject = ['rClient', '$scope', '$routeParams', 'rUtils'];
  function applicationTargetsController(rClient, $scope, $routeParams, $window, rUtils) {

    // Fields
    $scope.responseStatus = -1;
    $scope.appName = $routeParams.appName;
    $scope.associations = [];
    $scope.possibleTargets = [];
    $scope.defaultTarget = null;

    $scope.formatTarget = formatTarget;
    $scope.saveAssociation = saveAssociation;
    $scope.cancelAssociation = cancelAssociation;

    // Initial actions
    rClient.findTargetAssociations($scope.appName).then(function(associations) {
      $scope.responseStatus = 0;

      associations.forEach(function(val, index, arr) {
        var obj = {
          path: val.path,
          editable: false,
          selectedId: val.desc ? val.desc.id : -1,
          name: val.desc ? val.desc.name : '',
          handler: val.desc ? val.desc.handler : ''
        };

        obj.oldId = obj.selectedId;
        $scope.associations.push(obj);

        if (!! val && val.path === '') {
          $scope.defaultTarget = val.desc;
        }
      });

    }, function(response) {
      $scope.responseStatus = response.status;
    });

    rClient.findPossibleTargets($scope.appName).then(function(possibleTargets) {
      $scope.responseStatus = 0;
      $scope.possibleTargets = possibleTargets;

    }, function(response) {
      $scope.responseStatus = response.status;
    });

    // Function definitions
    function formatTarget(t) {
      if (t) {
        return (t.name ? t.name : 'no name') + '  (' + t.handler + ')';
      } else {
        return '';
      }
    }

    function saveAssociation(a) {
      rClient.associateTarget($scope.appName, a.selectedId, a.path).then(function() {
        a.editable = false;
        a.oldId = a.selectedId;

        $scope.possibleTargets.forEach(function(val, index, arr) {
          if (a.selectedId === val.id) {
            a.name = val.name;
            a.handler = val.handler;
          }
        });
      });
    }

    function cancelAssociation(a) {
      a.editable = false;
      a.selectedId = a.oldId;
    }
  }
})();
