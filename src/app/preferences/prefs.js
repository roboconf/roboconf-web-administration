(function() {
    'use strict';

    angular
        .module('roboconf.preferences')
        .service('rprefs', rprefs);

    /* @ngInject */
    function rprefs() {
        var service = {
            saveUrl: saveUrl,
            getUrl: getUrl,
            isInvalidUrl: isInvalidUrl
        };

        return service;
        /////////////////////

        function saveUrl( url ) {
        	
        	var toSave = url ? url.trim() : url;
        	if( toSave && toSave.match("/$") == "/" )
    			toSave = toSave.substr( 0, toSave.length -1 );
        	
        	if( ! toSave || toSave.trim().length == 0 )
        		localStorage.removeItem( 'rest-location' );
        	else
        		localStorage.setItem( 'rest-location', angular.toJson( toSave ));
        }

        function getUrl() {
        	
        	var result = 'http://localhost:8181/roboconf-dm';
        	var obj = localStorage.getItem( 'rest-location' );
        	if( obj )
        		result = angular.fromJson( obj );
        	
        	return result;
        }
        
        function isInvalidUrl() {
        	var url = getUrl();
        	return url == undefined || url == null || url.trim().length == 0; 
        }
    }
}());
