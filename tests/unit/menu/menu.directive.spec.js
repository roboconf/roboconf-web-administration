'use strict';

describe('Menu Directive', function() {

  beforeEach(module('roboconf.utils'));
  beforeEach(module('roboconf.menu'));
  beforeEach(module('pascalprecht.translate'));
  beforeEach(module('templates/menu/_menu.html'));

  var directive, scope, httpBackend;
  beforeEach(inject(function($rootScope, $compile, $httpBackend) {

    // Restangular use the HTTP service.
    // We use Angular's mock and make sure any GET response returns an empty array.
    // This empty arrays will be used as the initial value for the instances list.
    httpBackend = $httpBackend;
    httpBackend.whenGET(/.*/g).respond([]);

    // Create a scope and instantiate our controller.
    // Do not forget to invoke $httpBackend.flush() to "speed up" asynchronous calls.
    scope = $rootScope.$new();
    directive = $compile('<rbcf-menu></rbcf-menu>')(scope);
    scope.$digest();

    httpBackend.flush();
    // Since there are asynchronous calls (and promises),
    // all the test methods will need to invoke done() at the end.
  }));


  it('should make sure the search bar is not visible by default', function(done) {
    var searchBar = angular.element(directive.find('input')[0]);

    expect(searchBar).to.exist;
    expect(searchBar.attr('type')).to.equal('search');
    expect(searchBar.hasClass('ng-hide')).to.be.true;
    done();
  });


  it('should display the search bar when the scope says so', function(done) {
    var searchBar = angular.element(directive.find('input')[0]);
    expect(searchBar).to.exist;
    expect(searchBar.attr('type')).to.equal('search');

    scope.searchVisible = true;
    scope.$apply();
    expect(searchBar.hasClass('ng-hide')).to.be.false;
    done();
  });
});
