(function() {
    'use strict';

    angular
        .module('roboconf.menu')
        .service('rMenu', rMenu);

    /* @ngInject */
    function rMenu() {
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
