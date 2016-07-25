(function() {
  'use strict';

  angular
  .module('roboconf.preferences')
  //.module('roboconf.preferences', 'pascalprecht.translate'])
  .controller('PreferencesController', preferencesController);

  //preferencesController.$inject = ['rPrefs', '$scope', '$timeout', '$translate'];
  //function preferencesController(rPrefs, $scope, $timeout, $translate) {
  preferencesController.$inject = ['rPrefs', '$scope', '$timeout', '$translate'];
  function preferencesController(rPrefs, $scope, $timeout, $translate) {

    //Fields
	$scope.setLang = setLang;
	
	function setLang(langKey) {
		$translate.use(langKey);
	}
  }
})();
