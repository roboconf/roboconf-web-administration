'use strict';

describe('Roboconf Utilities :: findInstancePath', function() {

  beforeEach(module('roboconf.utils'));

  var rutils;
  beforeEach(inject(function($injector) {
    rutils = $injector.get('rUtils');
  }));


  it('should find instance paths', function() {
    rutils.findInstancePath(null).should.equal('');
    rutils.findInstancePath(undefined).should.equal('');
    rutils.findInstancePath({}).should.equal('');
    rutils.findInstancePath([]).should.equal('');

    var obj = {name: 'toto'};
    rutils.findInstancePath(obj).should.equal('/toto');

    obj.parent = {name: 'vm'};
    rutils.findInstancePath(obj).should.equal('/vm/toto');

    obj.parent.parent = {name: 'root'};
    rutils.findInstancePath(obj).should.equal('/root/vm/toto');

    obj.child = {name: 'child', parent: obj};
    rutils.findInstancePath(obj).should.equal('/root/vm/toto');
  });
});
