(function() {
  'use strict';

  angular
  .module('roboconf.application-bindings')
  .controller('ApplicationBindingsController', applicationBindingsController);

  applicationBindingsController.$inject = ['rClient', '$scope', '$routeParams', 'rUtils'];
  function applicationBindingsController(rClient, $scope, $routeParams, rUtils) {

    // Fields
    $scope.responseStatus = -1;
    $scope.appName = $routeParams.appName;
    $scope.status = [];
    $scope.appBindingData = {
       name: '<strong>' + $routeParams.appName + '</strong>'
    };

    $scope.hasBindings = hasBindings;
    $scope.disableSaveButton = disableSaveButton;
    $scope.saveBindings = saveBindings;
    $scope.removeStatus = rUtils.removeArrayItem;

    // Initial actions
    rClient.listApplicationBindings($scope.appName).then(function(bindings) {
      $scope.responseStatus = 0;
      buildApplicationLists(bindings.plain());

    }, function(response) {
      $scope.responseStatus = response.status;
    });

    // Function definitions
    function hasBindings() {
      return $scope.responseStatus === 0 &&
        ! $.isEmptyObject($scope.mapping);
    }


    function buildApplicationLists(bindings) {

      var mapping = {};
      Object.keys(bindings).forEach(function(val, index, arr) {
        mapping[val] = {};
        mapping[val].status = 0;
        mapping[val].def = bindings[val];
        mapping[val].curr = bindings[val];
        mapping[val].key = val;
        mapping[val].apps = [];
      });

      rClient.listApplications().then(function(apps) {
        apps.forEach(function(val, index, arr) {
          if (bindings.hasOwnProperty(val.tplEep)) {
            mapping[val.tplEep].apps.push(val.name);
          }
        });

        $scope.mapping = mapping;
      });
    }


    function disableSaveButton() {

      for (var property in $scope.mapping) {
        var m = $scope.mapping[property];
        if (m.curr !== m.def) {
          return false;
        }
      }

      return true;
    }


    function saveBindings() {

      for (var property in $scope.mapping) {
        var m = $scope.mapping[property];
        if (m.curr !== m.def) {
          updateBinding(m);
        }
      }
    }


    function updateBinding(currentMapping) {

      rClient.bindApplications($scope.appName, currentMapping.key, currentMapping.curr).then(function() {
        currentMapping.status = 1;
        currentMapping.def = currentMapping.curr;
        $scope.status.push({
          ok: true,
          msg: 'Binding for prefix "' + currentMapping.key + '" was successfully saved.'
        });

      }, function(response) {
        currentMapping.status = -1;
        $scope.status.push({
          ok: false,
          msg: 'An error occurred while saving the binding for prefix "' + currentMapping.key + '".'
        });

        // Keep it for debug
        console.log(response);
      });
    }
  }
})();
