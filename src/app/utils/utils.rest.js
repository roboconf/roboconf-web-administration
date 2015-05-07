(function() {
    'use strict';

    angular
        .module('roboconf.utils')
        .factory('RbcfRest', rbcfRest);
    
    // FIXME: we may have problems with minification in this file
    // We may have to manually declare an injection.

    /* @ngInject */
    function rbcfRest( Restangular, rprefs ) {
    	Restangular.setBaseUrl( rprefs.getUrl());	
    	return Restangular;
    }
}());
