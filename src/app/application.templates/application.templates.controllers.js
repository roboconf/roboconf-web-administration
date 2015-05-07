(function() {
    'use strict';

    // Declare the controllers first
    angular
        .module( 'roboconf.application.templates' )
        .controller( 'ApplicationTemplatesController', applicationTemplatesController );

    // Declare the controller functions then.
    // Specify the injection to prevent errors on minification.
    applicationTemplatesController.$inject = [ 'Restangular', '$scope' ];
    
    // Then comes the function...
    function applicationTemplatesController( Restangular, $scope ) {
    	
    	// Fields
    	$scope.appTemplates = [];
    	$scope.invoked = false;
    	$scope.error = false;
    	
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
        		$scope.invoked = true;
        		$scope.error = false;
        		
        	}, function() {
        		$scope.invoked = true;
        		$scope.error = true;
        	});
        }
    }
})();
