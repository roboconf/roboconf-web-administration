(function() {
    'use strict';

    angular
        .module( 'roboconf.instances' )
        .config( appConfig );
    
    appConfig.$inject = [ '$routeProvider' ];

    /* @ngInject */
    function appConfig( $routeProvider ) {
    	$routeProvider

    	.when('/app/:appName/instances', {
    		templateUrl : 'templates/instances/app.html',
    		controller  : 'InstancesListingController'
    	});
    }
})();
