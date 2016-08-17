(function() {
  'use strict';

  angular
  .module('roboconf.preferences')
  .controller('PreferencesController', preferencesController);

  preferencesController.$inject = ['rClient', 'rPrefs', '$scope', '$timeout', '$translate', '$window'];
  function preferencesController(rClient, rPrefs, $scope, $timeout, $translate, $window) {

    // Fields
    $scope.langKeys = ['fr_FR', 'en_US'];
    $scope.showLang = false;
    // Functions
    $scope.setLang = setLang;
    $scope.formatLang = formatLang

    function setLang(langKey) {
       //$scope.showLang = false;
       $translate.use(langKey);
       //$window.location = '#/preferences';
       //rClient.savePreferences('langkey', langKey);
    }
    
    function formatLang(lang) {
        $scope.showLang = true;
        return lang === 'fr_FR'? 'French' : 'English';
    }
  }
})();
