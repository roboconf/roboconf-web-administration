(function() {
  'use strict';

  angular
  .module('roboconf.preferences')
  .controller('PreferencesController', preferencesController);

  preferencesController.$inject = ['rPrefs', '$scope', '$timeout'];
  function preferencesController(rPrefs, $scope, $timeout) {

    // nothing for the moment
  }
})();
