(function() {
    'use strict';

    // Declare the controllers first
    angular
        .module( 'roboconf.applications' )
        .controller( 'ApplicationsListingController', applicationsListingController );

    // Declare the controller functions then
    // Specify the injection to prevent errors on minification
    applicationsListingController.$inject = [ 'Restangular', '$scope', 'rUtils', 'rShare', '$route', 'rAppTemplates' ];
    
    // Then comes the function
    function applicationsListingController( Restangular, $scope, rUtils, rShare, $route, rAppTemplates ) {
    	
    	// Fields
    	$scope.isTpl = $route.current.tpl;
    	$scope.invoked = false;
    	$scope.error = false;
    	$scope.apps = [];
    	$scope.searchFilter = '';
    	$scope.selectedApp = null;
    	
    	// Functions declaration
    	$scope.showApplication = showApplication;
    	$scope.hideApplication = hideApplication;
    	$scope.findBlockClass = findBlockClass;
    	
    	// Initial actions
    	initializeSearch();
    	
    	if( $scope.isTpl ) {
    		listApplicationTemplates();
    	} else {
    		listApplications();
    	}
    	
    	var tmp = rShare.eatLastItem();
    	if( tmp ) {
    		$scope.selectedApp = tmp;
    		rUtils.showRightBlock( 200 );
    	}
    	
    	// Function definitions
    	function showApplication( app, t ) {
    		$scope.selectedApp = app;
    		rUtils.showRightBlock( t );
        }
    	
    	function hideApplication() {
    		$scope.selectedApp = null;
    		rUtils.hideRightBlock();
        }
    	
    	function findBlockClass( app ) {
    		var result = 'block';
    		if( $scope.selectedApp && app !== $scope.selectedApp ) {
    			result = 'block block-faded';
    		}
    		
    		return result;
    	}
        
        function listApplications() {
        	Restangular.all( 'applications' ).getList().then( function( applications ) {
        		$scope.apps = applications;
        		$scope.invoked = true;
        		$scope.error = false;
        		
        	}, function() {
        		$scope.invoked = true;
        		$scope.error = true;
        	});
        }
        
        function listApplicationTemplates() {
        	rAppTemplates.refreshTemplates().then( function() {
        		$scope.invoked = true;
            	$scope.apps = rAppTemplates.getTemplates();
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
