(function() {
  'use strict';

  angular
  .module('roboconf.utils')
  .service('rShare', rShare);

  function rShare() {

    // Fields
    var lastItem;
    var service = {
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
