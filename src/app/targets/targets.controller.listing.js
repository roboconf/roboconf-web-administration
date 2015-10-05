(function() {
  'use strict';

  angular
  .module('roboconf.targets')
  .controller('TargetsListingController', targetsListingController);

  targetsListingController.$inject = ['$scope', 'rClient'];
  function targetsListingController($scope, rClient) {

    // Fields
    $scope.invoked = false;
    $scope.error = false;
    $scope.targets = [];
    $scope.searchFilter = '';
    $scope.searchVisible = true;

    // Functions declaration

    // Initial actions
    listTargets();

    // Function definitions
    function listTargets() {

      rClient.listTargets().then(function(ts) {
        $scope.targets = ts;
        $scope.error = false;

      }, function() {
        $scope.error = true;

      }).finally(function() {
        $scope.invoked = true;
      });
    }
  }
})();
