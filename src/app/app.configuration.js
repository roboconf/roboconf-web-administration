(function() {
  'use strict';

  angular.module('roboconf')
  .run(configureRun)
  .config(configureCors)
  .config(translation);

  configureRun.$inject = ['Restangular', 'rPrefs'];
  function configureRun(Restangular, rPrefs) {
    Restangular.setBaseUrl(rPrefs.getUrl());
  }

  configureCors.$inject = ['$sceDelegateProvider'];
  function configureCors($sceDelegateProvider) {
    // Required because the upload form MAY target another domain.
    $sceDelegateProvider.resourceUrlWhitelist(['self', '**']);
  }
  
  translation.$inject = ['$translateProvider'];
  function translation($translateProvider) {
	  
	//Choose a sanitize strategy for security issues
	$translateProvider.useSanitizeValueStrategy(null);
	
	//Load json files
	$translateProvider.useStaticFilesLoader({
		    prefix: 'i18n/',
		    suffix: '.json'
			});
	// Tell the module what language to use by default
	$translateProvider.preferredLanguage('en_US');
	
  }
})();
