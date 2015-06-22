'use strict';

describe('Roboconf Utilities :: handle the right block', function() {

  beforeEach(module('roboconf.utils'));

  var rutils;
  beforeEach(inject(function($injector) {
    rutils = $injector.get('rUtils');
  }));


  it('is just for code coverage', function() {
    rutils.showRightBlock(0);
    rutils.hideRightBlock();
  });


  it('checks an avatar class is found when necessary', function() {
    expect(rutils.findRandomAvatar(undefined)).to.equal('');
    expect(rutils.findRandomAvatar(null)).to.equal('');

    var app = {icon: 'whatever'};
    expect(rutils.findRandomAvatar(app)).to.equal('');

    app.icon = null;
    app.name = 'test';
    expect(rutils.findRandomAvatar(app)).to.equal('avatar-blue');

    app.name = 'test1';
    expect(rutils.findRandomAvatar(app)).to.equal('avatar-yellow');

    app.name = 'test12';
    expect(rutils.findRandomAvatar(app)).to.equal('avatar-green');

    app.name = 'test123';
    expect(rutils.findRandomAvatar(app)).to.equal('avatar-orange');

    app.name = 'green';
    expect(rutils.findRandomAvatar(app)).to.equal('avatar-blue');

    app.name = 'rest';
    expect(rutils.findRandomAvatar(app)).to.equal('avatar-green');
  });
});
