EventEmitter = require 'events'
{ expect, assert } = require 'chai'
sinon = require 'sinon'
Feed = require 'feed'
# httpErrors = require 'http-errors'
LeanRC = require.main.require 'lib'
RC = require '@leansdk/rc/lib'
{
  Facade
  Switch
  AnyT, NilT
  FuncG, MaybeG, InterfaceG, ListG, StructG
  ContextInterface, ResourceInterface, NotificationInterface
  Utils: { co }
} = LeanRC::

describe 'Switch', ->
  describe '.new', ->
    it 'should create new switch mediator', ->
      expect ->
        mediatorName = 'TEST_MEDIATOR'
        switchMediator = Switch.new mediatorName
        assert.isArray switchMediator.middlewares
      .to.not.throw Error
  describe '#responseFormats', ->
    it 'should check allowed response formats', ->
      expect ->
        mediatorName = 'TEST_MEDIATOR'
        switchMediator = Switch.new mediatorName
        assert.deepEqual switchMediator.responseFormats, [
          'json', 'html', 'xml', 'atom', 'text'
        ], 'Property `responseFormats` returns incorrect values'
      .to.not.throw Error
  describe '#listNotificationInterests', ->
    it 'should check handled notifications list', ->
      expect ->
        mediatorName = 'TEST_MEDIATOR'
        switchMediator = Switch.new mediatorName
        assert.deepEqual switchMediator.listNotificationInterests(), [
          LeanRC::HANDLER_RESULT
        ], 'Function `listNotificationInterests` returns incorrect values'
      .to.not.throw Error
  describe '#handleNotification', ->
    it 'should try handle sent notification', ->
      co ->
        mediatorName = 'TEST_MEDIATOR'
        notitficationName = LeanRC::HANDLER_RESULT
        notificationBody = test: 'test'
        notitficationType = 'TEST_TYPE'
        notification = LeanRC::Notification.new notitficationName, notificationBody, notitficationType
        viewComponent = new EventEmitter
        switchMediator = Switch.new mediatorName, viewComponent
        promise = RC::Promise.new (resolve, reject) ->
          viewComponent.once notitficationType, (body) -> resolve body
          return
        switchMediator.handleNotification notification
        body = yield promise
        assert.deepEqual body, notificationBody
        yield return
  describe '#defineRoutes', ->
    facade = null
    afterEach ->
      facade?.remove?()
    it 'should define routes from route proxies', ->
      co ->
        KEY = 'TEST_SWITCH_001'
        facade = Facade.getInstance KEY
        class Test extends LeanRC
          @inheritProtected()
          @initialize()
        class TestRouter extends LeanRC::Router
          @inheritProtected()
          @module Test
          @map ->
            @resource 'test1', ->
              @resource 'test1'
            @namespace 'sub', ->
              @resource 'subtest'
          @initialize()
        facade.registerProxy TestRouter.new 'TEST_SWITCH_ROUTER'
        spyCreateNativeRoute = sinon.spy ->
        class TestSwitch extends Switch
          @inheritProtected()
          @module Test
          @public routerName: String,
            configurable: yes
            default: 'TEST_SWITCH_ROUTER'
          @public createNativeRoute: FuncG([InterfaceG {
            method: String
            path: String
            resource: String
            action: String
            tag: String
            template: String
            keyName: MaybeG String
            entityName: String
            recordName: String
          }], NilT),
            configurable: yes
            default: spyCreateNativeRoute
          @initialize()
        switchMediator = TestSwitch.new 'TEST_SWITCH_MEDIATOR'
        switchMediator.initializeNotifier KEY
        switchMediator.defineRoutes()
        assert.equal spyCreateNativeRoute.callCount, 15, 'Some routes are missing'
        yield return
  describe '#onRegister', ->
    facade = null
    afterEach ->
      facade?.remove?()
    it 'should run register procedure', ->
      expect ->
        KEY = 'TEST_SWITCH_002'
        facade = Facade.getInstance KEY
        class Test extends LeanRC
          @inheritProtected()
          @root "#{__dirname}/config/root"
          @initialize()
        configs = LeanRC::Configuration.new LeanRC::CONFIGURATION, Test::ROOT
        facade.registerProxy configs
        class TestRouter extends LeanRC::Router
          @inheritProtected()
          @module Test
          @initialize()
        facade.registerProxy TestRouter.new LeanRC::APPLICATION_ROUTER
        class TestSwitch extends Switch
          @inheritProtected()
          @module Test
          @public routerName: String,
            default: LeanRC::APPLICATION_ROUTER
          @initialize()
        switchMediator = TestSwitch.new 'TEST_SWITCH_MEDIATOR'
        switchMediator.initializeNotifier KEY
        switchMediator.onRegister()
        assert.instanceOf switchMediator.getViewComponent(), EventEmitter, 'Event emitter did not created'
        switchMediator.onRemove()
      .to.not.throw Error
  describe '#onRemove', ->
    facade = null
    afterEach ->
      facade?.remove?()
    it 'should run remove procedure', ->
      expect ->
        KEY = 'TEST_SWITCH_003'
        facade = Facade.getInstance KEY
        class Test extends LeanRC
          @inheritProtected()
          @root "#{__dirname}/config/root"
          @initialize()
        configs = LeanRC::Configuration.new LeanRC::CONFIGURATION, Test::ROOT
        facade.registerProxy configs
        class TestRouter extends LeanRC::Router
          @inheritProtected()
          @module Test
          @initialize()
        facade.registerProxy TestRouter.new LeanRC::APPLICATION_ROUTER
        class TestSwitch extends Switch
          @inheritProtected()
          @module Test
          @public routerName: String,
            default: LeanRC::APPLICATION_ROUTER
          @initialize()
        switchMediator = TestSwitch.new 'TEST_SWITCH_MEDIATOR'
        switchMediator.initializeNotifier KEY
        switchMediator.onRegister()
        switchMediator.onRemove()
        assert.equal switchMediator.getViewComponent().eventNames().length, 0, 'Event listeners not cleared'
      .to.not.throw Error
  describe '#rendererFor', ->
    facade = null
    afterEach ->
      facade?.remove?()
    it 'should define renderers and get them one by one', ->
      co ->
        KEY = 'TEST_SWITCH_004'
        facade = Facade.getInstance KEY
        class Test extends LeanRC
          @inheritProtected()
          @root "#{__dirname}/config/root"
          @initialize()
        class TestResource extends LeanRC::Resource
          @inheritProtected()
          @module Test
          @public entityName: String,
            default: 'TestEntity'
          @initialize()
        configs = LeanRC::Configuration.new LeanRC::CONFIGURATION, Test::ROOT
        facade.registerProxy configs
        require.main.require('test/integration/renderers') Test
        facade.registerProxy Test::JsonRenderer.new 'TEST_JSON_RENDERER'
        facade.registerProxy Test::HtmlRenderer.new 'TEST_HTML_RENDERER'
        facade.registerProxy Test::XmlRenderer.new 'TEST_XML_RENDERER'
        facade.registerProxy Test::AtomRenderer.new 'TEST_ATOM_RENDERER'
        class TestRouter extends LeanRC::Router
          @inheritProtected()
          @module Test
          @initialize()
        facade.registerProxy TestRouter.new 'TEST_SWITCH_ROUTER'
        class TestSwitch extends Switch
          @inheritProtected()
          @module Test
          @public jsonRendererName: String,
            default: 'TEST_JSON_RENDERER'
          @public htmlRendererName: String,
            default: 'TEST_HTML_RENDERER'
          @public xmlRendererName: String,
            default: 'TEST_XML_RENDERER'
          @public atomRendererName: String,
            default: 'TEST_ATOM_RENDERER'
          @public routerName: String,
            default: 'TEST_SWITCH_ROUTER'
          @initialize()
        facade.registerMediator TestSwitch.new 'TEST_SWITCH_MEDIATOR'
        class MyResponse extends EventEmitter
          _headers: {}
          getHeaders: -> LeanRC::Utils.copy @_headers
          getHeader: (field) -> @_headers[field.toLowerCase()]
          setHeader: (field, value) -> @_headers[field.toLowerCase()] = value
          removeHeader: (field) -> delete @_headers[field.toLowerCase()]
          end: (data, encoding = 'utf-8', callback = ->) ->
            @finished = yes
            @emit 'finish', data?.toString? encoding
            callback()
          constructor: (args...) ->
            super args...
            { @finished, @_headers } = finished: no, _headers: {}
        res = new MyResponse
        req =
          url: 'http://localhost:8888/test1'
          headers: 'x-forwarded-for': '192.168.0.1'
          secure: no
        vhData =
          id: '123'
          title: 'Long story'
          author: name: 'John Doe', email: 'johndoe@example.com'
          description: 'True long story'
          updated: new Date()
        switchMediator = facade.retrieveMediator 'TEST_SWITCH_MEDIATOR'
        ctx = LeanRC::Context.new req, res, switchMediator
        resource = TestResource.new()
        resource.initializeNotifier KEY
        { collectionName } = resource
        class TestsCollection extends LeanRC::Collection
          @inheritProtected()
          @include LeanRC::MemoryCollectionMixin
          @module Test
          @initialize()
        class TestEntityRecord extends LeanRC::Record
          @inheritProtected()
          @module Test
          @attribute test: String
          @public @static findRecordByName: LeanRC::FuncG(String, LeanRC::SubsetG LeanRC::RecordInterface),
            default: (asType) -> TestEntityRecord
          @public init: LeanRC::FuncG([Object, LeanRC::CollectionInterface], LeanRC::NilT),
            default: ->
              @super arguments...
              @type = 'Test::TestEntityRecord'
              return
          @initialize()
        boundCollection = TestsCollection.new collectionName,
          delegate: 'TestEntityRecord'
        facade.registerProxy boundCollection
        jsonRendred = yield switchMediator.rendererFor('json').render ctx, vhData, resource
        assert.equal jsonRendred, JSON.stringify(vhData), 'JSON did not rendered'
        htmlRendered = yield switchMediator.rendererFor('html').render ctx, vhData, resource
        htmlRenderedGauge = '
        <html> <head> <title>Long story</title> </head> <body> <h1>Long story</h1> <p>True long story</p> </body> </html>
        '
        assert.equal htmlRendered, htmlRenderedGauge, 'HTML did not rendered'
        xmlRendered = yield switchMediator.rendererFor('xml').render ctx, vhData, resource
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
        atomRendered = yield switchMediator.rendererFor('atom').render ctx, vhData, resource
        atomRenderedGauge = (new Feed vhData).atom1()
        assert.equal atomRendered, atomRenderedGauge, 'ATOM did not rendered'
        yield return
      # .to.not.throw Error
  describe '#sendHttpResponse', ->
    facade = null
    afterEach ->
      facade?.remove?()
    it 'should send http response', ->
      co ->
        KEY = 'TEST_SWITCH_005'
        facade = Facade.getInstance KEY
        class Test extends LeanRC
          @inheritProtected()
          @root "#{__dirname}/config/root"
          @initialize()
        class TestResource extends LeanRC::Resource
          @inheritProtected()
          @module Test
          @public entityName: String,
            default: 'TestEntity'
          @initialize()
        configs = LeanRC::Configuration.new LeanRC::CONFIGURATION, Test::ROOT
        facade.registerProxy configs
        spyRendererRender = sinon.spy ->
        class TestRenderer extends LeanRC::Renderer
          @inheritProtected()
          @module Test
          @public @async render: FuncG([ContextInterface, AnyT, ResourceInterface, MaybeG InterfaceG {
            method: String
            path: String
            resource: String
            action: String
            tag: String
            template: String
            keyName: MaybeG String
            entityName: String
            recordName: String
          }], MaybeG AnyT),
            default: (ctx, aoData, aoResource, aoOptions) ->
              spyRendererRender ctx, aoData, aoResource, aoOptions
              vhData = RC::Utils.assign {}, aoData
              yield return JSON.stringify vhData ? null
          @initialize()
        facade.registerProxy TestRenderer.new 'TEST_JSON_RENDERER'
        facade.registerProxy TestRenderer.new 'TEST_HTML_RENDERER'
        facade.registerProxy TestRenderer.new 'TEST_XML_RENDERER'
        facade.registerProxy TestRenderer.new 'TEST_ATOM_RENDERER'
        class TestRouter extends LeanRC::Router
          @inheritProtected()
          @module Test
          @initialize()
        spyResponseSet = sinon.spy ->
        # class TestContext extends RC::CoreObject
        #   @inheritProtected()
        #   @module Test
        #   @public headers: Object
        #   @public status: Number
        #   @public format: String
        #   @public accepts: Function,
        #     default: (alFormats = []) ->
        #       @format  if @format in alFormats
        #   @public set: Function,
        #     default: spyResponseSet
        #   @public body: LeanRC::ANY
        #   constructor: (args...) ->
        #     super args...
        #     [@format] = args
        #     @headers = {}
        #     @headers['accept'] = 'application/json'
        #   @initialize()
        facade.registerProxy TestRouter.new 'TEST_SWITCH_ROUTER'
        class TestSwitch extends Switch
          @inheritProtected()
          @module Test
          @public jsonRendererName: String,
            default: 'TEST_JSON_RENDERER'
          @public htmlRendererName: String,
            default: 'TEST_HTML_RENDERER'
          @public xmlRendererName: String,
            default: 'TEST_XML_RENDERER'
          @public atomRendererName: String,
            default: 'TEST_ATOM_RENDERER'
          @public routerName: String,
            default: 'TEST_SWITCH_ROUTER'
          @initialize()
        facade.registerMediator TestSwitch.new 'TEST_SWITCH_MEDIATOR'
        class MyResponse extends EventEmitter
          _headers: {}
          getHeaders: -> LeanRC::Utils.copy @_headers
          getHeader: (field) -> @_headers[field.toLowerCase()]
          setHeader: (field, value) -> @_headers[field.toLowerCase()] = value
          removeHeader: (field) -> delete @_headers[field.toLowerCase()]
          end: (data, encoding = 'utf-8', callback = ->) ->
            @finished = yes
            @emit 'finish', data?.toString? encoding
            callback()
          constructor: (args...) ->
            super args...
            { @finished, @_headers } = finished: no, _headers: {}
        res = new MyResponse
        req =
          url: 'http://localhost:8888/test1'
          headers:
            'x-forwarded-for': '192.168.0.1'
            'accept': 'application/json, text/plain, image/png'
          secure: no
        vhData =
          id: '123'
          title: 'Long story'
          author: name: 'John Doe', email: 'johndoe@example.com'
          description: 'True long story'
          updated: new Date()
        switchMediator = facade.retrieveMediator 'TEST_SWITCH_MEDIATOR'
        ctx = LeanRC::Context.new req, res, switchMediator
        resource = TestResource.new()
        resource.initializeNotifier KEY
        { collectionName } = resource
        class TestsCollection extends LeanRC::Collection
          @inheritProtected()
          @include LeanRC::MemoryCollectionMixin
          @module Test
          @initialize()
        class TestEntityRecord extends LeanRC::Record
          @inheritProtected()
          @module Test
          @attribute test: String
          @public @static findRecordByName: LeanRC::FuncG(String, LeanRC::SubsetG LeanRC::RecordInterface),
            default: (asType) -> TestEntityRecord
          @public init: LeanRC::FuncG([Object, LeanRC::CollectionInterface], LeanRC::NilT),
            default: ->
              @super arguments...
              @type = 'Test::TestEntityRecord'
              return
          @initialize()
        boundCollection = TestsCollection.new collectionName,
          delegate: 'TestEntityRecord'
        facade.registerProxy boundCollection
        renderedGauge = JSON.stringify vhData
        # voContext = TestContext.new 'json'
        vhOptions =
          method: 'GET'
          path: '/test'
          resource: 'test'
          action: 'list'
          tag: ''
          template: 'test/list'
          keyName: null
          entityName: 'test'
          recordName: 'test'
        # voResource = {}
        yield switchMediator.sendHttpResponse ctx, vhData, resource, vhOptions
        assert.isTrue spyRendererRender.calledWith(ctx, vhData, resource, vhOptions), 'Render not called'
        assert.deepEqual ctx.body, renderedGauge
        yield return
  describe '#sender', ->
    facade = null
    afterEach ->
      facade?.remove?()
    it 'should send notification', ->
      expect ->
        KEY = 'TEST_SWITCH_006'
        facade = Facade.getInstance KEY
        class Test extends LeanRC
          @inheritProtected()
          @root "#{__dirname}/config/root"
          @initialize()
        # class TestResource extends LeanRC::Resource
        #   @inheritProtected()
        #   @module Test
        #   @public entityName: String,
        #     default: 'TestEntity'
        #   @initialize()
        configs = LeanRC::Configuration.new LeanRC::CONFIGURATION, Test::ROOT
        facade.registerProxy configs
        class TestRouter extends LeanRC::Router
          @inheritProtected()
          @module Test
          @initialize()
        facade.registerProxy TestRouter.new 'TEST_SWITCH_ROUTER'
        # class AppConfiguration extends LeanRC::Configuration
        #   @inheritProtected()
        #   @module Test
        #   @public defineConfigProperties: Function,
        #     default: ->
        #   @public currentUserCookie: String,
        #     default: 'cuc'
        # AppConfiguration.initialize()
        # facade.registerProxy AppConfiguration.new LeanRC::CONFIGURATION
        class TestSwitch extends Switch
          @inheritProtected()
          @module Test
          @public routerName: String,
            default: 'TEST_SWITCH_ROUTER'
          @initialize()
        facade.registerMediator TestSwitch.new 'TEST_SWITCH_MEDIATOR'
        # switchMediator = TestSwitch.new 'TEST_SWITCH_MEDIATOR'
        class MyResponse extends EventEmitter
          _headers: {}
          getHeaders: -> LeanRC::Utils.copy @_headers
          getHeader: (field) -> @_headers[field.toLowerCase()]
          setHeader: (field, value) -> @_headers[field.toLowerCase()] = value
          removeHeader: (field) -> delete @_headers[field.toLowerCase()]
          end: (data, encoding = 'utf-8', callback = ->) ->
            @finished = yes
            @emit 'finish', data?.toString? encoding
            callback()
          constructor: (args...) ->
            super args...
            { @finished, @_headers } = finished: no, _headers: {}
        res = new MyResponse
        req =
          url: 'http://localhost:8888/test1'
          headers: 'x-forwarded-for': '192.168.0.1'
          secure: no
        switchMediator = facade.retrieveMediator 'TEST_SWITCH_MEDIATOR'
        ctx = LeanRC::Context.new req, res, switchMediator
        # resource = TestResource.new()
        # resource.initializeNotifier KEY
        # switchMediator.initializeNotifier KEY
        spySwitchSendNotification = sinon.spy switchMediator, 'sendNotification'
        vhParams =
          context: ctx
          reverse: 'TEST_REVERSE'
        vhOptions =
          method: 'GET'
          path: '/test'
          resource: 'test'
          action: 'list'
          tag: ''
          template: 'test/list'
          keyName: null
          entityName: 'test'
          recordName: 'test'
        switchMediator.sender 'test', vhParams, vhOptions
        assert.isTrue spySwitchSendNotification.called, 'Notification not sent'
        assert.deepEqual spySwitchSendNotification.args[0], [
          'test'
          {
            context: ctx
            reverse: 'TEST_REVERSE'
          }
          'list'
        ]
      .to.not.throw Error
  # describe '#defineSwaggerEndpoint', ->
  #   it 'should define swagger endpoint', ->
  #     expect ->
  #       RESOURCE = 'test'
  #       facade = Facade.getInstance 'TEST_SWITCH_7'
  #       gateway = LeanRC::Gateway.new "#{RESOURCE}Gateway"
  #       listEndpoint = LeanRC::Endpoint.new { gateway }
  #       listEndpoint.tag 'TAG'
  #       listEndpoint.header 'header', {}, 'test header'
  #       listEndpoint.pathParam 'path-param', {}, 'test path param'
  #       listEndpoint.queryParam 'query-param', {}, 'test query param'
  #       listEndpoint.body {}, ['text/plain'], 'DESCRIPTION'
  #       listEndpoint.response 200, {}, ['text/plain'], 'DESCRIPTION'
  #       listEndpoint.error 500, {}, ['text/plain'], 'DESCRIPTION'
  #       listEndpoint.summary 'TEST_SUMMARY'
  #       listEndpoint.description 'DESCRIPTION'
  #       listEndpoint.deprecated yes
  #       gateway.registerEndpoints list: listEndpoint
  #       facade.registerProxy gateway
  #       class Test extends LeanRC
  #         @inheritProtected()
  #         @root "#{__dirname}/config/root"
  #       Test.initialize()
  #       configs = LeanRC::Configuration.new LeanRC::CONFIGURATION, Test::ROOT
  #       facade.registerProxy configs
  #       class TestRouter extends LeanRC::Router
  #         @inheritProtected()
  #         @module Test
  #       TestRouter.initialize()
  #       facade.registerProxy TestRouter.new 'TEST_SWITCH_ROUTER'
  #       class TestSwitch extends Switch
  #         @inheritProtected()
  #         @module Test
  #         @public routerName: String,
  #           configurable: yes
  #           default: 'TEST_SWITCH_ROUTER'
  #       TestSwitch.initialize()
  #       facade.registerMediator TestSwitch.new 'TEST_SWITCH_MEDIATOR'
  #       switchMediator = facade.retrieveMediator 'TEST_SWITCH_MEDIATOR'
  #       voEndpoint = LeanRC::Endpoint.new { gateway }
  #       switchMediator.defineSwaggerEndpoint voEndpoint, RESOURCE, 'list'
  #       assert.deepEqual listEndpoint, voEndpoint, 'Endpoints are not equivalent'
  #       facade.remove()
  #     .to.not.throw Error
  describe '.compose', ->
    facade = null
    afterEach ->
      facade?.remove?()
    it 'should dispatch middlewares', ->
      co ->
        KEY = 'TEST_SWITCH_008'
        facade = Facade.getInstance KEY
        class Test extends LeanRC
          @inheritProtected()
          @root "#{__dirname}/config/root"
          @initialize()
        configs = LeanRC::Configuration.new LeanRC::CONFIGURATION, Test::ROOT
        facade.registerProxy configs
        class TestRouter extends LeanRC::Router
          @inheritProtected()
          @module Test
          @initialize()
        facade.registerProxy TestRouter.new 'TEST_SWITCH_ROUTER'
        class TestSwitch extends Switch
          @inheritProtected()
          @module Test
          @public routerName: String,
            configurable: yes
            default: 'TEST_SWITCH_ROUTER'
          @initialize()
        facade.registerMediator TestSwitch.new 'TEST_SWITCH_MEDIATOR'
        switchMediator = facade.retrieveMediator 'TEST_SWITCH_MEDIATOR'
        class MyResponse extends EventEmitter
          _headers: {}
          getHeaders: -> LeanRC::Utils.copy @_headers
          getHeader: (field) -> @_headers[field.toLowerCase()]
          setHeader: (field, value) -> @_headers[field.toLowerCase()] = value
          removeHeader: (field) -> delete @_headers[field.toLowerCase()]
          end: (data, encoding = 'utf-8', callback = ->) ->
            @finished = yes
            @emit 'finish', data?.toString? encoding
            callback()
          constructor: (args...) ->
            super args...
            { @finished, @_headers } = finished: no, _headers: {}
        res = new MyResponse
        req =
          url: 'http://localhost:8888'
          headers: 'x-forwarded-for': '192.168.0.1'
        # res =
        #   _headers: {}
        voContext = Test::Context.new req, res, switchMediator
        middlewares = []
        handlers = [[]]
        COUNT = 4
        for i in [ 0 .. COUNT ]
          handlers[0].push sinon.spy (ctx) -> yield return
        fn = TestSwitch.compose middlewares, handlers
        yield fn voContext
        for i in [ 0 .. COUNT ]
          assert.isTrue handlers[0][i].calledWith voContext
        yield return
  describe '.respond', ->
    facade = null
    afterEach ->
      facade?.remove?()
    it 'should run responding request handler', ->
      co ->
        KEY = 'TEST_SWITCH_009'
        trigger = new EventEmitter
        facade = Facade.getInstance KEY
        class Test extends LeanRC
          @inheritProtected()
          @root "#{__dirname}/config/root"
          @initialize()
        configs = LeanRC::Configuration.new LeanRC::CONFIGURATION, Test::ROOT
        facade.registerProxy configs
        class TestRouter extends LeanRC::Router
          @inheritProtected()
          @module Test
          @initialize()
        facade.registerProxy TestRouter.new 'TEST_SWITCH_ROUTER'
        class TestSwitch extends Switch
          @inheritProtected()
          @module Test
          @public routerName: String,
            configurable: yes
            default: 'TEST_SWITCH_ROUTER'
          @initialize()
        facade.registerMediator TestSwitch.new 'TEST_SWITCH_MEDIATOR'
        switchMediator = facade.retrieveMediator 'TEST_SWITCH_MEDIATOR'
        class MyResponse extends EventEmitter
          _headers: {}
          getHeaders: -> LeanRC::Utils.copy @_headers
          getHeader: (field) -> @_headers[field.toLowerCase()]
          setHeader: (field, value) -> @_headers[field.toLowerCase()] = value
          removeHeader: (field) -> delete @_headers[field.toLowerCase()]
          end: (data, encoding = 'utf-8', callback = ->) ->
            trigger.emit 'end', data
            # @finished = yes
            # @emit 'finish', data?.toString? encoding
            # callback()
          constructor: (args...) ->
            super args...
            { @finished, @_headers } = finished: no, _headers: {}
        res = new MyResponse
        req =
          method: 'POST'
          url: 'http://localhost:8888'
          headers: 'x-forwarded-for': '192.168.0.1'
        # res =
        #   _headers: {}
        #   getHeaders: -> LeanRC::Utils.copy @_headers
        #   getHeader: (field) -> @_headers[field.toLowerCase()]
        #   setHeader: (field, value) -> @_headers[field.toLowerCase()] = value
        #   removeHeader: (field) -> delete @_headers[field.toLowerCase()]
        #   end: (data) -> trigger.emit 'end', data
        voContext = Test::Context.new req, res, switchMediator
        endPromise = LeanRC::Promise.new (resolve) -> trigger.once 'end', resolve
        voContext.status = 201
        switchMediator.respond voContext
        data = yield endPromise
        assert.equal data, 'Created'
        assert.equal voContext.status, 201
        assert.equal voContext.message, 'Created'
        assert.equal voContext.length, 7
        assert.equal voContext.type, 'text/plain'
        req =
          method: 'GET'
          url: 'http://localhost:8888'
          headers: 'x-forwarded-for': '192.168.0.1'
        # res =
        #   _headers: {}
        #   getHeaders: -> LeanRC::Utils.copy @_headers
        #   getHeader: (field) -> @_headers[field.toLowerCase()]
        #   setHeader: (field, value) -> @_headers[field.toLowerCase()] = value
        #   removeHeader: (field) -> delete @_headers[field.toLowerCase()]
        #   end: (data) -> trigger.emit 'end', data
        voContext = Test::Context.new req, res, switchMediator
        endPromise = LeanRC::Promise.new (resolve) -> trigger.once 'end', resolve
        voContext.body = data: 'data'
        switchMediator.respond voContext
        data = yield endPromise
        assert.equal data, '{"data":"data"}'
        assert.equal voContext.status, 200
        assert.equal voContext.message, 'OK'
        assert.equal voContext.length, 15
        assert.equal voContext.type, 'application/json'
        yield return
  describe '#callback', ->
    facade = null
    afterEach ->
      facade?.remove?()
    it 'should run request handler', ->
      co ->
        KEY = 'TEST_SWITCH_010'
        facade = Facade.getInstance KEY
        class Test extends LeanRC
          @inheritProtected()
          @root "#{__dirname}/config/root"
          @initialize()
        configs = LeanRC::Configuration.new LeanRC::CONFIGURATION, Test::ROOT
        facade.registerProxy configs
        class TestRouter extends LeanRC::Router
          @inheritProtected()
          @module Test
          @initialize()
        facade.registerProxy TestRouter.new 'TEST_SWITCH_ROUTER'
        class TestSwitch extends Switch
          @inheritProtected()
          @module Test
          @public routerName: String,
            configurable: yes
            default: 'TEST_SWITCH_ROUTER'
          @initialize()
        facade.registerMediator TestSwitch.new 'TEST_SWITCH_MEDIATOR'
        switchMediator = facade.retrieveMediator 'TEST_SWITCH_MEDIATOR'
        class MyResponse extends EventEmitter
          _headers: {}
          getHeaders: -> LeanRC::Utils.copy @_headers
          getHeader: (field) -> @_headers[field.toLowerCase()]
          setHeader: (field, value) -> @_headers[field.toLowerCase()] = value
          removeHeader: (field) -> delete @_headers[field.toLowerCase()]
          end: (data, encoding = 'utf-8', callback = ->) ->
            @finished = yes
            @emit 'finish', data?.toString? encoding
            callback()
          constructor: (args...) ->
            super args...
            @finished = no
            @_headers = {}
        req =
          method: 'GET'
          url: 'http://localhost:8888'
          headers: 'x-forwarded-for': '192.168.0.1'
        res = new MyResponse
        switchMediator.middlewares = []
        switchMediator.middlewares.push (ctx) ->
          ctx.body = Buffer.from JSON.stringify data: 'data'
          yield return
        endPromise = LeanRC::Promise.new (resolve) -> res.once 'finish', resolve
        yield switchMediator.callback() req, res
        data = yield endPromise
        assert.equal data, '{"data":"data"}'
        res = new MyResponse
        switchMediator.middlewares.push (ctx) ->
          ctx.throw 404
          yield return
        endPromise = LeanRC::Promise.new (resolve) -> res.once 'finish', resolve
        yield switchMediator.callback() req, res
        data = yield endPromise
        parsedData = (try JSON.parse data ? null) ? {}
        assert.propertyVal parsedData, 'code', 'Not Found'
        res = new MyResponse
        switchMediator.middlewares = []
        switchMediator.middlewares.push (ctx) ->
          return ctx.res.emit 'error', new Error 'TEST'
          yield return
        endPromise = LeanRC::Promise.new (resolve) -> res.once 'finish', resolve
        yield switchMediator.callback() req, res
        data = yield endPromise
        yield return
  describe '#use', ->
    facade = null
    afterEach ->
      facade?.remove?()
    it 'should append middlewares', ->
      co ->
        KEY = 'TEST_SWITCH_011'
        trigger = new EventEmitter
        facade = Facade.getInstance KEY
        class Test extends LeanRC
          @inheritProtected()
          @root "#{__dirname}/config/root"
        Test.initialize()
        configs = LeanRC::Configuration.new LeanRC::CONFIGURATION, Test::ROOT
        facade.registerProxy configs
        class TestRouter extends LeanRC::Router
          @inheritProtected()
          @module Test
        TestRouter.initialize()
        facade.registerProxy TestRouter.new 'TEST_SWITCH_ROUTER'
        class TestSwitch extends Switch
          @inheritProtected()
          @module Test
          @public routerName: String,
            configurable: yes
            default: 'TEST_SWITCH_ROUTER'
        TestSwitch.initialize()
        class TestLogCommand extends LeanRC::SimpleCommand
          @inheritProtected()
          @module Test
          @public execute: FuncG(NotificationInterface, NilT),
            default: (aoNotification) ->
              trigger.emit 'log', aoNotification
              return
        TestLogCommand.initialize()
        compareMiddlewares = (original, used) ->
          if used.__generatorFunction__?
            assert.equal used.__generatorFunction__, original
          else
            assert.equal used, original
        facade.registerMediator TestSwitch.new 'TEST_SWITCH_MEDIATOR'
        switchMediator = facade.retrieveMediator 'TEST_SWITCH_MEDIATOR'
        facade.registerCommand Test::LogMessage.SEND_TO_LOG, TestLogCommand
        promise = LeanRC::Promise.new (resolve) -> trigger.once 'log', resolve
        testMiddlewareFirst = (ctx) -> yield return
        middlewaresCount = switchMediator.middlewares.length
        switchMediator.use testMiddlewareFirst
        notification = yield promise
        assert.lengthOf switchMediator.middlewares, middlewaresCount + 1
        assert.equal notification.getBody(), 'use testMiddlewareFirst'
        usedMiddleware = switchMediator.middlewares[middlewaresCount]
        compareMiddlewares testMiddlewareFirst, usedMiddleware
        promise = LeanRC::Promise.new (resolve) -> trigger.once 'log', resolve
        testMiddlewareSecond = (ctx) -> return
        middlewaresCount = switchMediator.middlewares.length
        switchMediator.use testMiddlewareSecond
        notification = yield promise
        assert.lengthOf switchMediator.middlewares, middlewaresCount + 1
        assert.equal notification.getBody(), 'use testMiddlewareSecond'
        usedMiddleware = switchMediator.middlewares[middlewaresCount]
        compareMiddlewares testMiddlewareSecond, usedMiddleware
        yield return
  describe '#onerror', ->
    facade = null
    afterEach ->
      facade?.remove?()
    it 'should handle error', ->
      co ->
        KEY = 'TEST_SWITCH_012'
        trigger = new EventEmitter
        facade = Facade.getInstance KEY
        class Test extends LeanRC
          @inheritProtected()
          @root "#{__dirname}/config/root"
        Test.initialize()
        configs = LeanRC::Configuration.new LeanRC::CONFIGURATION, Test::ROOT
        facade.registerProxy configs
        class TestRouter extends LeanRC::Router
          @inheritProtected()
          @module Test
        TestRouter.initialize()
        facade.registerProxy TestRouter.new 'TEST_SWITCH_ROUTER'
        class TestSwitch extends Switch
          @inheritProtected()
          @module Test
          @public routerName: String,
            configurable: yes
            default: 'TEST_SWITCH_ROUTER'
        TestSwitch.initialize()
        class TestLogCommand extends LeanRC::SimpleCommand
          @inheritProtected()
          @module Test
          @public execute: FuncG(NotificationInterface, NilT),
            default: (aoNotification) ->
              trigger.emit 'log', aoNotification
              return
        TestLogCommand.initialize()
        facade.registerMediator TestSwitch.new 'TEST_SWITCH_MEDIATOR'
        switchMediator = facade.retrieveMediator 'TEST_SWITCH_MEDIATOR'
        facade.registerCommand Test::LogMessage.SEND_TO_LOG, TestLogCommand
        promise = LeanRC::Promise.new (resolve) -> trigger.once 'log', resolve
        switchMediator.onerror new Error 'TEST_ERROR'
        message = yield promise
        assert.equal message.getName(), Test::LogMessage.SEND_TO_LOG
        assert.include message.getBody(), 'TEST_ERROR'
        assert.equal message.getType(), Test::LogMessage.LEVELS[Test::LogMessage.ERROR]
        yield return
  describe '#del', ->
    facade = null
    afterEach ->
      facade?.remove?()
    it 'should alias to #delete', ->
      co ->
        KEY = 'TEST_SWITCH_013'
        spyDelete = sinon.spy ->
        facade = Facade.getInstance KEY
        class Test extends LeanRC
          @inheritProtected()
          @root "#{__dirname}/config/root"
        Test.initialize()
        configs = LeanRC::Configuration.new LeanRC::CONFIGURATION, Test::ROOT
        facade.registerProxy configs
        class TestRouter extends LeanRC::Router
          @inheritProtected()
          @module Test
        TestRouter.initialize()
        facade.registerProxy TestRouter.new 'TEST_SWITCH_ROUTER'
        class TestSwitch extends Switch
          @inheritProtected()
          @module Test
          @public routerName: String,
            configurable: yes
            default: 'TEST_SWITCH_ROUTER'
          @public delete: FuncG([String, Function], NilT), { default: spyDelete }
        TestSwitch.initialize()
        facade.registerMediator TestSwitch.new 'TEST_SWITCH_MEDIATOR'
        switchMediator = facade.retrieveMediator 'TEST_SWITCH_MEDIATOR'
        switchMediator.del 'TEST', (->)
        assert.isTrue spyDelete.calledWith 'TEST'
        yield return
  describe '#createMethod', ->
    facade = null
    afterEach ->
      facade?.remove?()
    it 'should create method handler', ->
      co ->
        KEY = 'TEST_SWITCH_014'
        trigger = new EventEmitter
        facade = Facade.getInstance KEY
        class Test extends LeanRC
          @inheritProtected()
          @root "#{__dirname}/config/root"
        Test.initialize()
        configs = LeanRC::Configuration.new LeanRC::CONFIGURATION, Test::ROOT
        facade.registerProxy configs
        class TestRouter extends LeanRC::Router
          @inheritProtected()
          @module Test
        TestRouter.initialize()
        facade.registerProxy TestRouter.new 'TEST_SWITCH_ROUTER'
        class TestSwitch extends Switch
          @inheritProtected()
          @module Test
          @public routerName: String,
            configurable: yes
            default: 'TEST_SWITCH_ROUTER'
          @createMethod 'get'
        TestSwitch.initialize()
        facade.registerMediator TestSwitch.new 'TEST_SWITCH_MEDIATOR'
        switchMediator = facade.retrieveMediator 'TEST_SWITCH_MEDIATOR'
        assert.isFunction switchMediator.get.body
        keyCount = 1
        handlerIndex = 0
        spyMethod = sinon.spy ->
        switchMediator.get '/test/:id', (ctx) ->
          spyMethod JSON.stringify ctx.pathParams
          yield return
        assert.isDefined switchMediator.handlers[keyCount][handlerIndex]
        class MyResponse extends EventEmitter
          _headers: {}
          getHeaders: -> LeanRC::Utils.copy @_headers
          getHeader: (field) -> @_headers[field.toLowerCase()]
          setHeader: (field, value) -> @_headers[field.toLowerCase()] = value
          removeHeader: (field) -> delete @_headers[field.toLowerCase()]
          end: (data, encoding = 'utf-8', callback = ->) ->
            @finished = yes
            @emit 'finish', data?.toString? encoding
            callback()
          constructor: (args...) ->
            super args...
            @finished = no
            @_headers = {}
        req =
          method: 'GET'
          url: 'http://localhost:8888/test2'
          headers: 'x-forwarded-for': '192.168.0.1'
        res = new MyResponse
        voContext = Test::Context.new req, res, switchMediator
        promise = LeanRC::Promise.new (resolve) -> res.once 'finish', resolve
        yield switchMediator.handlers[keyCount][handlerIndex] voContext
        res.end()
        yield promise
        assert.isFalse spyMethod.called
        spyMethod.reset()
        req =
          method: 'GET'
          url: 'http://localhost:8888/test/123'
          headers: 'x-forwarded-for': '192.168.0.1'
        res = new MyResponse
        voContext = Test::Context.new req, res, switchMediator
        promise = LeanRC::Promise.new (resolve) -> res.once 'finish', resolve
        yield switchMediator.handlers[keyCount][handlerIndex] voContext
        res.end()
        yield promise
        assert.isTrue spyMethod.calledWith '{"id":"123"}'
        yield return
  describe '#createNativeRoute', ->
    facade = null
    afterEach ->
      facade?.remove?()
    it 'should create method handler', ->
      co ->
        KEY = 'TEST_SWITCH_015'
        trigger = new EventEmitter
        facade = Facade.getInstance KEY
        class Test extends LeanRC
          @inheritProtected()
          @root "#{__dirname}/config/root"
          @initialize()
        configs = LeanRC::Configuration.new LeanRC::CONFIGURATION, Test::ROOT
        facade.registerProxy configs
        class TestResque extends LeanRC::Resque
          @inheritProtected()
          @module Test
          @public jobs: Object, { default: {} }
          @public @async getDelayed: FuncG([], ListG StructG {
            queueName: String
            scriptName: String
            data: AnyT
            delay: MaybeG Number
            id: String
          }),
            default: ->
              yield return []
          @public init: Function,
            default: (args...) ->
              @super args...
              @jobs = {}
          @initialize()
        resque = TestResque.new LeanRC::RESQUE, data: []
        facade.registerProxy resque
        class TestRouter extends LeanRC::Router
          @inheritProtected()
          @module Test
          @initialize()
        spyTestAction = sinon.spy -> yield return yes
        class TestResource extends LeanRC::Resource
          @inheritProtected()
          @module Test
          @public entityName: String,
            default: 'TestEntity'
          @action test: Function, { default: spyTestAction }
          @initialize()
        facade.registerProxy TestRouter.new 'TEST_SWITCH_ROUTER'
        class TestSwitch extends Switch
          @inheritProtected()
          @module Test
          @public routerName: String,
            configurable: yes
            default: 'TEST_SWITCH_ROUTER'
          @createMethod 'get'
          @initialize()
        facade.registerCommand 'TestResource', TestResource
        # { collectionName } = resource
        collectionName = "TestEntitiesCollection"
        class TestsCollection extends LeanRC::Collection
          @inheritProtected()
          @include LeanRC::MemoryCollectionMixin
          @module Test
          @initialize()
        class TestEntityRecord extends LeanRC::Record
          @inheritProtected()
          @module Test
          @attribute test: String
          @public @static findRecordByName: LeanRC::FuncG(String, LeanRC::SubsetG LeanRC::RecordInterface),
            default: (asType) -> TestEntityRecord
          @public init: LeanRC::FuncG([Object, LeanRC::CollectionInterface], LeanRC::NilT),
            default: ->
              @super arguments...
              @type = 'Test::TestEntityRecord'
              return
          @initialize()
        boundCollection = TestsCollection.new collectionName,
          delegate: 'TestEntityRecord'
        facade.registerProxy boundCollection
        facade.registerMediator TestSwitch.new 'TEST_SWITCH_MEDIATOR'
        switchMediator = facade.retrieveMediator 'TEST_SWITCH_MEDIATOR'
        voRouter = facade.retrieveProxy switchMediator.routerName
        voRouter.get '/test/:id', resource: 'test', action: 'test'
        keyCount = 1
        handlerIndex = 0
        switchMediator.createNativeRoute voRouter.routes[0]
        class MyResponse extends EventEmitter
          _headers: {}
          getHeaders: -> LeanRC::Utils.copy @_headers
          getHeader: (field) -> @_headers[field.toLowerCase()]
          setHeader: (field, value) -> @_headers[field.toLowerCase()] = value
          removeHeader: (field) -> delete @_headers[field.toLowerCase()]
          end: (data, encoding = 'utf-8', callback = ->) ->
            @finished = yes
            @emit 'finish', data?.toString? encoding
            callback()
          constructor: (args...) ->
            super args...
            @finished = no
            @_headers = {}
        req =
          method: 'GET'
          url: 'http://localhost:8888/test/123'
          headers: 'x-forwarded-for': '192.168.0.1'
        res = new MyResponse
        voContext = Test::Context.new req, res, switchMediator
        facade.registerMediator LeanRC::Mediator.new LeanRC::APPLICATION_MEDIATOR,
          context: voContext
        promise = LeanRC::Promise.new (resolve) -> res.once 'finish', resolve
        yield switchMediator.handlers[keyCount][handlerIndex] voContext
        res.end()
        yield promise
        assert.isTrue spyTestAction.calledWith voContext
        yield return
  describe '#serverListen', ->
    facade = null
    afterEach ->
      facade?.remove?()
    it 'should create HTTP server', ->
      co ->
        KEY = 'TEST_SWITCH_016'
        trigger = new EventEmitter
        facade = Facade.getInstance KEY
        class Test extends LeanRC
          @inheritProtected()
          @root "#{__dirname}/config/root"
          @initialize()
        configs = LeanRC::Configuration.new LeanRC::CONFIGURATION, Test::ROOT
        facade.registerProxy configs
        class TestResque extends LeanRC::Resque
          @inheritProtected()
          @module Test
          @public jobs: Object, { default: {} }
          @public @async getDelayed: FuncG([], ListG StructG {
            queueName: String
            scriptName: String
            data: AnyT
            delay: MaybeG Number
            id: String
          }),
            default: ->
              yield return []
          @public init: Function,
            default: (args...) ->
              @super args...
              @jobs = {}
          @initialize()
        resque = TestResque.new LeanRC::RESQUE, data: []
        facade.registerProxy resque
        class TestRouter extends LeanRC::Router
          @inheritProtected()
          @module Test
          @initialize()
        # spyTestAction = sinon.spy (ctx) ->
        #   ctx.body = 'TEST'
        #   yield return
        class TestResource extends LeanRC::Resource
          @inheritProtected()
          @module Test
          @public entityName: String,
            default: 'TestEntity'
          @action test: Function,
            default: (ctx) -> yield return test: 'TEST'
          @initialize()
        facade.registerProxy TestRouter.new 'TEST_SWITCH_ROUTER'
        class TestSwitch extends Switch
          @inheritProtected()
          @module Test
          @public routerName: String,
            configurable: yes
            default: 'TEST_SWITCH_ROUTER'
          @createMethod 'get'
          @public jsonRendererName: String,
            default: Test::APPLICATION_RENDERER
          @initialize()
        class TestLogCommand extends LeanRC::SimpleCommand
          @inheritProtected()
          @module Test
          @public execute: FuncG(NotificationInterface, NilT),
            default: (aoNotification) ->
              trigger.emit 'log', aoNotification
              return
          @initialize()
        class TestRenderer extends LeanRC::Renderer
          @inheritProtected()
          @module Test
          @public @async render: FuncG([ContextInterface, AnyT, ResourceInterface, MaybeG InterfaceG {
            method: String
            path: String
            resource: String
            action: String
            tag: String
            template: String
            keyName: MaybeG String
            entityName: String
            recordName: String
          }], MaybeG AnyT),
            default: (ctx, aoData, aoResource, aoOptions) ->
              vhData = RC::Utils.assign {}, aoData
              yield return JSON.stringify vhData ? null
          @initialize()
        collectionName = "TestEntitiesCollection"
        class TestsCollection extends LeanRC::Collection
          @inheritProtected()
          @include LeanRC::MemoryCollectionMixin
          @module Test
          @initialize()
        class TestEntityRecord extends LeanRC::Record
          @inheritProtected()
          @module Test
          @attribute test: String
          @public @static findRecordByName: LeanRC::FuncG(String, LeanRC::SubsetG LeanRC::RecordInterface),
            default: (asType) -> TestEntityRecord
          @public init: LeanRC::FuncG([Object, LeanRC::CollectionInterface], LeanRC::NilT),
            default: ->
              @super arguments...
              @type = 'Test::TestEntityRecord'
              return
          @initialize()
        boundCollection = TestsCollection.new collectionName,
          delegate: 'TestEntityRecord'
        facade.registerProxy boundCollection
        facade.registerProxy TestRenderer.new Test::APPLICATION_RENDERER
        facade.registerCommand Test::LogMessage.SEND_TO_LOG, TestLogCommand
        facade.registerCommand 'TestResource', TestResource
        result = yield LeanRC::Utils.request.get 'http://localhost:8888/test/123'
        assert.equal result.status, 500
        assert.equal result.message, 'connect ECONNREFUSED 127.0.0.1:8888'
        facade.registerMediator TestSwitch.new 'TEST_SWITCH_MEDIATOR'
        switchMediator = facade.retrieveMediator 'TEST_SWITCH_MEDIATOR'
        voRouter = facade.retrieveProxy switchMediator.routerName
        voRouter.get '/test/:id', resource: 'test', action: 'test'
        switchMediator.createNativeRoute voRouter.routes[0]
        facade.registerMediator LeanRC::Mediator.new LeanRC::APPLICATION_MEDIATOR,
          context: {}
        result = yield LeanRC::Utils.request.get 'http://localhost:8888/test/123'
        assert.equal result.status, 200
        assert.equal result.message, 'OK'
        assert.equal result.body, '{"test":"TEST"}'
        facade.remove()
        result = yield LeanRC::Utils.request.get 'http://localhost:8888/test/123'
        assert.equal result.status, 500
        assert.equal result.message, 'connect ECONNREFUSED 127.0.0.1:8888'
        yield return
