'use strict';

describe('Roboconf Utilities :: without mocking rPrefs', function() {

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


describe('Roboconf Utilities :: while mocking rPrefs', function() {

  beforeEach(function() {
    // Inject rutils
    module('roboconf.utils')

    // Mock rPrefs#getUrl()
    module(function($provide) {
      $provide.service('rPrefs', function() {
        return { 
          getUrl: getUrl
        };

        function getUrl() {
          return 'http://something/roboconf-dm';
        }
      });
    });
  });

  var rutils;
  beforeEach(inject(function($injector) {
    rutils = $injector.get('rUtils');
  }));


  it('finds icons', function() {
    expect(rutils.findIcon(undefined)).to.equal('/img/default-avatar.png');
    expect(rutils.findIcon(null)).to.equal('/img/default-avatar.png');

    var app = {icon: '/whatever.jpg'};
    expect(rutils.findIcon(app)).to.equal('http://something/roboconf-icons/whatever.jpg');

    app.icon = null;
    app.name = 'test';
    expect(rutils.findIcon(app)).to.equal('/img/default-avatar.png');
  });
});
