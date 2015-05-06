(function() {
    'use strict';

    angular
        .module( 'roboconf.applications' )
        .config( appConfig );
    
    appConfig.$inject = [ '$routeProvider' ];

    /* @ngInject */
    function appConfig( $routeProvider ) {
    	$routeProvider

    	.when('/preferences', {
    		templateUrl : 'templates/preferences/preferences.html',
    		controller  : 'PreferencesController'
    	});
    }
})();
