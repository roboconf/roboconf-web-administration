'use strict';

describe('Roboconf Utilities :: findPosition', function() {

  beforeEach(module('roboconf.utils'));

  var rutils;
  beforeEach(inject(function($injector) {
    rutils = $injector.get('rUtils');
  }));


  it('should find positions', function() {
    assert.equal(1, rutils.findPosition('/vm'));
    assert.equal(2, rutils.findPosition('/vm/server'));
    assert.equal(3, rutils.findPosition('/vm/server/app'));
    assert.equal(1, rutils.findPosition('invalid'));
  });
});
