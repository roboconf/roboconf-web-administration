(function() {
  'use strict';

  angular
  .module('roboconf.preferences')
  .controller('PreferencesController', preferencesController);

  preferencesController.$inject = ['rClient', 'rPrefs', '$scope', '$timeout', '$translate'];
  function preferencesController(rClient, rPrefs, $scope, $timeout, $translate) {

    // Fields
    $scope.setLang = setLang;

    function setLang(langKey) {
       $translate.use(langKey);
       //rClient.savePreferences('langkey', langKey);
    }
  }
})();
