{ expect, assert } = require 'chai'
sinon = require 'sinon'
RC = require '@leansdk/rc/lib'
LeanRC = require.main.require 'lib'
{
  AnyT
  FuncG, MaybeG, UnionG, InterfaceG, EnumG
  Migration
  Utils: { co }
} = LeanRC::
{ SUPPORTED_TYPES } = Migration::


describe 'Migration', ->
  describe '.new', ->
    facade = null
    afterEach ->
      facade?.remove?()
    it 'should create migration instance', ->
      co ->
        collectionName = 'TestsCollection'
        KEY = 'TEST_MIGRATION_001'
        facade = LeanRC::Facade.getInstance KEY
        class Test extends LeanRC
          @inheritProtected()
          @root __dirname
          @initialize()
        class TestsCollection extends LeanRC::Collection
          @inheritProtected()
          @include LeanRC::MemoryCollectionMixin
          @include LeanRC::GenerateUuidIdMixin
          @module Test
          @initialize()
        class BaseMigration extends LeanRC::Migration
          @inheritProtected()
          @module Test
          @initialize()
        collection = TestsCollection.new collectionName,
          delegate: 'BaseMigration'
        facade.registerProxy collection
        migration = BaseMigration.new {type: 'LeanRC::Migration'}, collection
        assert.lengthOf migration.steps, 0
        yield return
  describe '.createCollection', ->
    facade = null
    afterEach ->
      facade?.remove?()
    it 'should add step for create collection', ->
      co ->
        collectionName = 'TestsCollection'
        KEY = 'TEST_MIGRATION_002'
        facade = LeanRC::Facade.getInstance KEY
        class Test extends LeanRC
          @inheritProtected()
          @root __dirname
          @initialize()
        class TestsCollection extends LeanRC::Collection
          @inheritProtected()
          @include LeanRC::MemoryCollectionMixin
          @include LeanRC::GenerateUuidIdMixin
          @module Test
          @initialize()
        class BaseMigration extends LeanRC::Migration
          @inheritProtected()
          @module Test
          @initialize()
        collection = TestsCollection.new collectionName,
          delegate: 'BaseMigration'
        facade.registerProxy collection
        BaseMigration.change ->
          @createCollection 'collectionName', {prop: 'prop'}
        migration = BaseMigration.new {type: 'Test::BaseMigration'}, collection
        assert.lengthOf migration.steps, 1
        assert.deepEqual migration.steps[0],
          args: [ 'collectionName', {prop: 'prop'} ]
          method: 'createCollection'
        yield return
  describe '.createEdgeCollection', ->
    facade = null
    afterEach ->
      facade?.remove?()
    it 'should add step for create edge collection', ->
      co ->
        collectionName = 'TestsCollection'
        KEY = 'TEST_MIGRATION_003'
        facade = LeanRC::Facade.getInstance KEY
        class Test extends LeanRC
          @inheritProtected()
          @root __dirname
          @initialize()
        class TestsCollection extends LeanRC::Collection
          @inheritProtected()
          @include LeanRC::MemoryCollectionMixin
          @include LeanRC::GenerateUuidIdMixin
          @module Test
          @initialize()
        class BaseMigration extends LeanRC::Migration
          @inheritProtected()
          @module Test
          @initialize()
        collection = TestsCollection.new collectionName,
          delegate: 'BaseMigration'
        facade.registerProxy collection
        BaseMigration.change ->
          @createEdgeCollection 'collectionName1', 'collectionName2', {prop: 'prop'}
        migration = BaseMigration.new {type: 'Test::BaseMigration'}, collection
        assert.lengthOf migration.steps, 1
        assert.deepEqual migration.steps[0],
          args: [ 'collectionName1', 'collectionName2', {prop: 'prop'} ]
          method: 'createEdgeCollection'
        yield return
  describe '.addField', ->
    facade = null
    afterEach ->
      facade?.remove?()
    it 'should add step to add field in record at collection', ->
      co ->
        collectionName = 'TestsCollection'
        KEY = 'TEST_MIGRATION_004'
        facade = LeanRC::Facade.getInstance KEY
        class Test extends LeanRC
          @inheritProtected()
          @root __dirname
          @initialize()
        class TestsCollection extends LeanRC::Collection
          @inheritProtected()
          @include LeanRC::MemoryCollectionMixin
          @include LeanRC::GenerateUuidIdMixin
          @module Test
          @initialize()
        class BaseMigration extends LeanRC::Migration
          @inheritProtected()
          @module Test
          @initialize()
        collection = TestsCollection.new collectionName,
          delegate: 'BaseMigration'
        facade.registerProxy collection
        BaseMigration.change ->
          @addField 'collectionName', 'attr1', 'number'
        migration = BaseMigration.new {type: 'Test::BaseMigration'}, collection
        assert.lengthOf migration.steps, 1
        assert.deepEqual migration.steps[0],
          args: [ 'collectionName', 'attr1', 'number' ]
          method: 'addField'
        yield return
  describe '.addIndex', ->
    facade = null
    afterEach ->
      facade?.remove?()
    it 'should add step to add index in collection', ->
      co ->
        collectionName = 'TestsCollection'
        KEY = 'TEST_MIGRATION_005'
        facade = LeanRC::Facade.getInstance KEY
        class Test extends LeanRC
          @inheritProtected()
          @root __dirname
          @initialize()
        class TestsCollection extends LeanRC::Collection
          @inheritProtected()
          @include LeanRC::MemoryCollectionMixin
          @include LeanRC::GenerateUuidIdMixin
          @module Test
          @initialize()
        class BaseMigration extends LeanRC::Migration
          @inheritProtected()
          @module Test
          @initialize()
        collection = TestsCollection.new collectionName,
          delegate: 'BaseMigration'
        facade.registerProxy collection
        BaseMigration.change ->
          @addIndex 'collectionName', ['attr1', 'attr2'], type: "hash"
        migration = BaseMigration.new {type: 'Test::BaseMigration'}, collection
        assert.lengthOf migration.steps, 1
        assert.deepEqual migration.steps[0],
          args: [ 'collectionName', ['attr1', 'attr2'], type: "hash" ]
          method: 'addIndex'
        yield return
  describe '.addTimestamps', ->
    facade = null
    afterEach ->
      facade?.remove?()
    it 'should add step to add timesteps in collection', ->
      co ->
        collectionName = 'TestsCollection'
        KEY = 'TEST_MIGRATION_006'
        facade = LeanRC::Facade.getInstance KEY
        class Test extends LeanRC
          @inheritProtected()
          @root __dirname
          @initialize()
        class TestsCollection extends LeanRC::Collection
          @inheritProtected()
          @include LeanRC::MemoryCollectionMixin
          @include LeanRC::GenerateUuidIdMixin
          @module Test
          @initialize()
        class BaseMigration extends LeanRC::Migration
          @inheritProtected()
          @module Test
          @initialize()
        collection = TestsCollection.new collectionName,
          delegate: 'BaseMigration'
        facade.registerProxy collection
        BaseMigration.change ->
          @addTimestamps 'collectionName', {prop: 'prop'}
        migration = BaseMigration.new {type: 'Test::BaseMigration'}, collection
        assert.lengthOf migration.steps, 1
        assert.deepEqual migration.steps[0],
          args: [ 'collectionName', {prop: 'prop'} ]
          method: 'addTimestamps'
        yield return
  describe '.changeCollection', ->
    facade = null
    afterEach ->
      facade?.remove?()
    it 'should add step to change collection', ->
      co ->
        collectionName = 'TestsCollection'
        KEY = 'TEST_MIGRATION_007'
        facade = LeanRC::Facade.getInstance KEY
        class Test extends LeanRC
          @inheritProtected()
          @root __dirname
          @initialize()
        class TestsCollection extends LeanRC::Collection
          @inheritProtected()
          @include LeanRC::MemoryCollectionMixin
          @include LeanRC::GenerateUuidIdMixin
          @module Test
          @initialize()
        class BaseMigration extends LeanRC::Migration
          @inheritProtected()
          @module Test
          @initialize()
        collection = TestsCollection.new collectionName,
          delegate: 'BaseMigration'
        facade.registerProxy collection
        BaseMigration.change ->
          @changeCollection 'collectionName', {prop: 'prop'}
        migration = BaseMigration.new {type: 'Test::BaseMigration'}, collection
        assert.lengthOf migration.steps, 1
        assert.deepEqual migration.steps[0],
          args: [ 'collectionName', {prop: 'prop'} ]
          method: 'changeCollection'
        yield return
  describe '.changeField', ->
    facade = null
    afterEach ->
      facade?.remove?()
    it 'should add step to change field in collection', ->
      co ->
        collectionName = 'TestsCollection'
        KEY = 'TEST_MIGRATION_008'
        facade = LeanRC::Facade.getInstance KEY
        class Test extends LeanRC
          @inheritProtected()
          @root __dirname
          @initialize()
        class TestsCollection extends LeanRC::Collection
          @inheritProtected()
          @include LeanRC::MemoryCollectionMixin
          @include LeanRC::GenerateUuidIdMixin
          @module Test
          @initialize()
        class BaseMigration extends LeanRC::Migration
          @inheritProtected()
          @module Test
          @initialize()
        collection = TestsCollection.new collectionName,
          delegate: 'BaseMigration'
        facade.registerProxy collection
        BaseMigration.change ->
          @changeField 'collectionName', 'attr1', 'string'
        migration = BaseMigration.new {type: 'Test::BaseMigration'}, collection
        assert.lengthOf migration.steps, 1
        assert.deepEqual migration.steps[0],
          args: [ 'collectionName', 'attr1', 'string' ]
          method: 'changeField'
        yield return
  describe '.renameField', ->
    facade = null
    afterEach ->
      facade?.remove?()
    it 'should add step to rename field in collection', ->
      co ->
        collectionName = 'TestsCollection'
        KEY = 'TEST_MIGRATION_009'
        facade = LeanRC::Facade.getInstance KEY
        class Test extends LeanRC
          @inheritProtected()
          @root __dirname
          @initialize()
        class TestsCollection extends LeanRC::Collection
          @inheritProtected()
          @include LeanRC::MemoryCollectionMixin
          @include LeanRC::GenerateUuidIdMixin
          @module Test
          @initialize()
        class BaseMigration extends LeanRC::Migration
          @inheritProtected()
          @module Test
          @initialize()
        collection = TestsCollection.new collectionName,
          delegate: 'BaseMigration'
        facade.registerProxy collection
        BaseMigration.change ->
          @renameField 'collectionName', 'oldAttrName', 'newAttrName'
        migration = BaseMigration.new {type: 'Test::BaseMigration'}, collection
        assert.lengthOf migration.steps, 1
        assert.deepEqual migration.steps[0],
          args: [ 'collectionName', 'oldAttrName', 'newAttrName' ]
          method: 'renameField'
        yield return
  describe '.renameIndex', ->
    facade = null
    afterEach ->
      facade?.remove?()
    it 'should add step to rename index in collection', ->
      co ->
        collectionName = 'TestsCollection'
        KEY = 'TEST_MIGRATION_010'
        facade = LeanRC::Facade.getInstance KEY
        class Test extends LeanRC
          @inheritProtected()
          @root __dirname
          @initialize()
        class TestsCollection extends LeanRC::Collection
          @inheritProtected()
          @include LeanRC::MemoryCollectionMixin
          @include LeanRC::GenerateUuidIdMixin
          @module Test
          @initialize()
        class BaseMigration extends LeanRC::Migration
          @inheritProtected()
          @module Test
          @initialize()
        collection = TestsCollection.new collectionName,
          delegate: 'BaseMigration'
        facade.registerProxy collection
        BaseMigration.change ->
          @renameIndex 'collectionName', 'oldIndexname', 'newIndexName'
        migration = BaseMigration.new {type: 'Test::BaseMigration'}, collection
        assert.lengthOf migration.steps, 1
        assert.deepEqual migration.steps[0],
          args: [ 'collectionName', 'oldIndexname', 'newIndexName' ]
          method: 'renameIndex'
        yield return
  describe '.renameCollection', ->
    facade = null
    afterEach ->
      facade?.remove?()
    it 'should add step to rename collection', ->
      co ->
        collectionName = 'TestsCollection'
        KEY = 'TEST_MIGRATION_011'
        facade = LeanRC::Facade.getInstance KEY
        class Test extends LeanRC
          @inheritProtected()
          @root __dirname
          @initialize()
        class TestsCollection extends LeanRC::Collection
          @inheritProtected()
          @include LeanRC::MemoryCollectionMixin
          @include LeanRC::GenerateUuidIdMixin
          @module Test
          @initialize()
        class BaseMigration extends LeanRC::Migration
          @inheritProtected()
          @module Test
          @initialize()
        collection = TestsCollection.new collectionName,
          delegate: 'BaseMigration'
        facade.registerProxy collection
        BaseMigration.change ->
          @renameCollection 'oldCollectionName', 'newCollectionName'
        migration = BaseMigration.new {type: 'Test::BaseMigration'}, collection
        assert.lengthOf migration.steps, 1
        assert.deepEqual migration.steps[0],
          args: [ 'oldCollectionName', 'newCollectionName' ]
          method: 'renameCollection'
        yield return
  describe '.dropCollection', ->
    facade = null
    afterEach ->
      facade?.remove?()
    it 'should add step to drop collection', ->
      co ->
        collectionName = 'TestsCollection'
        KEY = 'TEST_MIGRATION_012'
        facade = LeanRC::Facade.getInstance KEY
        class Test extends LeanRC
          @inheritProtected()
          @root __dirname
          @initialize()
        class TestsCollection extends LeanRC::Collection
          @inheritProtected()
          @include LeanRC::MemoryCollectionMixin
          @include LeanRC::GenerateUuidIdMixin
          @module Test
          @initialize()
        class BaseMigration extends LeanRC::Migration
          @inheritProtected()
          @module Test
          @initialize()
        collection = TestsCollection.new collectionName,
          delegate: 'BaseMigration'
        facade.registerProxy collection
        BaseMigration.change ->
          @dropCollection 'collectionName'
        migration = BaseMigration.new {type: 'Test::BaseMigration'}, collection
        assert.lengthOf migration.steps, 1
        assert.deepEqual migration.steps[0],
          args: [ 'collectionName' ]
          method: 'dropCollection'
        yield return
  describe '.dropEdgeCollection', ->
    facade = null
    afterEach ->
      facade?.remove?()
    it 'should add step to drop edge collection', ->
      co ->
        collectionName = 'TestsCollection'
        KEY = 'TEST_MIGRATION_013'
        facade = LeanRC::Facade.getInstance KEY
        class Test extends LeanRC
          @inheritProtected()
          @root __dirname
          @initialize()
        class TestsCollection extends LeanRC::Collection
          @inheritProtected()
          @include LeanRC::MemoryCollectionMixin
          @include LeanRC::GenerateUuidIdMixin
          @module Test
          @initialize()
        class BaseMigration extends LeanRC::Migration
          @inheritProtected()
          @module Test
          @initialize()
        collection = TestsCollection.new collectionName,
          delegate: 'BaseMigration'
        facade.registerProxy collection
        BaseMigration.change ->
          @dropEdgeCollection 'collectionName1', 'collectionName2'
        migration = BaseMigration.new {type: 'Test::BaseMigration'}, collection
        assert.lengthOf migration.steps, 1
        assert.deepEqual migration.steps[0],
          args: [ 'collectionName1', 'collectionName2' ]
          method: 'dropEdgeCollection'
        yield return
  describe '.removeField', ->
    facade = null
    afterEach ->
      facade?.remove?()
    it 'should add step to remove field in collection', ->
      co ->
        collectionName = 'TestsCollection'
        KEY = 'TEST_MIGRATION_014'
        facade = LeanRC::Facade.getInstance KEY
        class Test extends LeanRC
          @inheritProtected()
          @root __dirname
          @initialize()
        class TestsCollection extends LeanRC::Collection
          @inheritProtected()
          @include LeanRC::MemoryCollectionMixin
          @include LeanRC::GenerateUuidIdMixin
          @module Test
          @initialize()
        class BaseMigration extends LeanRC::Migration
          @inheritProtected()
          @module Test
          @initialize()
        collection = TestsCollection.new collectionName,
          delegate: 'BaseMigration'
        facade.registerProxy collection
        BaseMigration.change ->
          @removeField 'collectionName', 'attr2'
        migration = BaseMigration.new {type: 'Test::BaseMigration'}, collection
        assert.lengthOf migration.steps, 1
        assert.deepEqual migration.steps[0],
          args: [ 'collectionName', 'attr2' ]
          method: 'removeField'
        yield return
  describe '.removeIndex', ->
    facade = null
    afterEach ->
      facade?.remove?()
    it 'should add step to remove index in collection', ->
      co ->
        collectionName = 'TestsCollection'
        KEY = 'TEST_MIGRATION_015'
        facade = LeanRC::Facade.getInstance KEY
        class Test extends LeanRC
          @inheritProtected()
          @root __dirname
          @initialize()
        class TestsCollection extends LeanRC::Collection
          @inheritProtected()
          @include LeanRC::MemoryCollectionMixin
          @include LeanRC::GenerateUuidIdMixin
          @module Test
          @initialize()
        class BaseMigration extends LeanRC::Migration
          @inheritProtected()
          @module Test
          @initialize()
        collection = TestsCollection.new collectionName,
          delegate: 'BaseMigration'
        facade.registerProxy collection
        BaseMigration.change ->
          @removeIndex 'collectionName', ['attr1', 'attr2'], {
            type: "hash"
            unique: yes
            sparse: no
          }
        migration = BaseMigration.new {type: 'Test::BaseMigration'}, collection
        assert.lengthOf migration.steps, 1
        assert.deepEqual migration.steps[0],
          args: [ 'collectionName', ['attr1', 'attr2'], {
            type: "hash"
            unique: yes
            sparse: no
          } ]
          method: 'removeIndex'
        yield return
  describe '.removeTimestamps', ->
    facade = null
    afterEach ->
      facade?.remove?()
    it 'should add step to remove timestamps in collection', ->
      co ->
        collectionName = 'TestsCollection'
        KEY = 'TEST_MIGRATION_016'
        facade = LeanRC::Facade.getInstance KEY
        class Test extends LeanRC
          @inheritProtected()
          @root __dirname
          @initialize()
        class TestsCollection extends LeanRC::Collection
          @inheritProtected()
          @include LeanRC::MemoryCollectionMixin
          @include LeanRC::GenerateUuidIdMixin
          @module Test
          @initialize()
        class BaseMigration extends LeanRC::Migration
          @inheritProtected()
          @module Test
          @initialize()
        collection = TestsCollection.new collectionName,
          delegate: 'BaseMigration'
        facade.registerProxy collection
        BaseMigration.change ->
          @removeTimestamps 'collectionName', {prop: 'prop'}
        migration = BaseMigration.new {type: 'Test::BaseMigration'}, collection
        assert.lengthOf migration.steps, 1
        assert.deepEqual migration.steps[0],
          args: [ 'collectionName', {prop: 'prop'} ]
          method: 'removeTimestamps'
        yield return
  describe '.reversible', ->
    facade = null
    afterEach ->
      facade?.remove?()
    it 'should add reversible step', ->
      co ->
        collectionName = 'TestsCollection'
        KEY = 'TEST_MIGRATION_017'
        facade = LeanRC::Facade.getInstance KEY
        class Test extends LeanRC
          @inheritProtected()
          @root __dirname
          @initialize()
        class TestsCollection extends LeanRC::Collection
          @inheritProtected()
          @include LeanRC::MemoryCollectionMixin
          @include LeanRC::GenerateUuidIdMixin
          @module Test
          @initialize()
        class BaseMigration extends LeanRC::Migration
          @inheritProtected()
          @module Test
          @initialize()
        collection = TestsCollection.new collectionName,
          delegate: 'BaseMigration'
        facade.registerProxy collection
        reversibleArg = co.wrap (dir)->
          yield dir.up   co.wrap ->
            yield return
          yield dir.down co.wrap ->
            yield return
          yield return
        BaseMigration.change ->
          @reversible reversibleArg
        migration = BaseMigration.new {type: 'Test::BaseMigration'}, collection
        assert.lengthOf migration.steps, 1
        assert.deepEqual migration.steps[0],
          args: [ reversibleArg ]
          method: 'reversible'
        yield return
  describe '#execute', ->
    facade = null
    afterEach ->
      facade?.remove?()
    it 'should run generator closure with some code', ->
      co ->
        collectionName = 'TestsCollection'
        KEY = 'TEST_MIGRATION_018'
        facade = LeanRC::Facade.getInstance KEY
        class Test extends LeanRC
          @inheritProtected()
          @root __dirname
          @initialize()
        class TestsCollection extends LeanRC::Collection
          @inheritProtected()
          @include LeanRC::MemoryCollectionMixin
          @include LeanRC::GenerateUuidIdMixin
          @module Test
          @initialize()
        class BaseMigration extends LeanRC::Migration
          @inheritProtected()
          @module Test
          @initialize()
        collection = TestsCollection.new collectionName,
          delegate: 'BaseMigration'
        facade.registerProxy collection
        migration = BaseMigration.new {type: 'Test::BaseMigration'}, collection
        spyExecute = sinon.spy -> yield return
        yield migration.execute.body.call migration, spyExecute
        assert.isTrue spyExecute.called
        yield return
  describe '.change', ->
    facade = null
    afterEach ->
      facade?.remove?()
    it 'should run closure with some code', ->
      co ->
        collectionName = 'TestsCollection'
        KEY = 'TEST_MIGRATION_019'
        facade = LeanRC::Facade.getInstance KEY
        class Test extends LeanRC
          @inheritProtected()
          @root __dirname
          @initialize()
        class TestsCollection extends LeanRC::Collection
          @inheritProtected()
          @include LeanRC::MemoryCollectionMixin
          @include LeanRC::GenerateUuidIdMixin
          @module Test
          @initialize()
        class BaseMigration extends LeanRC::Migration
          @inheritProtected()
          @module Test
          @initialize()
        collection = TestsCollection.new collectionName,
          delegate: 'BaseMigration'
        facade.registerProxy collection
        spyChange = sinon.spy ->
        BaseMigration.change spyChange
        assert.isTrue spyChange.called
        yield return
  describe '#up', ->
    facade = null
    afterEach ->
      facade?.remove?()
    it 'should run steps in forward direction', ->
      co ->
        collectionName = 'TestsCollection'
        KEY = 'TEST_MIGRATION_020'
        facade = LeanRC::Facade.getInstance KEY
        spyReversibleUp = sinon.spy -> yield return
        spyCreateCollection = sinon.spy -> yield return
        spyAddField = sinon.spy -> yield return
        class Test extends LeanRC
          @inheritProtected()
          @root __dirname
          @initialize()
        class TestsCollection extends LeanRC::Collection
          @inheritProtected()
          @include LeanRC::MemoryCollectionMixin
          @include LeanRC::GenerateUuidIdMixin
          @module Test
          @initialize()
        class BaseMigration extends LeanRC::Migration
          @inheritProtected()
          @module Test
          @change ->
            @reversible ({ up, down }) ->
              yield up spyReversibleUp
              yield @createCollection 'TEST_COLLECTION'
              yield return
            @addField 'collectionName', 'TEST_FIELD', 'number'
          @public @async createCollection: FuncG([String, MaybeG Object]),
            default: spyCreateCollection
          @public @async addField: FuncG([String, String, UnionG(
            EnumG SUPPORTED_TYPES
            InterfaceG {
              type: EnumG SUPPORTED_TYPES
              default: AnyT
            }
          )]),
            default: spyAddField
          @initialize()
        collection = TestsCollection.new collectionName,
          delegate: 'BaseMigration'
        facade.registerProxy collection
        migration = BaseMigration.new {type: 'Test::BaseMigration'}, collection
        yield migration.up()
        assert.isTrue spyReversibleUp.called
        assert.isTrue spyCreateCollection.calledAfter spyReversibleUp
        assert.isTrue spyAddField.calledAfter spyCreateCollection
        assert.equal spyCreateCollection.args[0][0], 'TEST_COLLECTION'
        assert.deepEqual spyAddField.args[0], ['collectionName', 'TEST_FIELD', 'number']
        yield return
  describe '#down', ->
    facade = null
    afterEach ->
      facade?.remove?()
    it 'should run steps in backward direction', ->
      co ->
        collectionName = 'TestsCollection'
        KEY = 'TEST_MIGRATION_021'
        facade = LeanRC::Facade.getInstance KEY
        spyReversibleDown = sinon.spy -> yield return
        spyCreateCollection = sinon.spy -> yield return
        spyRenameIndex = sinon.spy -> yield return
        spyRemoveField = sinon.spy -> yield return
        class Test extends LeanRC
          @inheritProtected()
          @root __dirname
          @initialize()
        class TestsCollection extends LeanRC::Collection
          @inheritProtected()
          @include LeanRC::MemoryCollectionMixin
          @include LeanRC::GenerateUuidIdMixin
          @module Test
          @initialize()
        class BaseMigration extends LeanRC::Migration
          @inheritProtected()
          @module Test
          @change ->
            @reversible ({ up, down }) ->
              yield down spyReversibleDown
              yield @createCollection 'TEST_COLLECTION'
              yield return
            @addField 'collectionName', 'TEST_FIELD', 'number'
            @renameIndex 'collectionName', 'TEST_INDEX_1', 'TEST_INDEX_2'
          @public @async createCollection: FuncG([String, MaybeG Object]),
            default: spyCreateCollection
          @public @async renameIndex: FuncG([String, String, String]),
            default: spyRenameIndex
          @public @async removeField: FuncG([String, String]),
            default: spyRemoveField
          @initialize()
        collection = TestsCollection.new collectionName,
          delegate: 'BaseMigration'
        facade.registerProxy collection
        migration = BaseMigration.new {type: 'Test::BaseMigration'}, collection
        yield migration.down()
        assert.isTrue spyRenameIndex.called
        assert.isTrue spyRemoveField.calledAfter spyRenameIndex
        assert.isTrue spyReversibleDown.calledAfter spyRemoveField
        assert.isTrue spyCreateCollection.calledAfter spyReversibleDown
        assert.equal spyCreateCollection.args[0][0], 'TEST_COLLECTION'
        assert.deepEqual spyRemoveField.args[0], ['collectionName', 'TEST_FIELD', 'number']
        assert.deepEqual spyRenameIndex.args[0], ['collectionName', 'TEST_INDEX_2', 'TEST_INDEX_1']
        yield return
  describe '.up', ->
    facade = null
    afterEach ->
      facade?.remove?()
    it 'should replace forward stepping caller', ->
      co ->
        collectionName = 'TestsCollection'
        KEY = 'TEST_MIGRATION_022'
        facade = LeanRC::Facade.getInstance KEY
        spyUp = sinon.spy -> yield return
        class Test extends LeanRC
          @inheritProtected()
          @root __dirname
          @initialize()
        class TestsCollection extends Test::Collection
          @inheritProtected()
          @include LeanRC::MemoryCollectionMixin
          @include LeanRC::GenerateUuidIdMixin
          @module Test
          @initialize()
        class BaseMigration extends LeanRC::Migration
          @inheritProtected()
          @module Test
          @up.body.call @, spyUp
          @initialize()
        collection = TestsCollection.new collectionName,
          delegate: 'BaseMigration'
        facade.registerProxy collection
        migration = BaseMigration.new {type: 'Test::BaseMigration'}, collection
        assert.isFalse spyUp.called
        yield migration.up()
        assert.isTrue spyUp.called
        yield return
  describe '.down', ->
    facade = null
    afterEach ->
      facade?.remove?()
    it 'should replace forward stepping caller', ->
      co ->
        collectionName = 'TestsCollection'
        KEY = 'TEST_MIGRATION_023'
        facade = LeanRC::Facade.getInstance KEY
        spyDown = sinon.spy -> yield return
        class Test extends LeanRC
          @inheritProtected()
          @root __dirname
          @initialize()
        class TestsCollection extends Test::Collection
          @inheritProtected()
          @include LeanRC::MemoryCollectionMixin
          @include LeanRC::GenerateUuidIdMixin
          @module Test
          @initialize()
        class BaseMigration extends LeanRC::Migration
          @inheritProtected()
          @module Test
          @down.body.call @, spyDown
          @initialize()
        collection = TestsCollection.new collectionName,
          delegate: 'BaseMigration'
        facade.registerProxy collection
        migration = BaseMigration.new {type: 'Test::BaseMigration'}, collection
        assert.isFalse spyDown.called
        yield migration.down()
        assert.isTrue spyDown.called
        yield return
  describe '#migrate', ->
    facade = null
    afterEach ->
      facade?.remove?()
    it 'should run steps in forward direction', ->
      co ->
        collectionName = 'TestsCollection'
        KEY = 'TEST_MIGRATION_024'
        facade = LeanRC::Facade.getInstance KEY
        spyReversibleUp = sinon.spy -> yield return
        spyCreateCollection = sinon.spy -> yield return
        spyAddField = sinon.spy -> yield return
        class Test extends LeanRC
          @inheritProtected()
          @root __dirname
          @initialize()
        class TestsCollection extends Test::Collection
          @inheritProtected()
          @include LeanRC::MemoryCollectionMixin
          @include LeanRC::GenerateUuidIdMixin
          @module Test
          @initialize()
        class BaseMigration extends LeanRC::Migration
          @inheritProtected()
          @module Test
          @change ->
            @reversible ({ up, down }) ->
              yield up spyReversibleUp
              yield @createCollection 'TEST_COLLECTION'
              yield return
            @addField 'collectionName', 'TEST_FIELD', 'number'
          @public @async createCollection: FuncG([String, MaybeG Object]),
            default: spyCreateCollection
          @public @async addField: FuncG([String, String, UnionG(
            EnumG SUPPORTED_TYPES
            InterfaceG {
              type: EnumG SUPPORTED_TYPES
              default: AnyT
            }
          )]),
            default: spyAddField
          @initialize()
        collection = TestsCollection.new collectionName,
          delegate: 'BaseMigration'
        facade.registerProxy collection
        migration = BaseMigration.new {type: 'Test::BaseMigration'}, collection
        yield migration.migrate BaseMigration::UP
        assert.isTrue spyReversibleUp.called
        assert.isTrue spyCreateCollection.calledAfter spyReversibleUp
        assert.isTrue spyAddField.calledAfter spyCreateCollection
        assert.equal spyCreateCollection.args[0][0], 'TEST_COLLECTION'
        # assert.equal spyAddField.args[0][0], 'TEST_FIELD'
        assert.deepEqual spyAddField.args[0], ['collectionName', 'TEST_FIELD', 'number']
        yield return
    it 'should run steps in backward direction', ->
      co ->
        collectionName = 'TestsCollection'
        KEY = 'TEST_MIGRATION_025'
        facade = LeanRC::Facade.getInstance KEY
        spyReversibleDown = sinon.spy -> yield return
        spyCreateCollection = sinon.spy -> yield return
        spyRenameIndex = sinon.spy -> yield return
        spyRemoveField = sinon.spy -> yield return
        class Test extends LeanRC
          @inheritProtected()
          @root __dirname
          @initialize()
        class TestsCollection extends Test::Collection
          @inheritProtected()
          @include LeanRC::MemoryCollectionMixin
          @include LeanRC::GenerateUuidIdMixin
          @module Test
          @initialize()
        class BaseMigration extends LeanRC::Migration
          @inheritProtected()
          @module Test
          @change ->
            @reversible ({ up, down }) ->
              yield down spyReversibleDown
              yield @createCollection 'TEST_COLLECTION'
              yield return
            @addField 'collectionName', 'TEST_FIELD', 'number'
            @renameIndex 'collectionName', 'TEST_INDEX_3', 'TEST_INDEX_4'
          @public @async createCollection: FuncG([String, MaybeG Object]),
            default: spyCreateCollection
          @public @async renameIndex: FuncG([String, String, String]),
            default: spyRenameIndex
          @public @async removeField: FuncG([String, String]),
            default: spyRemoveField
          @initialize()
        collection = TestsCollection.new collectionName,
          delegate: 'BaseMigration'
        facade.registerProxy collection
        migration = BaseMigration.new {type: 'Test::BaseMigration'}, collection
        yield migration.migrate BaseMigration::DOWN
        assert.isTrue spyRenameIndex.called
        assert.isTrue spyRemoveField.calledAfter spyRenameIndex
        assert.isTrue spyReversibleDown.calledAfter spyRemoveField
        assert.isTrue spyCreateCollection.calledAfter spyReversibleDown
        assert.equal spyCreateCollection.args[0][0], 'TEST_COLLECTION'
        assert.deepEqual spyRemoveField.args[0], ['collectionName', 'TEST_FIELD', 'number']
        assert.deepEqual spyRenameIndex.args[0], ['collectionName', 'TEST_INDEX_4', 'TEST_INDEX_3']
        yield return
