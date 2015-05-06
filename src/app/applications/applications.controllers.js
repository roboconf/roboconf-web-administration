(function() {
    'use strict';

    // Declare the controllers first
    angular
        .module( 'roboconf.applications' )
        .controller( 'ApplicationsController', applicationsController );

    // Declare the controller functions then
    // Specify the injection to prevent errors on minification
    applicationsController.$inject = [ 'Restangular', '$scope' ];
    
    // Then comes the function
    function applicationsController( Restangular, $scope ) {
    	
    	// Fields
    	$scope.noError = true;
    	$scope.invoked = false;
    	$scope.apps = [];
    	
    	// Initial actions
    	refreshApplications();
    	
    	// Function definitions
    	function shutdownApp( appName ) {
    		Restangular.one( 'applications/' + appName + '/shutdown' ).post();
        }
        
        function goToApplication( appName ) {
        	window.location.href = '#/app/' + appName;
        }
        
        function deleteApp( appName ) {
    		Restangular.one( 'applications/' + appName + '/delete' ).remove().then( function() {
    			refreshApplications();
        	});
        }
        
        function refreshApplications() {
        	Restangular.all( 'applications' ).getList().then( function( applications ) {
        		$scope.apps = applications;
        		$scope.invoked = true;
        		
        	}, function() {
        		$scope.invoked = true;
        		$scope.noError = false;
        	});
        }
    }
})();
