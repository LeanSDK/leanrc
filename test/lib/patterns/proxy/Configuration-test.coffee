{ expect, assert } = require 'chai'
sinon = require 'sinon'
_ = require 'lodash'
RC = require '@leansdk/rc/lib'
LeanRC = require.main.require 'lib'
{ co } = RC::Utils


describe 'Configuration', ->
  describe '.new', ->
    it 'should create configuration instance', ->
      co ->
        class Test extends LeanRC
          @inheritProtected()
          @root "#{__dirname}/config/root"
          @initialize()
        class Test::Configuration extends LeanRC::Configuration
          @inheritProtected()
          @module Test
          @initialize()
        configuration = Test::Configuration.new LeanRC::CONFIGURATION, Test::ROOT
        yield return
  describe '#environment', ->
    it 'should get environment name', ->
      co ->
        class Test extends LeanRC
          @inheritProtected()
          @root "#{__dirname}/config/root"
          @initialize()
        class Test::Configuration extends LeanRC::Configuration
          @inheritProtected()
          @module Test
          @initialize()
        configuration = Test::Configuration.new LeanRC::CONFIGURATION, Test::ROOT
        environment = configuration.environment
        assert.isTrue environment?, 'configuration.environment isnt exist'
        assert.isTrue environment in [LeanRC::DEVELOPMENT, LeanRC::PRODUCTION]
        yield return
  describe '#defineConfigProperties', ->
    it 'should setup configuration instance', ->
      co ->
        class Test extends LeanRC
          @inheritProtected()
          @root "#{__dirname}/config/root"
          @initialize()
        class Test::Configuration extends LeanRC::Configuration
          @inheritProtected()
          @module Test
          @initialize()
        configuration = Test::Configuration.new LeanRC::CONFIGURATION, Test::ROOT
        configuration.defineConfigProperties()
        assert.propertyVal configuration, 'test1', 'default'
        assert.propertyVal configuration, 'test2', 42
        assert.propertyVal configuration, 'test3', yes
        assert.propertyVal configuration, 'test4', 'test'
        yield return
  describe '#onRegister', ->
    it 'should initiate setup configuration instance', ->
      co ->
        class Test extends LeanRC
          @inheritProtected()
          @root "#{__dirname}/config/root"
          @initialize()
        class Test::Configuration extends LeanRC::Configuration
          @inheritProtected()
          @module Test
          @initialize()
        configuration = Test::Configuration.new LeanRC::CONFIGURATION, Test::ROOT
        configuration.onRegister()
        assert.propertyVal configuration, 'test1', 'default'
        assert.propertyVal configuration, 'test2', 42
        assert.propertyVal configuration, 'test3', yes
        assert.propertyVal configuration, 'test4', 'test'
        yield return
