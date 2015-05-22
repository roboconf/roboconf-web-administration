(function() {
    'use strict';

    angular
        .module('roboconf.utils')
        .service('rUtils', rUtils);

    /* @ngInject */
    function rUtils() {
        var service = {
            endsWith: endsWith,
            startsWith: startsWith,
            isObj: isObj
        };

        return service;
        /////////////////////

        function startsWith( string, prefix ) {
        	return isObj( string ) && isObj( prefix ) && string.indexOf( prefix ) === 0;
        }

        function endsWith( string, suffix ) {
        	return isObj( string ) && isObj( suffix ) && string.indexOf( suffix, string.length - suffix.length ) !== -1;
        }
        
        function isObj( obj ) {
        	return obj !== undefined && obj !== null; 
        }
    }
}());
