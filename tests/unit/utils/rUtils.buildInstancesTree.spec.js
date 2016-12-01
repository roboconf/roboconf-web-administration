'use strict';

describe('Roboconf Utilities :: buildInstancesTree', function() {

  beforeEach(module('roboconf.utils'));

  var rutils;
  beforeEach(inject(function($injector) {
    rutils = $injector.get('rUtils');
  }));


  it('should support empty array', function() {
    rutils.buildInstancesTree([]).should.have.length(0);
    rutils.buildInstancesTree(null).should.have.length(0);
    rutils.buildInstancesTree(undefined).should.have.length(0);
  });


  it('should contain the single input element', function() {
    var instance = { name: 'toto', path: '/toto' };
    var input = [instance];
    var result = rutils.buildInstancesTree(input);

    result.should.have.length(1);
    result[0].should.have.property('instance', instance);
    result[0].should.have.property('children').with.length(0);
  });


  it('should sort these instances correctly', function() {

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

    var result = rutils.buildInstancesTree(input);

    // Check root instances
    result.should.have.length(2);
    result[0].should.have.property('instance', instance_root1);
    result[0].should.have.property('children').with.length(2);
    result[1].should.have.property('instance', instance_root2);
    result[1].should.have.property('children').with.length(2);

    // Check children of the first root
    result[0].children[0].should.have.property('instance', instance_child11);
    result[0].children[0].should.have.property('children').with.length(1);
    result[0].children[1].should.have.property('instance', instance_child12);
    result[0].children[1].should.have.property('children').with.length(0);

    // Check children of the second root
    result[1].children[0].should.have.property('instance', instance_child21);
    result[1].children[0].should.have.property('children').with.length(0);
    result[1].children[1].should.have.property('instance', instance_child22);
    result[1].children[1].should.have.property('children').with.length(0);

    // Check children of the first child
    result[0].children[0].children[0].should.have.property('instance', instance_child111);
    result[0].children[0].children[0].should.have.property('children').with.length(0);
  });


  it('should sort these OTHER instances correctly', function() {

    var instance_root1 = { name: 'toto', path: '/toto' };
    var instance_child11 = { name: 'child11', path: '/toto/child11' };
    var instance_child111 = { name: 'child111', path: '/toto/child11/child111' };
    var instance_child12 = { name: 'child12', path: '/toto/child12' };
    var instance_root2 = { name: 'titi', path: '/titi' };
    var instance_child21 = { name: 'titi', path: '/titi/child21' };
    var instance_child22 = { name: 'titi', path: '/titi/child22' };

    var input = [
                 instance_child11,
                 instance_child12,
                 instance_child21,
                 instance_child22,
                 instance_child111,
                 instance_root1,
                 instance_root2
                ];

    var result = rutils.buildInstancesTree(input);

    // Check root instances
    result.should.have.length(2);
    result[0].should.have.property('instance', instance_root1);
    result[0].should.have.property('children').with.length(2);
    result[1].should.have.property('instance', instance_root2);
    result[1].should.have.property('children').with.length(2);

    // Check children of the first root
    result[0].children[0].should.have.property('instance', instance_child11);
    result[0].children[0].should.have.property('children').with.length(1);
    result[0].children[1].should.have.property('instance', instance_child12);
    result[0].children[1].should.have.property('children').with.length(0);

    // Check children of the second root
    result[1].children[0].should.have.property('instance', instance_child21);
    result[1].children[0].should.have.property('children').with.length(0);
    result[1].children[1].should.have.property('instance', instance_child22);
    result[1].children[1].should.have.property('children').with.length(0);

    // Check children of the first child
    result[0].children[0].children[0].should.have.property('instance', instance_child111);
    result[0].children[0].children[0].should.have.property('children').with.length(0);
  });


  it('should sort AND filter nodes correctly with an intermediate filter', function() {

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

    var result = rutils.buildInstancesTree(input, '/toto/child11');

    // Check root instances
    result.should.have.length(1);
    result[0].should.have.property('instance', instance_root1);
    result[0].should.have.property('children').with.length(1);

    // Check children of the first root
    result[0].children[0].should.have.property('instance', instance_child11);
    result[0].children[0].should.have.property('children').with.length(1);

    // Check children of the first child
    result[0].children[0].children[0].should.have.property('instance', instance_child111);
    result[0].children[0].children[0].should.have.property('children').with.length(0);
  });


  it('should sort AND filter nodes correctly with a root filter', function() {

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

    var result = rutils.buildInstancesTree(input, '/toto');

    // Check root instances
    result.should.have.length(1);
    result[0].should.have.property('instance', instance_root1);
    result[0].should.have.property('children').with.length(2);

    // Check children of the first root
    result[0].children[0].should.have.property('instance', instance_child11);
    result[0].children[0].should.have.property('children').with.length(1);
    result[0].children[1].should.have.property('instance', instance_child12);
    result[0].children[1].should.have.property('children').with.length(0);

    // Check children of the first child
    result[0].children[0].children[0].should.have.property('instance', instance_child111);
    result[0].children[0].children[0].should.have.property('children').with.length(0);
  });


  it('should sort AND filter nodes correctly with a leaf filter', function() {

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

    var result = rutils.buildInstancesTree(input, '/toto/child11/child111');

    // Check root instances
    result.should.have.length(1);
    result[0].should.have.property('instance', instance_root1);
    result[0].should.have.property('children').with.length(1);

    // Check children of the first root
    result[0].children[0].should.have.property('instance', instance_child11);
    result[0].children[0].should.have.property('children').with.length(1);

    // Check children of the first child
    result[0].children[0].children[0].should.have.property('instance', instance_child111);
    result[0].children[0].children[0].should.have.property('children').with.length(0);
  });


  it('should update the tree correctly', function() {

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

    var result = rutils.buildInstancesTree(input);

    // Add new instances and verify they appear at the right place
    var instance_addition_1 = { name: 'add_1', path: '/titi/child21/add_1' };
    var instance_addition_2 = { name: 'add_2', path: '/toto/child11/child111/add_2' };
    var instance_addition_3 = { name: 'add_3', path: '/add_3' };

    input = [instance_addition_1, instance_addition_2, instance_addition_3];
    result = rutils.buildInstancesTree(input, null, null, result);

    // Verify everything is at the right place
    result.should.have.length(3);
    result[0].should.have.property('instance', instance_root1);
    result[0].should.have.property('children').with.length(2);
    result[1].should.have.property('instance', instance_root2);
    result[1].should.have.property('children').with.length(2);
    result[2].should.have.property('instance', instance_addition_3);
    result[2].should.have.property('children').with.length(0);

    // Check children of the first root
    result[0].children[0].should.have.property('instance', instance_child11);
    result[0].children[0].should.have.property('children').with.length(1);
    result[0].children[1].should.have.property('instance', instance_child12);
    result[0].children[1].should.have.property('children').with.length(0);

    // Check the descendants of the first child
    result[0].children[0].children[0].should.have.property('instance', instance_child111);
    result[0].children[0].children[0].should.have.property('children').with.length(1);

    result[0].children[0].children[0].children[0].should.have.property('instance', instance_addition_2);
    result[0].children[0].children[0].children[0].should.have.property('children').with.length(0);

    // Check the second root instance
    result[1].children[0].should.have.property('instance', instance_child21);
    result[1].children[0].should.have.property('children').with.length(1);

    result[1].children[0].children[0].should.have.property('instance', instance_addition_1);
    result[1].children[0].children[0].should.have.property('children').with.length(0);

    result[1].children[1].should.have.property('instance', instance_child22);
    result[1].children[1].should.have.property('children').with.length(0);
  });

});
