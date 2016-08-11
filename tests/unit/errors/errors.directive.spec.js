'use strict';

describe('Error Directive', function() {

  beforeEach(module('roboconf.errors'));
  beforeEach(module('pascalprecht.translate'));
  beforeEach(module('templates/errors/_error-message.html'));

  var directive;
  var scope;

  beforeEach(inject(function($rootScope, $compile) {
    scope = $rootScope.$new();
    directive = $compile('<rbcf-error-message></rbcf-error-message>')(scope);
    scope.$digest();
  }));


  it('should make sure its contains the expected HTML', function() {
    var blockContent = angular.element(directive.find('.block-content')[0]);

    expect(blockContent).to.exist;
    //blockContent.text().should.contain('Deployment Manager');
    blockContent.text().should.contain('ERRORS_MESSAGE');
  });
});
