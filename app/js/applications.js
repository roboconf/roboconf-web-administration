'use strict';


// Create the controller and inject Angular's $scope.
rcfApp.controller( 'mainController', function( $scope, $rootScope, $route, Restangular ) {
	$scope.rootUrl = $rootScope.restUrl;
	Restangular.setBaseUrl( $rootScope.restUrl );
	$scope.noError = true;
	$scope.invoked = false;
	$scope.apps = [];
	
	
	// Define call-backs for ng-clicks    
    $scope.shutdownApp = function( appName ) {
		Restangular.one( 'applications/' + appName + "/shutdown" ).post();
    };
    
    $scope.goToApplication = function( appName ) {
    	window.location.href = "#/app/" + appName;
    };
    
    $scope.closeUploadDialog = function() {
    	$( "#upload-result" ).text( "" );
		$( "#file-input-container" ).fileinput( 'clear' );
		updateProgressBar( 0 );
		$scope.refreshApplications();
    }
    
    $scope.refreshApplications = function() {
    	Restangular.all( 'applications' ).getList().then( function( applications ) {
    		$scope.apps = applications;
    		$scope.invoked = true;
    		
    	}, function() {
    		$scope.noError = false;
    	});
    }
    
    $scope.deleteApp = function( appName ) {
		Restangular.one( 'applications/' + appName + "/delete" ).remove().then( function() {
			$scope.refreshApplications();
    	});
    };
    
    
    // Initialize the page
    $scope.refreshApplications();
});