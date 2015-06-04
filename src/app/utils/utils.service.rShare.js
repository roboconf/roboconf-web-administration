(function() {
  'use strict';

  angular
  .module('roboconf.utils')
  .service('rShare', rShare);

  function rShare() {

    // Fields
    var lastItem = null;
    var service = {
        lastItem: lastItem,
        eatLastItem: eatLastItem,
        feedLastItem: feedLastItem
    };

    return service;

    // Functions
    function eatLastItem() {
      var result = lastItem;
      lastItem = null;
      return result;
    }

    function feedLastItem(newLastItem) {
      lastItem = newLastItem;
    }
  }
}());
