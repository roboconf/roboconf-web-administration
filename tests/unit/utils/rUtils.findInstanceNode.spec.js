'use strict';

describe('Roboconf Utilities :: findInstanceNode', function() {

  beforeEach(module('roboconf.utils'));

  var rutils;
  beforeEach(inject(function($injector) {
    rutils = $injector.get('rUtils');
  }));


  it('should support empty array', function() {
    expect(rutils.findInstanceNode('/vm', [])).to.be.null;
  });


  it('should find an instance from its path', function() {

    var instance_root1 = { name: 'toto', path: '/toto' };
    var instance_child11 = { name: 'child11', path: '/toto/child11' };
    var instance_child111 = { name: 'child111', path: '/toto/child11/child111' };
    var instance_child12 = { name: 'child12', path: '/toto/child12' };
    var instance_root2 = { name: 'titi', path: '/titi' };
    var instance_child21 = { name: 'titi', path: '/titi/child21' };
    var instance_child22 = { name: 'titi', path: '/titi/child22' };

    var input = [
                 instance_root1,
                 instance_child11,
                 instance_child21,
                 instance_child111,
                 instance_root2,
                 instance_child12,
                 instance_child22
                ];

    var tree = rutils.buildInstancesTree(input);
    rutils.findInstanceNode('/toto/child11/child111', tree).should.have.property('instance', instance_child111);
    rutils.findInstanceNode('/titi', tree).should.have.property('instance', instance_root2);

    expect(rutils.findInstanceNode('/toto/child11/child111yeah', tree)).to.be.null;
    expect(rutils.findInstanceNode('/invalid', tree)).to.be.null;
    expect(rutils.findInstanceNode('', tree)).to.be.null;
  });
});
