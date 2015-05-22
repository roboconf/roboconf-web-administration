'use strict';

describe( 'Roboconf Utilities :: endsWith', function() {

	// The service instance
	var rutils;
	
	// Load the JS module
	beforeEach( module( 'roboconf.utils' ));

	// Instantiate the service
	beforeEach( inject( function( $injector ) {
		rutils = $injector.get( 'rUtils' );
	}));

	// Run the tests
	it( 'should recognize the suffix', function() {
		rutils.endsWith( "this is a test", "a test" ).should.equal( true );
		rutils.endsWith( "this is a test", "test" ).should.equal( true );
		rutils.endsWith( "this is a test", "this is a test" ).should.equal( true );
	});

	it( 'should not recognize this suffix', function() {
		rutils.endsWith( "this is a test", "a test!!!!" ).should.equal( false );
		rutils.endsWith( "this is a test", "atest" ).should.equal( false );
	});
	
	it( 'should return false when no prefix', function() {
		rutils.endsWith( "this is a test", undefined ).should.equal( false );
		rutils.endsWith( "this is a test", null ).should.equal( false );
	});
	
	it( 'should work correctly when the string is invalid', function() {
		rutils.endsWith( undefined, "suffix" ).should.equal( false );
		rutils.endsWith( null, "suffix" ).should.equal( false );
	});
	
	it( 'should be case-sensitive', function() {
		rutils.endsWith( "this is a test", "a TEST" ).should.equal( false );
	});
	
	it( 'should work correctly with empty strings', function() {
		rutils.endsWith( "this is a test", "" ).should.equal( true );
		rutils.endsWith( "", "suffix" ).should.equal( false );
	});
});
