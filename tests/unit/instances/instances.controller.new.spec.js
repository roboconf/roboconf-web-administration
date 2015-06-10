'use strict';

describe('Instances Controller :: New Instance(s)', function() {

  beforeEach(module('roboconf.utils'));
  beforeEach(module('roboconf.instances'));

  // Create the controller with a new scope
  var ctrl, scope, httpBackend, whenThings;
  beforeEach(inject(function($controller, $rootScope, $httpBackend) {

    // Restangular use the HTTP service.
    // We use Angular's mock and make sure any GET response returns an empty array.
    // This empty arrays will be used as the initial value for the instances list.
    httpBackend = $httpBackend;
    whenThings = $httpBackend.when('GET', /.*/g);
    whenThings.respond([]);

    // Create a scope and instantiate our controller.
    scope = $rootScope.$new();
    ctrl = $controller('InstancesNewController', {$scope: scope, $routeParams: {appName: 'test'}});

    // Do not forget to invoke httpBackend.flush() to "speed up" asynchronous calls.
    // Since there are asynchronous calls (and promises),
    // all the test methods will need to invoke done() at the end.
  }));


  it('should be initialized correctly', function(done) {
    expect(ctrl).to.exist;
    expect(scope.searchVisible).to.be.not.defined;
    expect(scope.editedInstance).to.be.not.defined;
    expect(scope.rootNode).to.be.not.defined;
    expect(scope.mode).to.not.be.defined;
    expect(scope.error).to.be.false;
    expect(scope.possibleComponents).to.be.empty;
    done();
  });


  /*
   * The following tests simulate interactions as if they
   * were triggered by the user interface. Every possible
   * workflow should be tested in this way.
   */


  it('should be able to create a root node', function(done) {
    var instance = {name: 'root-instance', writable: true};

    expect(scope.rootNode).to.be.not.defined;
    expect(scope.editedInstance).to.be.not.defined;
    expect(scope.mode).to.not.be.defined;

    scope.createInstance();
    httpBackend.flush();

    expect(scope.mode).to.equal('new');
    expect(scope.rootNode).to.be.defined;
    expect(scope.editedInstance).to.be.defined;

    expect(scope.rootNode).to.deep.equal(instance);
    expect(scope.editedInstance).to.deep.equal(instance);

    scope.ok();
    expect(scope.mode).to.not.be.defined;
    expect(scope.editedInstance).to.be.not.defined;
    expect(scope.rootNode).to.deep.equal(instance);
    done();
  });


  it('should be able to cancel the creation of a root node', function(done) {
    var instance = {name: 'root-instance', writable: true};

    expect(scope.rootNode).to.be.not.defined;
    expect(scope.editedInstance).to.be.not.defined;
    expect(scope.mode).to.not.be.defined;

    scope.createInstance(null);
    httpBackend.flush();

    expect(scope.mode).to.equal('new');
    expect(scope.rootNode).to.be.defined;
    expect(scope.editedInstance).to.be.defined;

    expect(scope.rootNode).to.deep.equal(instance);
    expect(scope.editedInstance).to.deep.equal(instance);

    scope.cancel();
    expect(scope.mode).to.not.be.defined;
    expect(scope.editedInstance).to.be.not.defined;
    expect(scope.rootNode).to.not.be.defined;
    done();
  });


  it('should be able to create a child node', function(done) {
    scope.rootNode = {name: 'root-instance', writable: true};
    var instance = {name: 'instance', writable: true, parent: scope.rootNode};

    expect(scope.editedInstance).to.be.not.defined;
    expect(scope.mode).to.not.be.defined;
    expect(scope.rootNode.children).to.not.be.defined;

    scope.createInstance(scope.rootNode);
    httpBackend.flush();

    expect(scope.mode).to.equal('new');
    expect(scope.editedInstance).to.be.defined;
    expect(scope.editedInstance).to.deep.equal(instance);
    expect(scope.editedInstance.component).to.not.be.defined;

    scope.ok();
    expect(scope.mode).to.not.be.defined;
    expect(scope.editedInstance).to.be.not.defined;
    expect(scope.rootNode.children).to.be.defined;
    expect(scope.rootNode.children).to.have.length(1);
    expect(scope.rootNode.children[0]).to.deep.equal(instance);
    done();
  });


  it('should be able to create a child node and set the component directly when possible', function(done) {
    scope.rootNode = {name: 'root-instance', writable: true, component: {name: 'vm'}};
    whenThings.respond([{name: 'server'}]);

    expect(scope.editedInstance).to.be.not.defined;
    expect(scope.rootNode.children).to.not.be.defined;
    expect(scope.possibleComponents).to.not.be.defined;

    scope.createInstance(scope.rootNode);
    httpBackend.flush();
    expect(scope.possibleComponents).to.have.length(1);

    expect(scope.editedInstance).to.be.defined;
    expect(scope.editedInstance.name).to.equal('instance');
    expect(scope.editedInstance.component.name).to.equal('server');
    done();
  });


  it('should be able to cancel the creation of a child node', function(done) {
    scope.rootNode = {name: 'root-instance', writable: true};
    var instance = {name: 'instance', writable: true, parent: scope.rootNode};

    expect(scope.editedInstance).to.be.not.defined;
    expect(scope.mode).to.not.be.defined;
    expect(scope.rootNode.children).to.not.be.defined;

    scope.createInstance(scope.rootNode);
    httpBackend.flush();

    expect(scope.mode).to.equal('new');
    expect(scope.editedInstance).to.be.defined;
    expect(scope.editedInstance).to.deep.equal(instance);

    scope.cancel();
    expect(scope.mode).to.not.be.defined;
    expect(scope.editedInstance).to.be.not.defined;
    expect(scope.rootNode.children).to.be.defined;
    expect(scope.rootNode.children).to.have.length(0);
    done();
  });


  it('should be able to create child nodes at the right location', function(done) {
    scope.rootNode = {name: 'root-instance', writable: true};

    expect(scope.editedInstance).to.be.not.defined;
    expect(scope.mode).to.not.be.defined;
    expect(scope.rootNode.children).to.not.be.defined;

    // Child 1
    scope.createInstance(scope.rootNode);
    httpBackend.flush();

    scope.ok();
    expect(scope.rootNode.children).to.be.defined;
    expect(scope.rootNode.children).to.have.length(1);
    var child1 = scope.rootNode.children[0];
    expect(child1.name).to.equal('instance');
    expect(child1.writable).to.be.true;
    expect(child1.parent).to.deep.equal(scope.rootNode);

    // Child 2
    scope.createInstance(scope.rootNode);
    httpBackend.flush();

    scope.ok();
    expect(scope.rootNode.children).to.be.defined;
    expect(scope.rootNode.children).to.have.length(2);
    var child2 = scope.rootNode.children[1];
    expect(child2.name).to.equal('instance');
    expect(child2.writable).to.be.true;
    expect(child2.parent).to.deep.equal(scope.rootNode);
    expect(child1).to.deep.equal(child1);

    // Grand-child 1
    expect(child1.children).to.not.be.defined;
    expect(child2.children).to.not.be.defined;
    scope.createInstance(child1);
    httpBackend.flush();

    scope.ok();
    expect(child1.children).to.be.defined;
    expect(child2.children).to.not.be.defined;
    expect(child1.children).to.have.length(1);

    var gdChild = child1.children[0];
    expect(gdChild.name).to.equal('instance');
    expect(gdChild.writable).to.be.true;
    expect(gdChild.parent).to.deep.equal(child1);

    done();
  });


  it('should be able to cancel the creation of a grand-child node', function(done) {
    scope.rootNode = {name: 'root-instance', writable: true};

    expect(scope.editedInstance).to.be.not.defined;
    expect(scope.mode).to.not.be.defined;
    expect(scope.rootNode.children).to.not.be.defined;

    // Child 1
    scope.createInstance(scope.rootNode);
    httpBackend.flush();

    scope.ok();
    expect(scope.rootNode.children).to.be.defined;
    expect(scope.rootNode.children).to.have.length(1);
    var child1 = scope.rootNode.children[0];
    expect(child1.name).to.equal('instance');
    expect(child1.writable).to.be.true;
    expect(child1.parent).to.deep.equal(scope.rootNode);

    // Child 2
    scope.createInstance(scope.rootNode);
    httpBackend.flush();

    scope.ok();
    expect(scope.rootNode.children).to.be.defined;
    expect(scope.rootNode.children).to.have.length(2);
    var child2 = scope.rootNode.children[1];
    expect(child2.name).to.equal('instance');
    expect(child2.writable).to.be.true;
    expect(child2.parent).to.deep.equal(scope.rootNode);
    expect(child1).to.deep.equal(child1);

    // Grand-child 1
    expect(child1.children).to.not.be.defined;
    expect(child2.children).to.not.be.defined;
    scope.createInstance(child1);
    httpBackend.flush();

    scope.cancel();
    expect(child1.children).to.be.defined;
    expect(child2.children).to.not.be.defined;
    expect(child1.children).to.have.length(0);

    done();
  });


  it('should be able to edit a root node', function(done) {
    scope.rootNode = {name: 'root-instance', writable: true};

    expect(scope.editedInstance).to.be.not.defined;
    expect(scope.mode).to.not.be.defined;
    expect(scope.rootNode.children).to.not.be.defined;

    scope.editInstance(scope.rootNode);
    httpBackend.flush();

    expect(scope.mode).to.equal('edit');
    expect(scope.editedInstance).to.be.defined;
    scope.rootNode.name = 'whatever';

    scope.ok();
    expect(scope.mode).to.not.be.defined;
    expect(scope.editedInstance).to.be.not.defined;
    expect(scope.rootNode.children).to.not.be.defined;
    expect(scope.rootNode.name).to.equal('whatever');
    done();
  });


  it('should be able to cancel the edition of a root node', function(done) {
    scope.rootNode = {name: 'root-instance', writable: true};

    expect(scope.editedInstance).to.be.not.defined;
    expect(scope.mode).to.not.be.defined;
    expect(scope.rootNode.children).to.not.be.defined;

    scope.editInstance(scope.rootNode);
    httpBackend.flush();

    expect(scope.mode).to.equal('edit');
    expect(scope.editedInstance).to.be.defined;
    scope.rootNode.name = 'whatever';

    scope.cancel();
    expect(scope.mode).to.not.be.defined;
    expect(scope.editedInstance).to.be.not.defined;
    expect(scope.rootNode.children).to.not.be.defined;
    expect(scope.rootNode.name).to.equal('root-instance');
    done();
  });


  it('should be able to edit a child node', function(done) {

    expect(scope.rootNode).to.not.be.defined;
    scope.createInstance();
    httpBackend.flush();
    scope.ok();
    scope.createInstance(scope.rootNode);
    httpBackend.flush();
    scope.ok();
    scope.createInstance(scope.rootNode.children[0]);
    httpBackend.flush();
    scope.ok();

    var ei = scope.rootNode.children[0].children[0];
    expect(ei).to.be.defined;
    expect(ei.name).to.equal('instance');
    expect(ei.writable).to.be.true;

    scope.editInstance(ei);
    httpBackend.flush();
    ei.name = 'woo';
    scope.ok();
    expect(ei.name).to.equal('woo');
    done();
  });


  it('should be able to cancel the edition of a child node', function(done) {

    expect(scope.rootNode).to.not.be.defined;
    scope.createInstance();
    httpBackend.flush();
    scope.ok();
    scope.createInstance(scope.rootNode);
    httpBackend.flush();
    scope.ok();
    scope.createInstance(scope.rootNode.children[0]);
    httpBackend.flush();
    scope.ok();

    var ei = scope.rootNode.children[0].children[0];
    expect(ei).to.be.defined;
    expect(ei.name).to.equal('instance');
    expect(ei.writable).to.be.true;

    scope.editInstance(ei);
    httpBackend.flush();
    ei.name = 'woo';
    scope.cancel();
    expect(ei.name).to.equal('instance');
    done();
  });


  it('should be able to delete a root node, even when there is no root node', function(done) {

    expect(scope.rootNode).to.not.be.defined;
    scope.askToDeleteInstance();
    scope.deleteInstance(true);
    expect(scope.rootNode).to.not.be.defined;
    done();
  });


  it('should be able to delete a root node', function(done) {
    scope.rootNode = {name: 'root-instance', writable: true};

    scope.askToDeleteInstance(scope.rootNode);
    scope.deleteInstance(true);
    expect(scope.rootNode).to.not.be.defined;
    done();
  });


  it('should be able to cancel the deletion of a root node', function(done) {
    scope.rootNode = {name: 'root-instance', writable: true};

    scope.askToDeleteInstance(scope.rootNode);
    scope.deleteInstance(false);
    expect(scope.rootNode).to.be.defined;
    expect(scope.rootNode.name).to.equal('root-instance');
    done();
  });


  it('should be able to delete a child node', function(done) {
    scope.rootNode = {name: 'root-instance', writable: true};
    var child = {name: 'instance', writable: true, parent: scope.rootNode};
    scope.rootNode.children = [child];

    expect(scope.rootNode.children).to.have.length(1);
    scope.askToDeleteInstance(child);
    scope.deleteInstance(true);
    expect(scope.rootNode.children).to.have.length(0);
    done();
  });


  it('should be able to cancel the deletion of a child node', function(done) {
    scope.rootNode = {name: 'root-instance', writable: true};
    var child = {name: 'instance', writable: true, parent: scope.rootNode};
    scope.rootNode.children = [child];

    expect(scope.rootNode.children).to.have.length(1);
    scope.askToDeleteInstance(child);
    scope.deleteInstance(false);
    expect(scope.rootNode.children).to.have.length(1);
    expect(scope.rootNode.children[0]).to.deep.equal(child);
    done();
  });


  it('should find the right article', function(done) {

    var node = {};
    expect(scope.findArticle(node)).to.equal('a');

    node.component = {};
    expect(scope.findArticle(node)).to.equal('a');

    node.component.name = 'apache';
    expect(scope.findArticle(node)).to.equal('an');

    node.component.name = 'Apache';
    expect(scope.findArticle(node)).to.equal('an');

    node.component.name = 'mysql';
    expect(scope.findArticle(node)).to.equal('a');

    node.component.name = 'Mysql';
    expect(scope.findArticle(node)).to.equal('a');

    done();
  });


  it('should show an error when components cannot be listed', function(done) {
    whenThings.respond(404);

    expect(scope.error).to.be.false;
    scope.createInstance(scope.rootNode);
    httpBackend.flush();
    expect(scope.error).to.be.true;

    done();
  });


  it('should be able to select an existing instance', function(done) {
    var instances = [
                     {name: 'vm', path: '/vm', component: {name: 'VM'}},
                     {name: 'server', path: '/vm/server', component: {name: 'Tomcat'}}];
    whenThings.respond(instances);

    expect(scope.rootNode).to.not.be.defined;
    expect(scope.mode).to.not.be.defined;
    expect(scope.existingInstances).to.not.be.defined;
    expect(scope.selectedInstance).to.not.be.defined;

    scope.askToSelectInstance();
    httpBackend.flush();

    expect(scope.mode).to.equal('select-instance');
    expect(scope.existingInstances).to.have.length(2);
    expect(scope.selectedInstance).to.not.be.defined;
    expect(scope.rootNode).to.not.be.defined;

    scope.selectedInstance = instances[0];
    scope.$apply();
    scope.selectInstance(true);

    expect(scope.mode).to.not.be.defined;
    expect(scope.selectedInstance).to.not.be.defined;
    expect(scope.existingInstances).to.have.length(2);
    expect(scope.rootNode).to.be.defined;
    expect(scope.rootNode.name).to.equal('vm');
    expect(scope.rootNode.path).to.equal('/vm');
    expect(scope.rootNode.writable).to.not.be.defined;
    expect(scope.rootNode.component.name).to.equal('VM');
    expect(scope.rootNode.children).to.have.length(1);
    expect(scope.rootNode.children[0].name).to.equal('server');
    expect(scope.rootNode.children[0].path).to.equal('/vm/server');
    expect(scope.rootNode.children[0].writable).to.not.be.defined;
    expect(scope.rootNode.children[0].component.name).to.equal('Tomcat');
    expect(scope.rootNode.children[0].children).to.have.length(0);

    done();
  });


  it('should be able to cancel the selection of an existing instance', function(done) {
    var instances = [
                     {name: 'vm', path: '/vm', component: {name: 'VM'}},
                     {name: 'server', path: '/vm/server', component: {name: 'Tomcat'}}];
    whenThings.respond(instances);

    expect(scope.rootNode).to.not.be.defined;
    expect(scope.mode).to.not.be.defined;
    expect(scope.existingInstances).to.not.be.defined;
    expect(scope.selectedInstance).to.not.be.defined;

    scope.askToSelectInstance();
    httpBackend.flush();

    expect(scope.mode).to.equal('select-instance');
    expect(scope.existingInstances).to.have.length(2);
    expect(scope.selectedInstance).to.not.be.defined;
    expect(scope.rootNode).to.not.be.defined;

    scope.selectedInstance = instances[0];
    scope.$apply();
    scope.selectInstance(false);

    expect(scope.mode).to.not.be.defined;
    expect(scope.selectedInstance).to.not.be.defined;
    expect(scope.rootNode).to.not.be.defined;
    expect(scope.existingInstances).to.have.length(2);

    done();
  });


  it('should show an error when instances cannot be listed', function(done) {
    whenThings.respond(404);

    expect(scope.error).to.be.false;
    scope.askToSelectInstance();
    httpBackend.flush();
    expect(scope.error).to.be.true;

    done();
  });


  it('should reset everything when confirmed', function(done) {

    scope.rootNode = {name: 'vm', children: []};
    scope.$apply();

    expect(scope.rootNode).to.be.defined;
    expect(scope.mode).to.not.be.defined;
    scope.askToReset();
    expect(scope.mode).to.equal('reset');
    scope.reset(true);
    expect(scope.rootNode).to.not.be.defined;
    expect(scope.mode).to.not.be.defined;

    done();
  });


  it('should not reset anything when cancelled', function(done) {

    scope.rootNode = {name: 'vm', children: []};
    scope.$apply();

    expect(scope.rootNode).to.be.defined;
    expect(scope.mode).to.not.be.defined;
    scope.askToReset();
    expect(scope.mode).to.equal('reset');
    scope.reset(false);
    expect(scope.rootNode).to.be.defined;
    expect(scope.mode).to.not.be.defined;

    done();
  });


  it('should create instances using the REST API', function(done) {
    httpBackend.when('POST', /.*/g).respond(201);

    var child = {name: 'server', writable: true, component: {name: 'Tomcat'}};
    scope.rootNode = { name: 'vm', component: {name: 'VM'}, writable: true, children: [child]};
    child.parent = scope.rootNode;

    scope.$apply();
    expect(scope.mode).to.not.be.defined;
    scope.createThemAll();
    expect(scope.mode).to.equal('posted');

    httpBackend.flush();
    expect(scope.rootNode.progress).to.equal('ok');
    expect(scope.rootNode.children[0].progress).to.equal('ok');

    done();
  });


  it('should only create writable instances using the REST API', function(done) {
    httpBackend.when('POST', /.*/g).respond(201);

    var child = {name: 'server', writable: true, component: {name: 'Tomcat'}};
    scope.rootNode = { name: 'vm', component: {name: 'VM'}, children: [child]};
    child.parent = scope.rootNode;

    scope.$apply();
    expect(scope.mode).to.not.be.defined;
    scope.createThemAll();
    expect(scope.mode).to.equal('posted');

    httpBackend.flush();
    expect(scope.rootNode.progress).to.be.not.defined;
    expect(scope.rootNode.children[0].progress).to.equal('ok');

    done();
  });


  it('should mark failed creations using the REST API', function(done) {
    httpBackend.when('POST', /.*/g).respond(403);

    var child = {name: 'server', writable: true, component: {name: 'Tomcat'}};
    scope.rootNode = { name: 'vm', component: {name: 'VM'}, writable: true, children: [child]};
    child.parent = scope.rootNode;

    scope.$apply();
    expect(scope.mode).to.not.be.defined;
    scope.createThemAll();
    expect(scope.mode).to.equal('posted');

    httpBackend.flush();
    expect(scope.rootNode.progress).to.equal('ko');
    expect(scope.rootNode.children[0].progress).to.equal('ko');

    done();
  });
});


