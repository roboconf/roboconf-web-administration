(function() {
    'use strict';

    angular
        .module( 'roboconf.applications' )
        .config( appConfig );
    
    appConfig.$inject = [ '$routeProvider', '$sceDelegateProvider' ];

    /* @ngInject */
    function appConfig( $routeProvider, $sceDelegateProvider ) {
    	$routeProvider

    	.when('/', {
    		templateUrl : 'templates/applications/applications.html',
    		controller  : 'ApplicationsController'
    	});
    		
    	// Required because the upload form MAY target another domain.
    	$sceDelegateProvider.resourceUrlWhitelist([
    		'self',	// Allow same origin resource loads.
    		'**']);
    }
})();
