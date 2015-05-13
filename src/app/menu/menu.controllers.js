(function() {
    'use strict';

    // Declare the controllers first
    angular
        .module( 'roboconf.menu' )
        .controller( 'MenuController', menuController );

    // Declare the controller functions then
    // Specify the injection to prevent errors on minification
    menuController.$inject = [ 'MenuActions', '$scope' ];
    
    // Then comes the functions
    function menuController( MenuActions, $scope ) {
    	$scope.menuActions = MenuActions.getMenuActions();
    	$scope.showSearchInput = showSearchInput;
    }
    
    function showSearchInput() {
    	$( '#Finder' ).toggle();
    	if( $( '#Finder' ).is( ':visible' ))
    		$( '#Finder' ).focus();
    }
})();
