(function() {
    'use strict';

    // Declare the controllers first
    angular
        .module( 'roboconf.preferences' )
        .controller( 'PreferencesController', preferencesController );

    // Declare the controller functions then
    // Specify the injection to prevent errors on minification
    preferencesController.$inject = [ 'rPrefs', '$scope' ];
    
    // Then comes the function
    function preferencesController( rPrefs, $scope ) {
    	
    	// Scope fields and operations
    	$scope.url = rPrefs.getUrl();
    	$scope.saveUrl = saveUrl;
    	
    	// Initial actions
    	initializeSearch();
    	
    	// Functions
    	function saveUrl( url ) {
    		$scope.url = url;
    		rPrefs.saveUrl( url );
    		
    		$( '#rPrefs-ok' ).show();
    		setTimeout( function() {
    			$( '#rPrefs-ok' ).fadeOut();
    	    }, 4000 );
    	}
    	
    	function initializeSearch() {
    		// Hide the search elements
        	$( '#Finder' ).parent().hide();
        	$( '#Finder-Companion' ).hide();
        }
    }
})();
