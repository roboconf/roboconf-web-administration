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
        getUrl: getUrl,
        getUrls: getUrls
    };

    return service;

    // Functions
    function saveUrl(url) {

      var toSave = url ? url.trim() : url;
      if (toSave) {

        // Remove trailing slash, if any
        var m = toSave.match('/$');
        if (m && m[0] === '/') {
          toSave = toSave.substr(0, toSave.length - 1);
        }

        // Remove the URL from the stored ones, and put it in first position
        var urls = getUrls();
        var index = urls.indexOf(toSave);
        if (index > -1) {
          urls.splice(index, 1);
        }

        urls.unshift(toSave);
        toSave = JSON.stringify(urls);
      }

      if (! toSave || toSave.trim().length === 0) {
        localStorage.removeItem('rest-locations');
      } else {
        localStorage.setItem('rest-locations', toSave);
      }
    }

    function getUrl() {
      var urls = getUrls();
      return urls[0];
    }

    function getUrls() {

      var result;
      var obj = localStorage.getItem('rest-locations');
      if (obj) {
        result = JSON.parse(obj);
      }

      if (! result) {
        result = [ROBOCONF_DEFAULT_URL];
        localStorage.setItem('rest-locations', JSON.stringify(result));
      }

      return result;
    }
  }
}());
