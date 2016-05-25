(function() {
  'use strict';

  angular
  .module('roboconf.preferences')
  .controller('PreferencesController', preferencesController);

  preferencesController.$inject = ['rClient', 'rPrefs', '$scope', '$timeout', '$translate'];
  function preferencesController(rClient, rPrefs, $scope, $timeout, $translate) {

    // Fields
    $scope.langKeys = ['fr_FR', 'en_US'];

    // Functions
    $scope.setLang = setLang;
    $scope.formatLang = formatLang

    function setLang(langKey) {
       $translate.use(langKey);
       //rClient.savePreferences('langkey', langKey);
    }

    function formatLang(lang) {
        return lang === 'fr_FR'? 'French' : 'English';
    }
  }
})();
