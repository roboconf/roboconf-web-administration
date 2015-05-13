(function() {
    'use strict';

    angular
        .module('roboconf.menu')
        .service('rmenu', rmenu);

    /* @ngInject */
    function rmenu() {
    	var filter = '';
    	
        var service = {
            saveFilter: saveFilter,
            getFilter: getFilter
        };

        return service;
        /////////////////////

        function saveFilter( _filter ) {
        	filter = _filter;
        }

        function getFilter() {
        	return filter;
        }
    }
}());
