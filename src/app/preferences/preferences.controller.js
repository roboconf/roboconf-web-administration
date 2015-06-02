(function() {
  'use strict';

  angular
  .module('roboconf.preferences')
  .controller('PreferencesController', preferencesController);

  preferencesController.$inject = ['rPrefs', '$scope', '$timeout'];
  function preferencesController(rPrefs, $scope, $timeout) {

    // Fields
    $scope.url = rPrefs.getUrl();
    $scope.saveUrl = saveUrl;
    $scope.showConfirmation = false;

    // Functions
    function saveUrl(url) {
      $scope.url = url;
      rPrefs.saveUrl(url);

      $scope.showConfirmation = true;
      $timeout(function() {
        $scope.showConfirmation = false;
      }, 4000);
    }
  }
})();
