(function() {
    'use strict';

    // Declare the controllers first
    angular
        .module( 'roboconf.applications' )
        .controller( 'ApplicationsListingController', applicationsListingController );

    // Declare the controller functions then
    // Specify the injection to prevent errors on minification
    applicationsListingController.$inject = [ 'Restangular', '$scope' ];
    
    // Then comes the function
    function applicationsListingController( Restangular, $scope ) {
    	
    	// Fields
    	$scope.invoked = false;
    	$scope.error = false;
    	$scope.apps = [];
    	$scope.searchFilter = '';
    	
    	// Functions declaration
    	$scope.goToApplication = goToApplication;
    	$scope.deleteApp = deleteApp;
    	
    	// Initial actions
    	listApplications();
    	initializeSearch();
    	
    	// Function definitions
    	function goToApplication( appName ) {
        	window.location.href = '#/app/' + appName;
        }
        
        function deleteApp( appName ) {
        	Restangular.one( 'applications/' + appName + '/delete' ).remove().then( function() {
    			listApplications();
        	});
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
