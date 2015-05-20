(function () {
    'use strict';

    angular.module( 'roboconf' )
    		.run( configureRun )
    		.config( configureCors );

    configureRun.$inject = [ 'Restangular', 'rprefs' ];
    function configureRun( Restangular, rprefs ) {
    	Restangular.setBaseUrl( rprefs.getUrl());
    }
    
    configureCors.$inject = [ '$sceDelegateProvider' ];
    function configureCors( $sceDelegateProvider ) {
    	// Required because the upload form MAY target another domain.
    	$sceDelegateProvider.resourceUrlWhitelist([
    		'self',	// Allow same origin resource loads.
    		'**']);
    }
})();
