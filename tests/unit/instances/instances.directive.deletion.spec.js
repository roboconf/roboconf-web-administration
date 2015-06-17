'use strict';

describe('Deletion Directive for instances', function() {

  beforeEach(module('roboconf.instances'));
  beforeEach(module('templates/instances/_delete.html'));

  var directive, scope;
  beforeEach(inject(function($rootScope, $compile) {
    scope = $rootScope.$new();
    directive = $compile('<rbcf-delete-instance></rbcf-delete-instance>')(scope);
  }));


  it('should have the right HTML', function() {
    var div = angular.element(directive.find('div')[0]);
    expect(div).to.exist;
  });
});
