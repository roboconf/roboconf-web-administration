'use strict';

describe('Roboconf Utilities :: rShare', function() {

  beforeEach(module('roboconf.utils'));

  var rshare;
  beforeEach(inject(function($injector) {
    rshare = $injector.get('rShare');
  }));


  it('should share an object only once', function() {
    expect(rshare.eatLastItem()).to.not.exist;

    var item = 'some value';
    rshare.feedLastItem(item);
    expect(rshare.eatLastItem()).to.equal(item);
    assert.isNull(rshare.eatLastItem());
  });
});
