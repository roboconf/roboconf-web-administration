'use strict';

describe('Roboconf Utilities :: startsWith', function() {

  beforeEach(module('roboconf.utils'));

  var rutils;
  beforeEach(inject(function($injector) {
    rutils = $injector.get('rUtils');
  }));


  it('should recognize the prefix', function() {
    rutils.startsWith('this is a test', 't').should.equal(true);
    rutils.startsWith('this is a test', 'this').should.equal(true);
    rutils.startsWith('this is a test', 'this is a test').should.equal(true);
  });


  it('should not recognize this prefix', function() {
    rutils.startsWith('this is a test', 'this...').should.equal(false);
    rutils.startsWith('this is a test', 'this isa').should.equal(false);
  });


  it('should return false when no prefix', function() {
    rutils.startsWith('this is a test', undefined).should.equal(false);
    rutils.startsWith('this is a test', null).should.equal(false);
  });


  it('should work correctly when the string is invalid', function() {
    rutils.startsWith(undefined, 'prefix').should.equal(false);
    rutils.startsWith(null, 'prefix').should.equal(false);
  });


  it('should be case-sensitive', function() {
    rutils.startsWith('this is a test', 'This').should.equal(false);
  });


  it('should work correctly with empty strings', function() {
    rutils.startsWith('whatever', '').should.equal(true);
    rutils.startsWith('', 'prefix').should.equal(false);
  });
});
