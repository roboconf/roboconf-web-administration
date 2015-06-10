'use strict';

describe('Instances Filter :: Roots', function() {

  beforeEach(module('roboconf.instances'));

  var filter;
  beforeEach(inject(function($injector) {
    filter = $injector.get('$filter')('rbcfRootInstancesFilter');
  }));


  it('should make sure filter is valid', function() {
    expect(filter).to.be.a('function');
  });


  it('should ignore invalid data', function() {
    expect(filter('')).to.have.length(0);
    expect(filter(null)).to.have.length(0);
    expect(filter(undefined)).to.have.length(0);
    expect(filter({})).to.have.length(0);
  });


  it('should recognize root instances', function() {

    var items = [undefined, '', {path: '/root'}, {path: '/root/server'}];
    var result = filter(items);
    expect(result).to.have.length(1);
    expect(result[0].path).to.equal('/root');
  });
});
