'use strict';

describe('Commands History Directive', function() {

  beforeEach(module('roboconf.commands'));
  beforeEach(module('pascalprecht.translate'));

  var scope, ctrl;
  beforeEach(inject(function($controller, $rootScope) {
    scope = $rootScope.$new();
    ctrl = $controller('CommandsHistoryController', {$scope: scope});
  }));


  it('should verify findPageLink when there is an application', function() {

    scope.app = { name: 'my-app' };
    scope.pageNumber = 1;
    expect(scope.findPageLink(1)).to.equal('#/app/my-app/commands/history/2');
    expect(scope.findPageLink(-1)).to.equal('#/app/my-app/commands/history/0');

    scope.pageNumber = 4;
    expect(scope.findPageLink(2)).to.equal('#/app/my-app/commands/history/6');
    expect(scope.findPageLink(-3)).to.equal('#/app/my-app/commands/history/1');
  });


  it('should verify findPageLink when there is NO application', function() {

    scope.pageNumber = 1;
    expect(scope.findPageLink(1)).to.equal('#/history/commands/2');
    expect(scope.findPageLink(-1)).to.equal('#/history/commands/0');

    scope.pageNumber = 4;
    expect(scope.findPageLink(2)).to.equal('#/history/commands/6');
    expect(scope.findPageLink(-3)).to.equal('#/history/commands/1');
  });


  it('should find the right class for columns', function() {

    scope.sortingCriteria = 'something';
    scope.sortingOrder = 'asc';
    expect(scope.findClass('else')).to.equal('sortable-up');
    expect(scope.findClass('something')).to.equal('sortable-selected-up');

    scope.sortingOrder = 'desc';
    expect(scope.findClass('else')).to.equal('sortable');
    expect(scope.findClass('something')).to.equal('sortable-selected');
  });
});
