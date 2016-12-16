(function() {
  'use strict';

  angular
  .module('roboconf.preferences')
  .controller('PreferencesController', preferencesController);

  preferencesController.$inject = ['rClient', 'rPrefs', '$scope'];
  function preferencesController(rClient, rPrefs, $scope) {
    // nothing for the moment
  }
})();
