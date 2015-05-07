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
    		controller  : 'ApplicationsController'
    	});
    }
})();
