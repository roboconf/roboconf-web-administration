(function() {
  'use strict';

  angular
  //.module('roboconf.preferences', ['pascalprecht.translate'])
  .module('roboconf.preferences')
  .controller('PreferencesController', preferencesController);

  //preferencesController.$inject = ['rPrefs', '$scope', '$timeout', '$translate'];
  //function preferencesController(rPrefs, $scope, $timeout, $translate) {
  preferencesController.$inject = ['rPrefs', '$scope', '$timeout'];
  function preferencesController(rPrefs, $scope, $timeout) {

    //Fields
	/*$scope.setLang = setLang;
	
	function setLang(langKey) {
		$translate.use(langKey);
	}*/
  }
})();
