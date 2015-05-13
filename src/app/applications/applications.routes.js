(function() {
    'use strict';

    angular
        .module( 'roboconf.applications' )
        .config( appConfig );
    
    appConfig.$inject = [ '$routeProvider' ];

    /* @ngInject */
    function appConfig( $routeProvider, $sceDelegateProvider ) {
    	$routeProvider

    	.when('/', {
    		templateUrl : 'templates/applications/html-list.html',
    		controller  : 'ApplicationsListingController'
    	})
    	
    	.when('/applications', {
    		templateUrl : 'templates/applications/html-list.html',
    		controller  : 'ApplicationsListingController'
    	})
    	
    	.when('/applications/new', {
    		templateUrl : 'templates/applications/html-new.html',
    		controller  : 'ApplicationsNewController'
    	});
    }
})();
