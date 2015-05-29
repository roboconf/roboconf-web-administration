(function() {
    'use strict';

    angular
        .module('roboconf.applications')
        .service('rAppTemplates', rAppTemplates);

    rAppTemplates.$inject = [ 'Restangular' ];
    
    /* @ngInject */
    function rAppTemplates( Restangular ) {
        
    	var appTemplates = [];
        var error = false;
    	
    	var service = {
        	getTemplates: getTemplates,
            refreshTemplates: refreshTemplates,
            gotErrors: gotErrors
        };

        return service;
        
        /////////////////////
        function gotErrors() {
        	return error;
        }
        
        function getTemplates( url ) {
        	return appTemplates;
        }

        function refreshTemplates() {

        	// Return a promise
        	return Restangular.all( 'applications/templates' ).getList().then( function( _appTemplates ) {
        		appTemplates = _appTemplates;
        		error = false;
        		
        	}, function() {
        		appTemplates = [];
        		error = true;
        	});
        }
    }
}());
