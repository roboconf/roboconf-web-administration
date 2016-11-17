'use strict';

describe('Application Upload Directive', function() {

  beforeEach(module('roboconf.utils'));
  beforeEach(module('roboconf.preferences'));
  beforeEach(module('roboconf.applications'));
  beforeEach(module('pascalprecht.translate'));
  beforeEach(module('templates/utils/html/_upload-directive.html'));

  var directive;
  var scope;

  beforeEach(inject(function($rootScope, $compile) {
    scope = $rootScope.$new();
    directive = $compile('<rbcf-zip-upload></rbcf-zip-upload>')(scope);
    scope.$digest();
  }));


  it('should make sure its contains the expected HTML', function() {
    var form = angular.element(directive.find('#new-upload-form')[0]);

    expect(form).to.exist;
    form.text().should.contain('UTILS_UPLOAD_DIRECTIVE_SELECT_ZIP_FILE');
  });
});
