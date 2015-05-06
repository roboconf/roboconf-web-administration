'use strict';


// Controller for the settings
rcfApp.controller( 'settingsController', function( $scope, $rootScope, Restangular ) {
	$scope.restLocation = $rootScope.restUrl;
	
    $scope.saveRestLocation = function( location ) {
		if( location && location.match("/$") == "/" )
			$rootScope.restUrl = location.substr( 0, location.length -1 );
		else
			$rootScope.restUrl = location;
    	
		var toSave = location ? angular.toJson( $rootScope.restUrl ) : '';
		localStorage.setItem( 'rest-location', toSave );
		$( "#settings-result" ).text( "The REST location was successfully saved in the browser's local storage." );
		setTimeout( function() {
	    		$( "#settings-result" ).text( "" );
	    }, 5000 );
    };
});
