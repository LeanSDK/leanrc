{ expect, assert } = require 'chai'
sinon = require 'sinon'
RC = require '@leansdk/rc/lib'
LeanRC = require.main.require 'lib'
{
  AnyT
  FuncG, MaybeG, InterfaceG, ListG, DictG
  ContextInterface, ResourceInterface
  Utils: { _, co, map, assign }
} = LeanRC::


describe 'Renderer', ->
  describe '.new', ->
    it 'should create renderer instance', ->
      expect ->
        renderer = LeanRC::Renderer.new 'TEST_RENDERER'
      .to.not.throw Error
  ### Moved to TemplatableModuleMixin
  describe '#templatesDir', ->
    it 'should get templates directory', ->
      expect ->
        KEY = 'TEST_RENDERER_001'
        facade = LeanRC::Facade.getInstance KEY
        class Test extends LeanRC
          @inheritProtected()
          @root "#{__dirname}/config/root"
        Test.initialize()
        class Test::Configuration extends LeanRC::Configuration
          @inheritProtected()
          @module Test
        Test::Configuration.initialize()
        facade.registerProxy Test::Configuration.new LeanRC::CONFIGURATION, Test::ROOT
        class Test::TestRenderer extends LeanRC::Renderer
          @inheritProtected()
          @module Test
        Test::TestRenderer.initialize()
        renderer = Test::TestRenderer.new()
        facade.registerProxy renderer
        assert.equal renderer.templatesDir, "#{__dirname}/config/root/../lib/templates"
        facade.remove()
      .to.not.throw Error
  describe '#templates', ->
    it 'should get templates from scripts', ->
      co ->
        KEY = 'TEST_RENDERER_002'
        facade = LeanRC::Facade.getInstance KEY
        class Test extends LeanRC
          @inheritProtected()
          @root "#{__dirname}/config/root"
        Test.initialize()
        class Test::Configuration extends LeanRC::Configuration
          @inheritProtected()
          @module Test
        Test::Configuration.initialize()
        facade.registerProxy Test::Configuration.new LeanRC::CONFIGURATION, Test::ROOT
        class Test::TestRenderer extends LeanRC::Renderer
          @inheritProtected()
          @module Test
        Test::TestRenderer.initialize()
        renderer = Test::TestRenderer.new()
        facade.registerProxy renderer
        templates = yield renderer.templates
        assert.property templates, 'TestRecord/find'
        facade.remove()
        yield return
    it 'should run test template from script', ->
      co ->
        KEY = 'TEST_RENDERER_003'
        facade = LeanRC::Facade.getInstance KEY
        class Test extends LeanRC
          @inheritProtected()
          @root "#{__dirname}/config/root"
        Test.initialize()
        class Test::Configuration extends LeanRC::Configuration
          @inheritProtected()
          @module Test
        Test::Configuration.initialize()
        class Test::TestResource extends LeanRC::Resource
          @inheritProtected()
          @include LeanRC::QueryableResourceMixin
          @module Test
          @public entityName: String, { default: 'TestRecord' }
        Test::TestResource.initialize()
        facade.registerProxy Test::Configuration.new LeanRC::CONFIGURATION, Test::ROOT
        class Test::TestRenderer extends LeanRC::Renderer
          @inheritProtected()
          @module Test
        Test::TestRenderer.initialize()
        renderer = Test::TestRenderer.new()
        facade.registerProxy renderer
        templates = yield renderer.templates
        items = [
          id: 1, test: 'test1'
        ,
          id: 2, test: 'test2'
        ,
          id: 3, test: 'test3'
        ]
        resource = Test::TestResource.new()
        resource.initializeNotifier KEY
        output = yield templates['TestRecord/find'].call resource, 'TestRecord', 'find', items
        assert.property output, 'test_records'
        assert.sameDeepMembers output.test_records, [
          id: 1, test: 'test1'
        ,
          id: 2, test: 'test2'
        ,
          id: 3, test: 'test3'
        ]
        facade.remove()
        yield return
  ###
  describe '#render', ->
    it 'should render the data', ->
      co ->
        KEY = 'TEST_RENDERER_004'
        facade = LeanRC::Facade.getInstance KEY
        data = test: 'test1', data: 'data1'
        renderer = LeanRC::Renderer.new 'TEST_RENDERER'
        facade.registerProxy renderer
        renderResult = yield from renderer.render.body.call renderer, {}, data, {}, {}
        assert.equal renderResult, data, 'Data not rendered'
        facade.remove()
        yield return
    it 'should render the data with template', ->
      facade = null
      afterEach ->
        facade?.remove?()
      co ->
        KEY = 'TEST_RENDERER_005'
        facade = LeanRC::Facade.getInstance KEY
        class Test extends LeanRC
          @inheritProtected()
          @include LeanRC::TemplatableModuleMixin
          @root "#{__dirname}/config/root"
          @public @static templates: DictG(String, Function),
            default:
              sample: co.wrap (resourceName, action, aoData) ->
                "#{@listEntityName}": yield map aoData, (i)->
                  res = _.omit i, '_key', '_type', '_owner'
                  yield return res
          @initialize()
        class MyConfiguration extends LeanRC::Configuration
          @inheritProtected()
          @module Test
          @initialize()
        class TestResource extends LeanRC::Resource
          @inheritProtected()
          @include LeanRC::QueryableResourceMixin
          @module Test
          @public entityName: String, { default: 'TestRecord' }
          @initialize()
        class ApplicationMediator extends LeanRC::Mediator
          @inheritProtected()
          @module Test
          @initialize()
        class FakeApplication extends LeanRC::CoreObject
          @inheritProtected()
          @module Test
          @initialize()
        facade.registerProxy MyConfiguration.new LeanRC::CONFIGURATION, Test::ROOT
        facade.registerMediator ApplicationMediator.new LeanRC::APPLICATION_MEDIATOR, FakeApplication.new()
        class TestRenderer extends LeanRC::Renderer
          @inheritProtected()
          @module Test
          @initialize()
        data = [id: 1, test: 'test1', data: 'data1']
        renderer = TestRenderer.new 'TEST_RENDERER'
        facade.registerProxy renderer
        resource = TestResource.new()
        resource.initializeNotifier KEY
        renderResult = yield from renderer.render.body.call renderer, {}, data, resource,
          path: 'test'
          resource: 'TestRecord/'
          action: 'find'
          template: 'sample'
        assert.deepEqual renderResult, test_records: data
        yield return
    it 'should render the data in customized renderer', ->
      co ->
        data = firstName: 'John', lastName: 'Doe'
        class Test extends LeanRC
          @inheritProtected()
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
            keyName: String
            entityName: String
            recordName: String
          }], MaybeG AnyT),
            default: (ctx, aoData, resource, aoOptions)->
              vhData = assign {}, aoData, greeting: 'Hello'
              if aoOptions?.greeting?
                vhData.greeting = aoOptions.greeting
              yield return "#{vhData.greeting}, #{vhData.firstName} #{vhData.lastName}!"
          @initialize()
        renderer = TestRenderer.new 'TEST_RENDERER'
        result = yield from renderer.render.body.call renderer, {}, data, {}
        assert.equal result, 'Hello, John Doe!', 'Data without options not rendered'
        result = yield from renderer.render.body.call renderer, {}, data, {}, greeting: 'Hola'
        assert.equal result, 'Hola, John Doe!', 'Data with options not rendered'
        yield return
