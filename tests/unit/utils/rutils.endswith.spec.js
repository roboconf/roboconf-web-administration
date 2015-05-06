'use strict';

describe( 'Roboconf Utilities :: endsWith', function() {

	// The service instance
	var rutils;
	
	// Load the JS module
	beforeEach( module( 'roboconf.utils' ));

	// Instantiate the service
	beforeEach( inject( function( $injector ) {
		rutils = $injector.get( 'rutils' );
	}));

	// Run the tests
	it( 'should recognize the suffix', function() {
		expect( rutils.endsWith( "this is a test", "a test" )).toBe( true );
		expect( rutils.endsWith( "this is a test", "test" )).toBe( true );
		expect( rutils.endsWith( "this is a test", "this is a test" )).toBe( true );
	});

	it( 'should not recognize this suffix', function() {
		expect( rutils.endsWith( "this is a test", "a test!!!!" )).toBe( false );
		expect( rutils.endsWith( "this is a test", "atest" )).toBe( false );
	});
	
	it( 'should return false when no prefix', function() {
		expect( rutils.endsWith( "this is a test", undefined )).toBe( false );
		expect( rutils.endsWith( "this is a test", null )).toBe( false );
	});
	
	it( 'should work correctly when the string is invalid', function() {
		expect( rutils.endsWith( undefined, "suffix" )).toBe( false );
		expect( rutils.endsWith( null, "suffix" )).toBe( false );
	});
	
	it( 'should be case-sensitive', function() {
		expect( rutils.endsWith( "this is a test", "a TEST" )).toBe( false );
	});
	
	it( 'should work correctly with empty strings', function() {
		expect( rutils.endsWith( "this is a test", "" )).toBe( true );
		expect( rutils.endsWith( "", "suffix" )).toBe( false );
	});
});
