EventEmitter = require 'events'
{ expect, assert } = require 'chai'
sinon = require 'sinon'
Feed = require 'feed'
LeanRC = require.main.require 'lib'
RC = require 'RC'
Facade = LeanRC::Facade
Switch = LeanRC::Switch

describe 'Switch', ->
  describe '.new', ->
    it 'should create new switch mediator', ->
      expect ->
        mediatorName = 'TEST_MEDIATOR'
        switchMediator = Switch.new mediatorName
      .to.not.throw Error
  describe '#responseFormats', ->
    it 'should check allowed response formats', ->
      expect ->
        mediatorName = 'TEST_MEDIATOR'
        switchMediator = Switch.new mediatorName
        assert.deepEqual switchMediator.responseFormats, [
          'json', 'html', 'xml', 'atom'
        ], 'Property `responseFormats` returns incorrect values'
      .to.not.throw Error
  describe '#listNotificationInterests', ->
    it 'should check handled notifications list', ->
      expect ->
        mediatorName = 'TEST_MEDIATOR'
        switchMediator = Switch.new mediatorName
        assert.deepEqual switchMediator.listNotificationInterests(), [
          LeanRC::Constants.HANDLER_RESULT
        ], 'Function `listNotificationInterests` returns incorrect values'
      .to.not.throw Error
  describe '#defineRoutes', ->
    it 'should define routes from route proxies', ->
      expect ->
        facade = Facade.getInstance 'TEST_SWITCH_1'
        class Test extends RC::Module
        class Test::TestRouter extends LeanRC::Router
          @inheritProtected()
          @Module: Test
          @map ->
            @resource 'test1', ->
              @resource 'test1'
            @namespace 'sub', ->
              @resource 'subtest'
        Test::TestRouter.initialize()
        facade.registerProxy Test::TestRouter.new 'TEST_SWITCH_ROUTER'
        spyCreateNativeRoute = sinon.spy ->
        class Test::TestSwitch extends Switch
          @inheritProtected()
          @Module: Test
          @public routerName: String,
            configurable: yes
            default: 'TEST_SWITCH_ROUTER'
          @public createNativeRoute: Function,
            configurable: yes
            default: spyCreateNativeRoute
        Test::TestSwitch.initialize()
        switchMediator = Test::TestSwitch.new 'TEST_SWITCH_MEDIATOR'
        switchMediator.initializeNotifier 'TEST_SWITCH_1'
        switchMediator.defineRoutes()
        assert.equal spyCreateNativeRoute.callCount, 18, 'Some routes are missing'
      .to.not.throw Error
  describe '#onRegister', ->
    it 'should run register procedure', ->
      expect ->
        facade = Facade.getInstance 'TEST_SWITCH_2'
        class Test extends RC::Module
        class Test::TestRouter extends LeanRC::Router
          @inheritProtected()
          @Module: Test
        Test::TestRouter.initialize()
        facade.registerProxy Test::TestRouter.new 'TEST_SWITCH_ROUTER'
        class Test::TestSwitch extends Switch
          @inheritProtected()
          @Module: Test
          @public routerName: String,
            configurable: yes
            default: 'TEST_SWITCH_ROUTER'
          @public createNativeRoute: Function,
            configurable: yes
            default: ->
        Test::TestSwitch.initialize()
        switchMediator = Test::TestSwitch.new 'TEST_SWITCH_MEDIATOR'
        switchMediator.initializeNotifier 'TEST_SWITCH_1'
        switchMediator.onRegister()
        assert.instanceOf switchMediator.getViewComponent(), EventEmitter, 'Event emitter did not created'
      .to.not.throw Error
  describe '#onRemove', ->
    it 'should run remove procedure', ->
      expect ->
        facade = Facade.getInstance 'TEST_SWITCH_3'
        class Test extends RC::Module
        class Test::TestRouter extends LeanRC::Router
          @inheritProtected()
          @Module: Test
        Test::TestRouter.initialize()
        facade.registerProxy Test::TestRouter.new 'TEST_SWITCH_ROUTER'
        class Test::TestSwitch extends Switch
          @inheritProtected()
          @Module: Test
          @public routerName: String,
            configurable: yes
            default: 'TEST_SWITCH_ROUTER'
          @public createNativeRoute: Function,
            configurable: yes
            default: ->
        Test::TestSwitch.initialize()
        switchMediator = Test::TestSwitch.new 'TEST_SWITCH_MEDIATOR'
        switchMediator.initializeNotifier 'TEST_SWITCH_1'
        switchMediator.onRegister()
        switchMediator.onRemove()
        assert.equal switchMediator.getViewComponent().eventNames().length, 0, 'Event listeners not cleared'
      .to.not.throw Error
  describe '#rendererFor', ->
    it 'should define renderers and get them one by one', ->
      expect ->
        facade = Facade.getInstance 'TEST_SWITCH_4'
        class Test extends RC::Module
        require.main.require('test/integration/renderers') Test
        facade.registerProxy Test::JsonRenderer.new 'TEST_JSON_RENDERER'
        facade.registerProxy Test::HtmlRenderer.new 'TEST_HEML_RENDERER'
        facade.registerProxy Test::XmlRenderer.new 'TEST_XML_RENDERER'
        facade.registerProxy Test::AtomRenderer.new 'TEST_ATOM_RENDERER'
        class Test::TestRouter extends LeanRC::Router
          @inheritProtected()
          @Module: Test
        Test::TestRouter.initialize()
        facade.registerProxy Test::TestRouter.new 'TEST_SWITCH_ROUTER'
        class Test::TestSwitch extends Switch
          @inheritProtected()
          @Module: Test
          @public jsonRendererName: String,
            default: 'TEST_JSON_RENDERER'
          @public htmlRendererName: String,
            default: 'TEST_HEML_RENDERER'
          @public xmlRendererName: String,
            default: 'TEST_XML_RENDERER'
          @public atomRendererName: String,
            default: 'TEST_ATOM_RENDERER'
          @public routerName: String,
            default: 'TEST_SWITCH_ROUTER'
          @public createNativeRoute: Function,
            default: ->
        Test::TestSwitch.initialize()
        facade.registerMediator Test::TestSwitch.new 'TEST_SWITCH_MEDIATOR'
        vhData =
          id: '123'
          title: 'Long story'
          author: name: 'John Doe', email: 'johndoe@example.com'
          description: 'True long story'
          updated: new Date()
        switchMediator = facade.retrieveMediator 'TEST_SWITCH_MEDIATOR'
        jsonRendred = switchMediator.rendererFor('json').render vhData
        assert.equal jsonRendred, JSON.stringify(vhData), 'JSON did not rendered'
        htmlRendered = switchMediator.rendererFor('html').render vhData
        htmlRenderedGauge = '
        <html> <head> <title>Long story</title> </head> <body> <h1>Long story</h1> <p>True long story</p> </body> </html>
        '
        assert.equal htmlRendered, htmlRenderedGauge, 'HTML did not rendered'
        xmlRendered = switchMediator.rendererFor('xml').render vhData
        xmlRenderedGauge = '''<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<root>
  <id>123</id>
  <title>Long story</title>
  <author>
    <name>John Doe</name>
    <email>johndoe@example.com</email>
  </author>
  <description>True long story</description>
  <updated/>
</root>'''
        assert.equal xmlRendered, xmlRenderedGauge, 'XML did not rendered'
        atomRendered = switchMediator.rendererFor('atom').render vhData
        atomRenderedGauge = (new Feed vhData).atom1()
        assert.equal atomRendered, atomRenderedGauge, 'ATOM did not rendered'
      .to.not.throw Error
