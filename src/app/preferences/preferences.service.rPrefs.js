(function() {
  'use strict';

  angular
  .module('roboconf.preferences')
  .service('rPrefs', rPrefs);

  rPrefs.$inject = ['ROBOCONF_DEFAULT_URL'];
  function rPrefs(ROBOCONF_DEFAULT_URL) {

    // Fields
    var service = {
        saveUrl: saveUrl,
        getUrl: getUrl
    };

    return service;

    // Functions
    function saveUrl(url) {

      var toSave = url ? url.trim() : url;
      if (toSave) {
        var m = toSave.match('/$');
        if (m && m[0] === '/') {
          toSave = toSave.substr(0, toSave.length - 1);
        }
      }

      if (! toSave || toSave.trim().length === 0) {
        localStorage.removeItem('rest-location');
      } else {
        localStorage.setItem('rest-location', angular.toJson(toSave));
      }
    }

    function getUrl() {

      var result = ROBOCONF_DEFAULT_URL;
      var obj = localStorage.getItem('rest-location');
      if (obj) {
        result = angular.fromJson(obj);
      }

      return result;
    }
  }
}());
