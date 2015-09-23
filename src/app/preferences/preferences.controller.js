(function() {
  'use strict';

  angular
  .module('roboconf.preferences')
  .controller('PreferencesController', preferencesController);

  preferencesController.$inject = ['rPrefs', '$scope', '$timeout'];
  function preferencesController(rPrefs, $scope, $timeout) {

    // Fields
    $scope.urls = rPrefs.getUrls();
    $scope.selectedUrl = $scope.urls.length > 0 ? $scope.urls[0] : null;
    $scope.saveUrl = saveUrl;
    $scope.showConfirmation = false;

    // Functions
    function saveUrl(url) {
      rPrefs.saveUrl(url);
      $scope.urls = rPrefs.getUrls();

      $scope.showConfirmation = true;
      $timeout(function() {
        $scope.showConfirmation = false;
      }, 4000);
    }
  }
})();
