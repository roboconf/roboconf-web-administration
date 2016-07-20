(function() {
  'use strict';

  angular
  .module('roboconf.preferences')
  .service('rPrefs', rPrefs);

  rPrefs.$inject = ['$location', '$injector'];
  function rPrefs($location, $injector) {

    // Fields
    var service = {
        getUrl: getUrl
    };

    return service;

    // Functions
    function getUrl() {

      // Dev' version?
      var serverUrl;
      try {
        // This module must have a specific service
        var devConfig = $injector.get('ROBOCONF_SERVER_URL');
        serverUrl = devConfig;

      } catch (e) {
        // Otherwise, we assume we target Karaf
        serverUrl = $location.protocol() + '://' + $location.host() + ':' + $location.port() + '/roboconf-dm';
      }

      return serverUrl;
    }
  }
}());
