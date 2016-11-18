(function() {
  'use strict';

  angular.module('roboconf')
  .config(configureCors)
  .config(translation)
  .run(configureRestangular)
  .run(configureTranslation);


  configureCors.$inject = ['$sceDelegateProvider'];
  function configureCors($sceDelegateProvider) {
    // Required because the upload form MAY target another domain.
    $sceDelegateProvider.resourceUrlWhitelist(['self', '**']);
  }


  translation.$inject = ['$translateProvider'];
  function translation($translateProvider) {

    // Choose a sanitize strategy for security issues
    $translateProvider.useSanitizeValueStrategy(null);

    // Load json files
    $translateProvider.useStaticFilesLoader({
      prefix: 'i18n/',
      suffix: '.json'
    });

    // Error handling
    $translateProvider.useMissingTranslationHandlerLog();

    // Default language
    $translateProvider.preferredLanguage('en_US');
  }


  configureRestangular.$inject = ['Restangular', 'rPrefs'];
  function configureRestangular(Restangular, rPrefs) {
    Restangular.setBaseUrl(rPrefs.getUrl());
  }


  configureTranslation.$inject = ['$translate', 'rClient'];
  function configureTranslation($translate, rClient) {

    // Get the server settings
    rClient.getPreferences('user.language').then(function(lang) {
      var langSetting = lang[0].value === 'FR' ? 'fr_FR' : 'en_US';
      $translate.use(langSetting);

    }, function() {
      //$translate.preferredLanguage('en_US');
      $translate.use('en_US');
    });
  }
})();
