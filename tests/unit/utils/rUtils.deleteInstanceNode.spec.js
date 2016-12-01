'use strict';

describe('Roboconf Utilities :: deleteInstanceNode', function() {

  beforeEach(module('roboconf.utils'));

  var rutils;
  beforeEach(inject(function($injector) {
    rutils = $injector.get('rUtils');
  }));


  it('should support empty array', function() {
    var arr = [];
    rutils.deleteInstanceNode('/vm', arr);
    expect(arr).to.be.empty;
  });


  it('should delete the right instances from their paths', function() {

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

    // Build
    var tree = rutils.buildInstancesTree(input);
    tree.should.have.length(2);

    // Delete a child element
    rutils.deleteInstanceNode('/toto/child11/child111', tree);
    tree.should.have.length(2);

    tree[0].should.have.property('instance', instance_root1);
    tree[0].should.have.property('children').with.length(2);

    tree[0].children[0].should.have.property('instance', instance_child11);
    tree[0].children[0].should.have.property('children').with.length(0);

    tree[0].children[1].should.have.property('instance', instance_child12);
    tree[0].children[1].should.have.property('children').with.length(0);

    tree[1].children[0].should.have.property('instance', instance_child21);
    tree[1].children[0].should.have.property('children').with.length(0);

    tree[1].children[1].should.have.property('instance', instance_child22);
    tree[1].children[1].should.have.property('children').with.length(0);

    // Delete a root element
    rutils.deleteInstanceNode('/titi', tree);
    tree.should.have.length(1);

    tree[0].should.have.property('instance', instance_root1);
    tree[0].should.have.property('children').with.length(2);

    tree[0].children[0].should.have.property('instance', instance_child11);
    tree[0].children[0].should.have.property('children').with.length(0);

    tree[0].children[1].should.have.property('instance', instance_child12);
    tree[0].children[1].should.have.property('children').with.length(0);

    // Delete invalid elements
    rutils.findInstanceNode('/toto/child11/child111yeah', tree);
    rutils.findInstanceNode('/invalid', tree);
    rutils.findInstanceNode('', tree);
    tree.should.have.length(1);

    tree[0].should.have.property('instance', instance_root1);
    tree[0].should.have.property('children').with.length(2);

    tree[0].children[0].should.have.property('instance', instance_child11);
    tree[0].children[0].should.have.property('children').with.length(0);

    tree[0].children[1].should.have.property('instance', instance_child12);
    tree[0].children[1].should.have.property('children').with.length(0);
  });
});
