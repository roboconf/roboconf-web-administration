(function() {
    'use strict';

    // Declare the controllers first
    angular
        .module( 'roboconf.application.templates' )
        .controller( 'ApplicationTemplatesController', applicationTemplatesController );

    // Declare the controller functions then.
    // Specify the injection to prevent errors on minification.
    applicationTemplatesController.$inject = [ 'Restangular', '$scope', 'rAppTemplates' ];
    
    // Then comes the function...
    function applicationTemplatesController( Restangular, $scope, rAppTemplates ) {
    	
    	// Fields
    	$scope.appTemplates = [];
    	$scope.invoked = false;
    	$scope.error = false;
    	$scope.searchFilter = '';
    	
    	// Initial actions
    	listApplicationTemplates();
    	initializeSearch();
    	
    	// Function definitions
        function deleteAppTemplate( name, qualifier ) {
    		Restangular.one( 'applications/templates/' + name + '/' + qualifier ).remove().then( function() {
    			listApplicationTemplates();
        	});
        }
        
        function listApplicationTemplates() {
        	rAppTemplates.refreshTemplates().then( function() {
        		$scope.invoked = true;
            	$scope.appTemplates = rAppTemplates.getTemplates();
        		$scope.error = rAppTemplates.gotErrors();
        	});
        }
        
        function initializeSearch() {
        	
        	// Show the search elements
        	$( '#Finder' ).parent().show();
        	$( '#Finder-Companion' ).show();
        	
        	// We just listen to text changes in the search box
        	// to update our local search filter.
        	$( '#Finder' ).bind( 'input', function() {
        		$scope.searchFilter = $( this ).val();
        		
        		// Force the update in the view
        		$scope.$apply();
        	});
        }
    }
})();
