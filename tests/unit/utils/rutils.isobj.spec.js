'use strict';

describe( 'Roboconf Utilities :: isObj', function() {

	// The service instance
	var rutils;
	
	// Load the JS module
	beforeEach( module( 'roboconf.utils' ));

	// Instantiate the service
	beforeEach( inject( function( $injector ) {
		rutils = $injector.get( 'rutils' );
	}));

	// Run the tests
	it( 'should recognize objects', function() {
		expect( rutils.isObj( "this is a test" )).toBeTruthy();
		expect( rutils.isObj( {} )).toBeTruthy();
		expect( rutils.isObj( [] )).toBeTruthy();
		expect( rutils.isObj( ['item1', 'item2'] )).toBeTruthy();
		expect( rutils.isObj( true )).toBeTruthy();
		expect( rutils.isObj( 54 )).toBeTruthy();
		
		expect( rutils.isObj( null )).not.toBeTruthy();
		expect( rutils.isObj( undefined )).not.toBeTruthy();
	});
});
