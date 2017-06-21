(function() {
  'use strict';

  angular
  .module('roboconf.application-targets')
  .controller('ApplicationTargetsController', applicationTargetsController);

  applicationTargetsController.$inject = ['rClient', '$scope', '$routeParams', '$window', '$translate', 'rUtils'];
  function applicationTargetsController(rClient, $scope, $routeParams, $window, $translate, rUtils) {

    // Fields
    $scope.responseStatus = -1;
    $scope.associations = [];
    $scope.possibleTargets = [];
    $scope.enhancedPossibleTargets = [];
    $scope.defaultTarget = null;
    $scope.filterAssociations = '!/';

    // Scope functions
    $scope.formatTarget = formatTarget;
    $scope.saveAssociation = saveAssociation;
    $scope.cancelAssociation = cancelAssociation;
    $scope.findTargetsList = findTargetsList;

    // Cache some values for i18n (not perfect, but more efficient than querying values every time)
    var i18n = {};
    $translate(['TARGETS_NO_NAME', 'COMMON_DEFAULT']).then(function(translatedValues) {
      i18n = translatedValues;
    });

    // Initial actions
    rClient.findApplication($routeParams.appName).then(function(app) {
      $scope.app = app;
      $scope.responseStatus = app.fake ? 404 : 0;
    });


    rClient.findTargetAssociations($routeParams.appName).then(function(associations) {
      $scope.responseStatus = 0;

      associations.forEach(function(val, index, arr) {
        var obj = {
          path: val.path,
          editable: false,
          selectedId: val.desc ? val.desc.id : -1,
          name: val.desc ? val.desc.name : '',
          handler: val.desc ? val.desc.handler : '',
          component: val.component
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


    rClient.findPossibleTargets($routeParams.appName).then(function(possibleTargets) {
      $scope.responseStatus = 0;
      $scope.possibleTargets = possibleTargets;

      $scope.enhancedPossibleTargets = possibleTargets.slice();
      $scope.enhancedPossibleTargets.splice(0, 0, { name: i18n.COMMON_DEFAULT, id: -1 });

    }, function(response) {
      $scope.responseStatus = response.status;
    });

    // Function definitions
    function formatTarget(t) {
      if (t) {
        return (t.name ? t.name : i18n.TARGETS_NO_NAME) + (t.handler ? '  (' + t.handler + ')' : '');
      } else {
        return '';
      }
    }

    function saveAssociation(a) {

      var fct = rClient.associateTarget;
      if (a.selectedId === -1) {
        fct = rClient.dissociateTarget;
      }

      fct($routeParams.appName, a.selectedId, a.path).then(function() {
        a.editable = false;
        a.oldId = a.selectedId;

        $scope.enhancedPossibleTargets.forEach(function(val, index, arr) {
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

    function findTargetsList(a) {

      var res = $scope.possibleTargets;
      if (a.path !== '') {
        res = $scope.enhancedPossibleTargets;
      }

      return res;
    }
  }
})();
