'use strict';

describe('Roboconf Utilities :: URL management', function() {

  beforeEach(module('roboconf.preferences'));

  // FIXME: mock localStorage, probably with Sinon
  var rprefs;
  var defaultUrl = 'http://localhost:8181/roboconf-dm';
  var backupValue = localStorage.getItem('rest-location');

  beforeEach(inject(function($injector) {
    rprefs = $injector.get('rPrefs');
  }));


  it('should.equal save and restore correctly', function() {

    rprefs.saveUrl(undefined);
    rprefs.getUrl().should.equal(defaultUrl);

    rprefs.saveUrl(null);
    rprefs.getUrl().should.equal(defaultUrl);

    rprefs.saveUrl('');
    rprefs.getUrl().should.equal(defaultUrl);

    rprefs.saveUrl('    ');
    rprefs.getUrl().should.equal(defaultUrl);

    rprefs.saveUrl('http://something');
    rprefs.getUrl().should.equal('http://something');

    // Remove any trailing slash
    rprefs.saveUrl('http://something/');
    rprefs.getUrl().should.equal('http://something');

    // Remove surrounding white characters
    rprefs.saveUrl(' http://something/   ');
    rprefs.getUrl().should.equal('http://something');
  });

  // Restore the storage after the tests
  localStorage.setItem('rest-location', backupValue);
});
