'use strict';


// Create the controller and inject Angular's $scope.
rcfApp.controller( 'mainController', function( $scope, $rootScope, $route, Restangular ) {
	$scope.rInvoked = false;
	$scope.rootUrl = $rootScope.restUrl;
	Restangular.setBaseUrl( $rootScope.restUrl );
		
	Restangular.all( 'applications' ).getList().then( function( applications ) {
		$scope.rInvoked = true;
		$scope.rErrorMsg = '';
		$scope.apps = applications;
		
	}, function() {
		$scope.rInvoked = true;
		$scope.rErrorMsg = 'Communication with the server failed.';
	})
	
	
	// Call-backs for ng-clicks    
    $scope.deleteApp = function( appName ) {
		Restangular.one( 'applications/' + appName ).remove();
    };
    
    $scope.shutdownApp = function( appName ) {
		Restangular.one( 'applications/' + appName + "/shutdown" ).post();
    };
});