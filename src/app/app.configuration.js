(function () {
    'use strict';

    angular.module( 'roboconf' )
    		.run( configureRun )
    		.config( configureCors );

    configureRun.$inject = [ 'Restangular', 'rPrefs' ];
    function configureRun( Restangular, rPrefs ) {
    	Restangular.setBaseUrl( rPrefs.getUrl());
    }
    
    configureCors.$inject = [ '$sceDelegateProvider' ];
    function configureCors( $sceDelegateProvider ) {
    	// Required because the upload form MAY target another domain.
    	$sceDelegateProvider.resourceUrlWhitelist([
    		'self',	// Allow same origin resource loads.
    		'**']);
    }
})();
