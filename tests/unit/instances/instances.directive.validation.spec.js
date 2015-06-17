'use strict';

describe('Validation Directive for instances', function() {

  beforeEach(module('roboconf.instances'));

  var form, scope;
  beforeEach(inject(function($rootScope, $compile) {
    scope = $rootScope.$new();

    scope.editedInstance = {name: 'current'};
    var parent = {name: 'parent', children: [scope.editedInstance, {name: 'sibling'}]};
    scope.editedInstance.parent = parent;
    scope.testmodel = {value: ''};

    var tpl =
      '<form name="form"><input name="value" ng-model="testmodel.value" ' +
      'ng-model-options="{allowInvalid: true}" instance /></form>';

    $compile(tpl)(scope);
    form = scope.form;
    scope.$digest();
  }));


  it('should validate the form when there is no conflict', function() {
    form.value.$setViewValue('non-conflicting');
    expect(scope.testmodel.value).to.equal('non-conflicting');
    expect(form.value.$valid).to.be.true;
  });


  it('should invalidate the form when there is a conflict', function() {
    form.value.$setViewValue('sibling');
    expect(scope.testmodel.value).to.equal('sibling');
    expect(form.value.$valid).to.be.false;
  });
});
