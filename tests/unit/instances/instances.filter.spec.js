'use strict';

describe('Instances Filter', function() {

  beforeEach(module('roboconf.instances'));

  var filter;
  beforeEach(inject(function($injector) {
    filter = $injector.get('$filter')('rbcfInstancesFilter');
  }));


  it('should make sure filter is valid', function() {
    expect(filter).to.be.a('function');
  });


  it('should ignore invalid data', function() {
    var text = 'test';

    expect(filter('', text)).to.have.length(0);
    expect(filter(null, text)).to.have.length(0);
    expect(filter(undefined, text)).to.have.length(0);
    expect(filter({}, text)).to.have.length(0);
  });


  it('should return the entire array when the filter is empty', function() {
    var array = [{ instance: { path: 'whatever' }}];
    expect(filter(array, '')).to.deep.equal(array);
  });

  it('should filter and be case insensitive', function() {
    var array = [{ instance: { path: '/vm' }}, { instance: { path: '/vm/server' }}];

    expect(filter(array, 'vm')).to.have.length(2);
    expect(filter(array, 'VM')).to.have.length(2);
    expect(filter(array, 'server')).to.have.length(1);
    expect(filter(array, 'SERVer')).to.have.length(1);
    expect(filter(array, 'invalid')).to.have.length(0);
  });
});
