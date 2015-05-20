(function() {
    'use strict';

    // Declare the controllers first
    angular
        .module( 'roboconf.preferences' )
        .controller( 'PreferencesController', preferencesController );

    // Declare the controller functions then
    // Specify the injection to prevent errors on minification
    preferencesController.$inject = [ 'rprefs', '$scope' ];
    
    // Then comes the function
    function preferencesController( rprefs, $scope ) {
    	
    	// Scope fields and operations
    	$scope.url = rprefs.getUrl();
    	$scope.saveUrl = saveUrl;
    	
    	// Initial actions
    	initializeSearch();
    	
    	// Functions
    	function saveUrl( url ) {
    		$scope.url = url;
    		rprefs.saveUrl( url );
    		
    		$( '#rprefs-ok' ).show();
    		setTimeout( function() {
    			$( '#rprefs-ok' ).fadeOut();
    	    }, 4000 );
    	}
    	
    	function initializeSearch() {
    		// Hide the search elements
        	$( '#Finder' ).parent().hide();
        	$( '#Finder-Companion' ).hide();
        }
    }
})();
