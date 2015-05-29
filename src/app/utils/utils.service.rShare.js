(function() {
    'use strict';

    angular
        .module('roboconf.utils')
        .service('rShare', rShare);

    /* @ngInject */
    function rShare() {
    	
    	var lastItem = null;
    	
        var service = {
        	lastItem: lastItem,
        	eatLastItem: eatLastItem,
            feedLastItem: feedLastItem
        };

        return service;
        /////////////////////

        function eatLastItem() {
        	var result = lastItem;
        	lastItem = null;
        	return result;
        }
        
        function feedLastItem( _lastItem ) {
        	lastItem = _lastItem;
        }
    }
}());
