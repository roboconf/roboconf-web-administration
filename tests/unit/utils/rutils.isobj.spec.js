'use strict';

describe( 'Roboconf Utilities :: isObj', function() {

	// The service instance
	var rutils;
	
	// Load the JS module
	beforeEach( module( 'roboconf.utils' ));

	// Instantiate the service
	beforeEach( inject( function( $injector ) {
		rutils = $injector.get( 'rUtils' );
	}));

	// Run the tests
	it( 'should recognize objects', function() {
		rutils.isObj( "this is a test" ).should.equal( true );
		rutils.isObj( {} ).should.equal( true );
		rutils.isObj( [] ).should.equal( true );
		rutils.isObj( ['item1', 'item2'] ).should.equal( true );
		rutils.isObj( true ).should.equal( true );
		rutils.isObj( 54 ).should.equal( true );
		
		rutils.isObj( null ).should.equal( false );
		rutils.isObj( undefined ).should.equal( false );
	});
});
