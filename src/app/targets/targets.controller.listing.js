(function() {
  'use strict';

  angular
  .module('roboconf.targets')
  .controller('TargetsListingController', targetsListingController);

  targetsListingController.$inject = ['$scope', 'rClient'];
  function targetsListingController($scope, rClient) {

    // Fields
    $scope.responseStatus = -1;
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
        $scope.responseStatus = 0;

      }, function(response) {
        $scope.responseStatus = response.status;
      });
    }
  }
})();
