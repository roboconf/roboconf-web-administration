'use strict';


rcfApp.controller( 'uploadController', function( $scope, $rootScope ) {
	$scope.actionUrl = $rootScope.restUrl + '/applications';
});
