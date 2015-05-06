'use strict';

describe('ApplicationsController', function() {

	//beforeEach( module( 'roboconf.applications' ));

	it('should be initialized correctly', function( $controller ) {
		var ctrl = $controller('ApplicationsController', {});

		expect( ctrl.invoked ).toBe( false );
		expect( ctrl.noError ).toBe( true );
		expect( ctrl.apps.length ).toBe( 0 );
	});

});
