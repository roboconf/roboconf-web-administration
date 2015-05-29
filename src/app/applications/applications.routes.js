(function() {
    'use strict';

    angular
        .module( 'roboconf.applications' )
        .config( appConfig );
    
    appConfig.$inject = [ '$routeProvider' ];

    /* @ngInject */
    function appConfig( $routeProvider ) {
    	$routeProvider

    	.when('/', {
    		templateUrl : 'templates/applications/_list.html',
    		controller  : 'ApplicationsListingController',
    		tpl: false
    	})
    	
    	.when('/applications', {
    		templateUrl : 'templates/applications/_list.html',
    		controller  : 'ApplicationsListingController',
    		tpl: false
    	})
    	
    	.when('/applications/new', {
    		templateUrl : 'templates/applications/_new.html',
    		controller  : 'ApplicationsNewController'
    	})
    	
    	.when('/application-templates', {
    		templateUrl : 'templates/applications/_list.html',
    		controller  : 'ApplicationsListingController',
    		tpl: true
    	})
    	
    	.when('/application-templates/new', {
    		templateUrl : 'templates/applications/_upload.html',
    		controller  : 'ApplicationsUploadController'
    	});
    }
})();
