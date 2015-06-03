'use strict';

describe('Menu Directive', function() {

  beforeEach(module('roboconf.menu'));
  beforeEach(module('templates/menu/_menu.html'));

  var directive;
  var scope;

  beforeEach(inject(function($rootScope, $compile) {
    scope = $rootScope.$new();
    directive = $compile('<rbcf-menu></rbcf-menu>')(scope);
    scope.$digest();
  }));


  it('should make sure the search bar is not visible by default', function() {
    var searchBar = angular.element(directive.find('input')[0]);

    expect(searchBar).to.exist;
    expect(searchBar.attr('type')).to.equal('search');
    expect(searchBar.hasClass('ng-hide')).to.be.true;
  });


  it('should display the search bar when the scope says so', function() {
    var searchBar = angular.element(directive.find('input')[0]);
    expect(searchBar).to.exist;
    expect(searchBar.attr('type')).to.equal('search');

    scope.searchVisible = true;
    scope.$apply();
    expect(searchBar.hasClass('ng-hide')).to.be.false;
  });
});
