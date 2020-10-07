{ expect, assert } = require 'chai'
sinon = require 'sinon'
_ = require 'lodash'
RC = require '@leansdk/rc/lib'
LeanRC = require.main.require 'lib'
{ co } = RC::Utils


describe 'ConfigurableMixin', ->
  describe '#configs', ->
    it 'should create configuration instance', ->
      co ->
        KEY = 'TEST_CONFIG_MIXIN_001'
        facade = LeanRC::Facade.getInstance KEY
        class Test extends LeanRC
          @inheritProtected()
          @root "#{__dirname}/config/root"
          @initialize()
        class TestConfiguration extends LeanRC::Configuration
          @inheritProtected()
          @module Test
          @initialize()
        facade.registerProxy TestConfiguration.new LeanRC::CONFIGURATION, Test::ROOT
        class TestConfigurable extends LeanRC::Proxy
          @inheritProtected()
          @include LeanRC::ConfigurableMixin
          @module Test
          @initialize()
        facade.registerProxy object = TestConfigurable.new 'TEST'
        assert.deepPropertyVal object, 'configs.test1', 'default'
        assert.deepPropertyVal object, 'configs.test2', 42
        assert.deepPropertyVal object, 'configs.test3', yes
        assert.deepPropertyVal object, 'configs.test4', 'test'
        facade.remove()
        yield return
