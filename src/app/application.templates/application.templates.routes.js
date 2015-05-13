(function() {
    'use strict';

    angular
        .module( 'roboconf.application.templates' )
        .config( appConfig );
    
    appConfig.$inject = [ '$routeProvider', '$sceDelegateProvider' ];

    /* @ngInject */
    function appConfig( $routeProvider, $sceDelegateProvider ) {
    	$routeProvider

    	.when('/application-templates', {
    		templateUrl : 'templates/application.templates/html-list.html',
    		controller  : 'ApplicationTemplatesController'
    	})
    	.when('/application-templates/new', {
    		templateUrl : 'templates/application.templates/html-upload.html',
    		controller  : 'ApplicationTemplatesController'
    	});
    		
    	// Required because the upload form MAY target another domain.
    	$sceDelegateProvider.resourceUrlWhitelist([
    		'self',	// Allow same origin resource loads.
    		'**']);
    }
})();
