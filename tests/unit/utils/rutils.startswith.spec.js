'use strict';

describe( 'Roboconf Utilities :: startsWith', function() {

	// The service instance
	var rutils;
	
	// Load the JS module
	beforeEach( module( 'roboconf.utils' ));

	// Instantiate the service
	beforeEach( inject( function( $injector ) {
		rutils = $injector.get( 'rutils' );
	}));

	// Run the tests
	it( 'should recognize the prefix', function() {
		expect( rutils.startsWith( "this is a test", "t" )).toBe( true );
		expect( rutils.startsWith( "this is a test", "this" )).toBe( true );
		expect( rutils.startsWith( "this is a test", "this is a test" )).toBe( true );
	});

	it( 'should not recognize this prefix', function() {
		expect( rutils.startsWith( "this is a test", "this..." )).toBe( false );
		expect( rutils.startsWith( "this is a test", "this isa" )).toBe( false );
	});
	
	it( 'should return false when no prefix', function() {
		expect( rutils.startsWith( "this is a test", undefined )).toBe( false );
		expect( rutils.startsWith( "this is a test", null )).toBe( false );
	});
	
	it( 'should work correctly when the string is invalid', function() {
		expect( rutils.startsWith( undefined, "prefix" )).toBe( false );
		expect( rutils.startsWith( null, "prefix" )).toBe( false );
	});
	
	it( 'should be case-sensitive', function() {
		expect( rutils.startsWith( "this is a test", "This" )).toBe( false );
	});
	
	it( 'should work correctly with empty strings', function() {
		expect( rutils.startsWith( "whatever", "" )).toBe( true );
		expect( rutils.startsWith( "", "prefix" )).toBe( false );
	});
});