describe('Instances Controller :: New Instance(s) with initialization', function() {

  beforeEach(module('roboconf.utils'));
  beforeEach(module('roboconf.instances'));

  var scope, httpBackend, whenThings;
  var instances = [
                   {name: 'vm', path: '/vm', component: {name: 'VM'}},
                   {name: 'server', path: '/vm/server', component: {name: 'Tomcat'}}];


  it('should be initializable with an existing instance', function(done) {
    inject(function($controller, $rootScope, $httpBackend, rShare) {
      httpBackend = $httpBackend;
      whenThings = $httpBackend.when('GET', /.*/g);

      scope = $rootScope.$new();
      rShare.feedLastItem(instances[0]);
      $controller('InstancesNewController', {$scope: scope, $routeParams: {appName: 'test'}});
    });

    whenThings.respond(instances);
    httpBackend.flush();

    expect(scope.mode).to.not.be.defined;
    expect(scope.selectedInstance).to.not.be.defined;
    expect(scope.existingInstances).to.have.length(2);
    expect(scope.rootNode).to.be.defined;
    expect(scope.rootNode.name).to.equal('vm');
    expect(scope.rootNode.path).to.equal('/vm');
    expect(scope.rootNode.writable).to.not.be.defined;
    expect(scope.rootNode.component.name).to.equal('VM');
    expect(scope.rootNode.children).to.have.length(1);
    expect(scope.rootNode.children[0].name).to.equal('server');
    expect(scope.rootNode.children[0].path).to.equal('/vm/server');
    expect(scope.rootNode.children[0].writable).to.not.be.defined;
    expect(scope.rootNode.children[0].component.name).to.equal('Tomcat');
    expect(scope.rootNode.children[0].children).to.have.length(0);

    done();
  });


  it('should NOT initialize anything with an invalid item', function(done) {
    inject(function($controller, $rootScope, $httpBackend, rShare) {
      httpBackend = $httpBackend;
      whenThings = $httpBackend.when('GET', /.*/g);

      scope = $rootScope.$new();
      rShare.feedLastItem({not: 'an instance'});
      $controller('InstancesNewController', {$scope: scope, $routeParams: {appName: 'test'}});
    });

    expect(scope.mode).to.not.be.defined;
    expect(scope.selectedInstance).to.not.be.defined;
    expect(scope.existingInstances).to.not.be.defined;
    expect(scope.rootNode).to.not.be.defined;

    done();
  });


  it('should NOT initialize anything with an invalid instance path', function(done) {
    inject(function($controller, $rootScope, $httpBackend, rShare) {
      httpBackend = $httpBackend;
      whenThings = $httpBackend.when('GET', /.*/g);

      scope = $rootScope.$new();
      rShare.feedLastItem({path: '/not/a/known/path'});
      $controller('InstancesNewController', {$scope: scope, $routeParams: {appName: 'test'}});
    });

    whenThings.respond(instances);
    httpBackend.flush();

    expect(scope.mode).to.not.be.defined;
    expect(scope.selectedInstance).to.not.be.defined;
    expect(scope.existingInstances).to.have.length(2);
    expect(scope.rootNode).to.not.be.defined;

    done();
  });
});
