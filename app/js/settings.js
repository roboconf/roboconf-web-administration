'use strict';


// Controller for the settings
rcfApp.controller( 'settingsController', function( $scope, $rootScope, Restangular ) {
	$scope.restLocation = $rootScope.restUrl;
	
    $scope.saveRestLocation = function( location ) {
		if( location.match("/$") == "/" )
			$rootScope.restUrl = location.substr( 0, location.length -1 );
		else
			$rootScope.restUrl = location;
    	
		localStorage.setItem( 'rest-location', angular.toJson( $rootScope.restUrl ));
    };
});
