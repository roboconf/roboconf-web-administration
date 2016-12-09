'use strict';

describe('Instances Controller :: Listings', function() {

  beforeEach(module('roboconf.utils'));
  beforeEach(module('roboconf.instances'));

  // Create the controller with a new scope
  var ctrl, scope, httpBackend;
  beforeEach(inject(function($controller, $rootScope, $httpBackend) {

    // Restangular use the HTTP service.
    // We use Angular's mock and make sure any GET response returns an empty array.
    // This empty arrays will be used as the initial value for the instances list.
    httpBackend = $httpBackend;
    httpBackend.whenGET(/.*/g).respond([]);
    this.routeParams = {appName: 'test'};

    // Create a scope and instantiate our controller.
    // Do not forget to invoke $httpBackend.flush() to "speed up" asynchronous calls.
    scope = $rootScope.$new();
    ctrl = $controller('InstancesListingController', {$scope: scope, $routeParams: this.routeParams});
    httpBackend.flush();

    // Since there are asynchronous calls (and promises),
    // all the test methods will need to invoke done() at the end.
  }));


  it('should be initialized correctly', function(done) {
    expect(ctrl).to.exist;
    expect(scope.searchVisible).to.be.true;
    expect(scope.searchFilter).to.equal('');
    expect(scope.app.name).to.equal('test');
    expect(scope.rootNodes).to.be.empty;
    done();
  });


  it('should find a description for all the states', function(done) {
    expect(scope.formatStatus('NOT_DEPLOYED')).to.be.not.empty;
    expect(scope.formatStatus('STARTING')).to.be.not.empty;
    expect(scope.formatStatus('STOPPING')).to.be.not.empty;
    expect(scope.formatStatus('DEPLOYING')).to.be.not.empty;
    expect(scope.formatStatus('UNDEPLOYING')).to.be.not.empty;
    expect(scope.formatStatus('DEPLOYED_STOPPED')).to.be.not.empty;
    expect(scope.formatStatus('DEPLOYED_STARTED')).to.be.not.empty;
    expect(scope.formatStatus('UNRESOLVED')).to.be.not.empty;
    expect(scope.formatStatus('PROBLEM')).to.be.not.empty;
    expect(scope.formatStatus('CUSTOM')).to.be.not.empty;
    expect(scope.formatStatus('not a valid state')).to.be.empty;
    done();
  });


  it('should recognize a node to hide', function(done) {

    // No selected instance
    expect(scope.isNodeToHide('/vm')).to.be.false;

    // Selected instance has no 'path' property
    scope.selectedInstance = '';
    scope.$digest();
    expect(scope.isNodeToHide('/vm')).to.be.false;

    // Selected instance has a 'path' property
    scope.selectedInstance = {path: '/vm-aws'};
    scope.$digest();
    expect(scope.isNodeToHide('/vm-aws')).to.be.false;
    expect(scope.isNodeToHide('/vm')).to.be.true;
    expect(scope.isNodeToHide('/vm/server2')).to.be.true;
    expect(scope.isNodeToHide('/vm-aws/test')).to.be.true;
    expect(scope.isNodeToHide('/vm-aws-test')).to.be.true;

    // Selected instance is a child one
    scope.selectedInstance = {path: '/vm-aws/server'};
    scope.$digest();
    expect(scope.isNodeToHide('/vm-aws')).to.be.false;
    expect(scope.isNodeToHide('/vm-aws/server')).to.be.false;
    expect(scope.isNodeToHide('/vm-aws/server2')).to.be.true;
    expect(scope.isNodeToHide('/vm-aws/server/does/not/make/sense/for/this/fct')).to.be.true;
    expect(scope.isNodeToHide('/vm/server2')).to.be.true;

    done();
  });
});
