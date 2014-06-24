'use strict';


// Create the controller and inject Angular's $scope.
rcfApp.controller( 'mainController', function( $scope, $rootScope, $route, Restangular ) {
	$scope.rootUrl = $rootScope.restUrl;
	Restangular.setBaseUrl( $rootScope.restUrl );
	$scope.noError = true;
	$scope.apps = [];
	
	
	// Define call-backs for ng-clicks    
    $scope.deleteApp = function( appName ) {
		Restangular.one( 'applications/' + appName ).remove();
    };
    
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
    		
    	}, function() {
    		$scope.noError = false;
    	});
    }
    
    
    // Initialize the page
    $scope.refreshApplications();
});