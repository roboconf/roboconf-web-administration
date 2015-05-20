(function() {
    'use strict';

    angular
        .module( 'roboconf.application.templates' )
        .config( appConfig );
    
    appConfig.$inject = [ '$routeProvider' ];

    /* @ngInject */
    function appConfig( $routeProvider ) {
    	$routeProvider

    	.when('/application-templates', {
    		templateUrl : 'templates/application.templates/html-list.html',
    		controller  : 'ApplicationTemplatesController'
    	})
    	.when('/application-templates/new', {
    		templateUrl : 'templates/application.templates/html-upload.html',
    		controller  : 'ApplicationTemplatesController'
    	});
    }
})();
