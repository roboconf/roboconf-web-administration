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


  it('should save and restore the main URL correctly', function() {

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

  it('should save and restore URLs correctly', function() {

    rprefs.saveUrl(undefined);
    rprefs.getUrls().should.deep.equal([defaultUrl]);

    rprefs.saveUrl(null);
    rprefs.getUrls().should.deep.equal([defaultUrl]);

    rprefs.saveUrl('');
    rprefs.getUrls().should.deep.equal([defaultUrl]);

    rprefs.saveUrl('    ');
    rprefs.getUrls().should.deep.equal([defaultUrl]);

    rprefs.saveUrl('http://something');
    rprefs.getUrls().should.deep.equal(['http://something', defaultUrl]);

    rprefs.saveUrl(defaultUrl);
    rprefs.getUrls().should.deep.equal([defaultUrl, 'http://something']);

    // Remove any trailing slash
    rprefs.saveUrl('http://something/');
    rprefs.getUrls().should.deep.equal(['http://something', defaultUrl]);

    // Insert another location
    rprefs.saveUrl(' http://toto:8085/roboconf-dm');
    rprefs.getUrls().should.deep.equal(['http://toto:8085/roboconf-dm', 'http://something', defaultUrl]);

    // Remove surrounding white characters
    rprefs.saveUrl(' http://something/   ');
    rprefs.getUrls().should.deep.equal(['http://something', 'http://toto:8085/roboconf-dm', defaultUrl]);
  });

  // Restore the storage after the tests
  localStorage.setItem('rest-location', backupValue);
});
