(function() {
  'use strict';

  angular
  .module('roboconf.utils')
  .service('rWebSocket', rWebSocket);

  rWebSocket.$inject = ['rPrefs'];
  function rWebSocket(rPrefs) {

    // Fields
    var service = {
      newWebSocket: newWebSocket
    };

    return service;

    // Functions
    function newWebSocket() {
      var url = rPrefs.getUrl() + '-websocket';
      url = url.replace('http', 'ws');
      return new WebSocket(url);
    }
  }
}());
