(function() {
    'use strict';

    // Declare the controllers first
    angular
        .module( 'roboconf.application.templates' )
        .controller( 'ApplicationTemplatesController', applicationTemplatesController );

    // Declare the controller functions then.
    // Specify the injection to prevent errors on minification.
    applicationTemplatesController.$inject = [ 'Restangular', 'rprefs', '$scope' ];
    
    // Then comes the function...
    function applicationTemplatesController( Restangular, rprefs, $scope ) {
    	
    	// Fields
    	$scope.appTemplates = [];
    	
    	// Initial actions
    	listApplicationTemplates();
    	
    	// Function definitions
        function deleteAppTemplate( name, qualifier ) {
    		Restangular.one( 'applications/templates/' + name + '/' + qualifier ).remove().then( function() {
    			listApplicationTemplates();
        	});
        }
        
        function listApplicationTemplates() {
        	Restangular.all( 'applications/templates' ).getList().then( function( appTemplates ) {
        		$scope.appTemplates = appTemplates;	
        	});
        }
    }
})();
