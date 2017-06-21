(function() {
  'use strict';

  angular
  .module('roboconf.application-bindings')
  .controller('ApplicationBindingsController', applicationBindingsController);

  applicationBindingsController.$inject = ['rClient', '$scope', '$routeParams', '$translate', 'rUtils'];
  function applicationBindingsController(rClient, $scope, $routeParams, $translate, rUtils) {

    // Fields
    $scope.responseStatus = -1;
    $scope.status = [];

    $scope.hasBindings = hasBindings;
    $scope.formatBoundApplications = formatBoundApplications;
    $scope.editBinding = editBinding;
    $scope.saveBindings = saveBindings;
    $scope.cancelEditing = cancelEditing;
    $scope.removeStatus = rUtils.removeArrayItem;

    // Initial actions
    rClient.findApplication($routeParams.appName).then(function(app) {
      $scope.app = app;
      $scope.responseStatus = app.fake ? 404 : 0;
    });

    rClient.listApplicationBindings($routeParams.appName).then(function(bindings) {
      $scope.responseStatus = 0;
      $scope.bindings = bindings.plain();

    }, function(response) {
      $scope.responseStatus = response.status;
    });

    // Function definitions
    function hasBindings() {
      return $scope.responseStatus === 0 &&
        ! $.isEmptyObject($scope.bindings);
    }


    function formatBoundApplications(arrayOfApps) {

      var res = '';
      arrayOfApps.forEach(function(appBinding, index, arr) {
        if (appBinding.bound) {
          if (res !== '') {
            res += ', ';
          }

          res += appBinding.name;
        }
      });

      return res === '' ? '-' : res;
    }


    function editBinding(arrayOfApps, event, externalImportPrefix) {

      // We use a temporary (working) property
      $scope.editedPrefix = externalImportPrefix;
      $scope.editedBinding = arrayOfApps;
      if (arrayOfApps) {
        $scope.editedBinding.forEach(function(val, index, arr) {
          val.wbound = val.bound;
        });
      }

      if (event) {
        event.preventDefault();
      }
    }


    function saveBindings() {

      // Apply the editing choice to the right property
      $scope.editedBinding.forEach(function(val, index, arr) {
        val.bound = val.wbound;
      });

      // Prepare the data to send
      var prefix = $scope.editedPrefix;
      var appNames = [];
      $scope.editedBinding.forEach(function(val, index, arr) {
        if (val.bound) {
          appNames.push(val.name);
        }
      });

      // REST invocation
      rClient.updateApplicationBindings($routeParams.appName, prefix, appNames).then(function() {
        $translate('APPLICATIONS_BINDINGS_CTRL_OK', { prefix: prefix }).then(function(translatedValue) {
          $scope.status.push({
            ok: true,
            msg: translatedValue
          });
        });

      }, function(response) {
        $translate('APPLICATIONS_BINDINGS_CTRL_KO', { prefix: prefix }).then(function(translatedValue) {
          $scope.status.push({
            ok: false,
            msg: translatedValue
          });
        });
      });

      // No more binding is being edited and remove the working property
      cancelEditing();
    }


    function cancelEditing() {

      // Remove the editing property
      $scope.editedBinding.forEach(function(val, index, arr) {
        delete val.wbound;
      });

      // No more binding is being edited
      editBinding(null);
    }
  }
})();
