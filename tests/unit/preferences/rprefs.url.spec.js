'use strict';

describe( 'Roboconf Utilities :: URL management', function() {

	// The service instance
	var rprefs;
	var defaultUrl = 'http://localhost:8181/roboconf-dm';
	
	
	// Backup the storage
	var backupValue = localStorage.getItem( 'rest-location' );
	
	// Load the JS module
	beforeEach( module( 'roboconf.preferences' ));

	// Instantiate the service
	beforeEach( inject( function( $injector ) {
		rprefs = $injector.get( 'rprefs' );
	}));
	
	// Run the tests
	it( 'should.equal save and restore correctly', function() {
		
		rprefs.saveUrl( undefined );
		rprefs.getUrl().should.equal( defaultUrl );
		
		rprefs.saveUrl( null );
		rprefs.getUrl().should.equal( defaultUrl );
		
		rprefs.saveUrl( '' );
		rprefs.getUrl().should.equal( defaultUrl );
		
		rprefs.saveUrl( '    ' );
		rprefs.getUrl().should.equal( defaultUrl );
		
		rprefs.saveUrl( 'http://something' );
		rprefs.getUrl().should.equal( 'http://something' );
		
		// Remove any trailing slash
		rprefs.saveUrl( 'http://something/' );
		rprefs.getUrl().should.equal( 'http://something' );
		
		// Remove surrounding white characters
		rprefs.saveUrl( ' http://something/   ' );
		rprefs.getUrl().should.equal( 'http://something' );
	});
	
	it( 'should.equal recognize invalid URL', function() {
		
		// Default value is returned by getUrl
		rprefs.saveUrl( undefined );
		rprefs.isInvalidUrl().should.equal( false );
		
		rprefs.saveUrl( null );
		rprefs.isInvalidUrl().should.equal( false );
		
		// Non-default values, but invalid URL
		rprefs.saveUrl( '' );
		rprefs.isInvalidUrl().should.equal( false );
		
		rprefs.saveUrl( '    ' );
		rprefs.isInvalidUrl().should.equal( false );
		
		// Valid URL
		rprefs.saveUrl( '  not empty  ' );
		rprefs.isInvalidUrl().should.equal( false );
		
		rprefs.saveUrl( 'http://something' );
		rprefs.isInvalidUrl().should.equal( false );
	});
	
	// Restore the storage after the tests
	localStorage.setItem( 'rest-location', backupValue );
});
