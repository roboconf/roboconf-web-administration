(function() {
    'use strict';

    angular
        .module('roboconf.preferences')
        .service('rPrefs', rPrefs);
    
    // FIXME: reconfigure Restangular when we change the URL?

    /* @ngInject */
    function rPrefs() {
        var service = {
            saveUrl: saveUrl,
            getUrl: getUrl
        };

        return service;
        /////////////////////

        function saveUrl( url ) {
        	
        	var toSave = url ? url.trim() : url;
        	if( toSave ) {
        		var m = toSave.match('/$');
        		if( m && m[ 0 ] === '/' ) {
        			toSave = toSave.substr( 0, toSave.length -1 );
        		}
        	}
        	
        	if( ! toSave || toSave.trim().length === 0 ) {
        		localStorage.removeItem( 'rest-location' );
        	} else {
        		localStorage.setItem( 'rest-location', angular.toJson( toSave ));
        	}
        }

        function getUrl() {
        	
        	var result = 'http://localhost:8181/roboconf-dm';
        	var obj = localStorage.getItem( 'rest-location' );
        	if( obj ) {
        		result = angular.fromJson( obj );
        	}
        	
        	return result;
        }
    }
}());
