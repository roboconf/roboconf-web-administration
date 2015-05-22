(function() {
    'use strict';

    // Declare the controllers first
    angular
        .module( 'roboconf.menu' )
        .controller( 'MenuController', menuController );

    // Declare the controller functions then
    // Specify the injection to prevent errors on minification
    menuController.$inject = [ '$scope' ];
    
    // Then comes the functions
    function menuController( $scope ) {
    	$scope.showSearchInput = showSearchInput;
    }
    
    function showSearchInput() {
    	$( '#Finder' ).toggle();
    	if( $( '#Finder' ).is( ':visible' )) {
    		$( '#Finder' ).focus();
    	}
    }
})();
