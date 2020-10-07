{ expect, assert } = require 'chai'
sinon = require 'sinon'
RC = require '@leansdk/rc/lib'
LeanRC = require.main.require 'lib'
{ co } = LeanRC::Utils


describe 'MemoryMigrationMixin', ->
  describe '.new', ->
    facade = null
    afterEach ->
      facade?.remove?()
    it 'should create migration instance', ->
      co ->
        collectionName = 'MigrationsCollection'
        KEY = 'TEST_MEMORY_MIGRATION_001'
        facade = LeanRC::Facade.getInstance KEY
        class Test extends LeanRC
          @inheritProtected()
          @root __dirname
          @initialize()
        class MemoryCollection extends LeanRC::Collection
          @inheritProtected()
          @include LeanRC::MemoryCollectionMixin
          @include LeanRC::GenerateUuidIdMixin
          @module Test
          @initialize()
        class BaseMigration extends LeanRC::Migration
          @inheritProtected()
          @include LeanRC::MemoryMigrationMixin
          @module Test
          @initialize()
        collection = MemoryCollection.new collectionName,
          delegate: 'BaseMigration'
        facade.registerProxy collection
        migration = BaseMigration.new {type: 'Test::BaseMigration'}, collection
        yield return
  describe '#createCollection', ->
    facade = null
    afterEach ->
      facade?.remove?()
    it 'should apply step for create collection', ->
      co ->
        collectionName = 'MigrationsCollection'
        KEY = 'TEST_MEMORY_MIGRATION_002'
        facade = LeanRC::Facade.getInstance KEY
        class Test extends LeanRC
          @inheritProtected()
          @root __dirname
          @initialize()
        class MemoryCollection extends LeanRC::Collection
          @inheritProtected()
          @include LeanRC::MemoryCollectionMixin
          @include LeanRC::GenerateUuidIdMixin
          @module Test
          @initialize()
        class BaseMigration extends LeanRC::Migration
          @inheritProtected()
          @include LeanRC::MemoryMigrationMixin
          @module Test
          @change ->
            @createCollection 'TestsCollection'
          @initialize()
        collection = MemoryCollection.new collectionName,
          delegate: 'BaseMigration'
        facade.registerProxy collection
        migration = BaseMigration.new {type: 'Test::BaseMigration'}, collection
        spyCreateCollection = sinon.spy migration, 'createCollection'
        yield migration.up()
        assert.isTrue spyCreateCollection.calledWith 'TestsCollection'
        yield return
  describe '#createEdgeCollection', ->
    facade = null
    afterEach ->
      facade?.remove?()
    it 'should apply step for create edge collection', ->
      co ->
        collectionName = 'MigrationsCollection'
        KEY = 'TEST_MEMORY_MIGRATION_003'
        facade = LeanRC::Facade.getInstance KEY
        class Test extends LeanRC
          @inheritProtected()
          @root __dirname
          @initialize()
        class MemoryCollection extends LeanRC::Collection
          @inheritProtected()
          @include LeanRC::MemoryCollectionMixin
          @include LeanRC::GenerateUuidIdMixin
          @module Test
          @initialize()
        class BaseMigration extends LeanRC::Migration
          @inheritProtected()
          @include LeanRC::MemoryMigrationMixin
          @module Test
          @change ->
            @createEdgeCollection 'TestsCollection1', 'TestsCollection2', {prop: 'prop'}
          @initialize()
        collection = MemoryCollection.new collectionName,
          delegate: 'BaseMigration'
        facade.registerProxy collection
        migration = BaseMigration.new {type: 'Test::BaseMigration'}, collection
        spyCreateCollection = sinon.spy migration, 'createEdgeCollection'
        yield migration.up()
        assert.isTrue spyCreateCollection.calledWith 'TestsCollection1', 'TestsCollection2', {prop: 'prop'}
        yield return
  describe '#addField', ->
    facade = null
    afterEach ->
      facade?.remove?()
    it 'should apply step to add field in record at collection', ->
      co ->
        collectionName = 'MigrationsCollection'
        KEY = 'TEST_MEMORY_MIGRATION_004'
        facade = LeanRC::Facade.getInstance KEY
        class Test extends LeanRC
          @inheritProtected()
          @root __dirname
          @initialize()
        class MemoryCollection extends LeanRC::Collection
          @inheritProtected()
          @include LeanRC::MemoryCollectionMixin
          @include LeanRC::GenerateUuidIdMixin
          @module Test
          @initialize()
        class TestRecord extends LeanRC::Record
          @inheritProtected()
          @module Test
          @attr 'test': String
          @initialize()
        class BaseMigration extends LeanRC::Migration
          @inheritProtected()
          @include LeanRC::MemoryMigrationMixin
          @module Test
          @change ->
            @addField 'tests', 'test', type: 'number', default: 'Test1'
          @initialize()
        collection = MemoryCollection.new collectionName,
          delegate: 'BaseMigration'
        facade.registerProxy collection
        testsCollection = MemoryCollection.new 'TestsCollection',
          delegate: 'TestRecord'
        facade.registerProxy testsCollection
        yield testsCollection.create id: 1
        yield testsCollection.create id: 2
        yield testsCollection.create id: 3
        migration = BaseMigration.new {type: 'Test::BaseMigration'}, collection
        yield migration.up()
        for own id, doc of testsCollection[Symbol.for '~collection']
          assert.propertyVal doc, 'test', 'Test1'
        yield return
  describe '#addIndex', ->
    facade = null
    afterEach ->
      facade?.remove?()
    it 'should apply step to add index in collection', ->
      co ->
        collectionName = 'MigrationsCollection'
        KEY = 'TEST_MEMORY_MIGRATION_005'
        facade = LeanRC::Facade.getInstance KEY
        class Test extends LeanRC
          @inheritProtected()
          @root __dirname
          @initialize()
        class MemoryCollection extends LeanRC::Collection
          @inheritProtected()
          @include LeanRC::MemoryCollectionMixin
          @include LeanRC::GenerateUuidIdMixin
          @module Test
          @initialize()
        class BaseMigration extends LeanRC::Migration
          @inheritProtected()
          @include LeanRC::MemoryMigrationMixin
          @module Test
          @change ->
            @addIndex 'collectionName', ['attr1', 'attr2'], type: "hash"
          @initialize()
        collection = MemoryCollection.new collectionName,
          delegate: 'BaseMigration'
        facade.registerProxy collection
        migration = BaseMigration.new {type: 'Test::BaseMigration'}, collection
        spyAddIndex = sinon.spy migration, 'addIndex'
        yield migration.up()
        assert.isTrue spyAddIndex.calledWith 'collectionName', ['attr1', 'attr2'], type: "hash"
        yield return
  describe '#addTimestamps', ->
    facade = null
    afterEach ->
      facade?.remove?()
    it 'should apply step to add timesteps in collection', ->
      co ->
        collectionName = 'MigrationsCollection'
        KEY = 'TEST_MEMORY_MIGRATION_006'
        facade = LeanRC::Facade.getInstance KEY
        class Test extends LeanRC
          @inheritProtected()
          @root __dirname
          @initialize()
        class MemoryCollection extends LeanRC::Collection
          @inheritProtected()
          @include LeanRC::MemoryCollectionMixin
          @include LeanRC::GenerateUuidIdMixin
          @module Test
          @initialize()
        class TestRecord extends LeanRC::Record
          @inheritProtected()
          @module Test
          @attr 'test': String
          @initialize()
        class BaseMigration extends LeanRC::Migration
          @inheritProtected()
          @include LeanRC::MemoryMigrationMixin
          @module Test
          @change ->
            @addTimestamps 'tests'
          @initialize()
        collection = MemoryCollection.new collectionName,
          delegate: 'BaseMigration'
        facade.registerProxy collection
        testsCollection = MemoryCollection.new 'TestsCollection',
          delegate: 'TestRecord'
        facade.registerProxy testsCollection
        yield testsCollection.create id: 1
        yield testsCollection.create id: 2
        yield testsCollection.create id: 3
        migration = BaseMigration.new {type: 'Test::BaseMigration'}, collection
        yield migration.up()
        for own id, doc of testsCollection[Symbol.for '~collection']
          assert.property doc, 'createdAt'
          assert.property doc, 'updatedAt'
          assert.property doc, 'updatedAt'
        yield return
  describe '#changeCollection', ->
    facade = null
    afterEach ->
      facade?.remove?()
    it 'should apply step to change collection', ->
      co ->
        collectionName = 'MigrationsCollection'
        KEY = 'TEST_MEMORY_MIGRATION_007'
        facade = LeanRC::Facade.getInstance KEY
        class Test extends LeanRC
          @inheritProtected()
          @root __dirname
          @initialize()
        class MemoryCollection extends LeanRC::Collection
          @inheritProtected()
          @include LeanRC::MemoryCollectionMixin
          @include LeanRC::GenerateUuidIdMixin
          @module Test
          @initialize()
        class BaseMigration extends LeanRC::Migration
          @inheritProtected()
          @include LeanRC::MemoryMigrationMixin
          @module Test
          @change ->
            @changeCollection 'collectionName', {prop: 'prop'}
          @initialize()
        collection = MemoryCollection.new collectionName,
          delegate: 'BaseMigration'
        facade.registerProxy collection
        migration = BaseMigration.new {type: 'Test::BaseMigration'}, collection
        spyChangeCollection = sinon.spy migration, 'changeCollection'
        yield migration.up()
        assert.isTrue spyChangeCollection.calledWith 'collectionName', {prop: 'prop'}
        yield return
  describe '#changeField', ->
    facade = null
    afterEach ->
      facade?.remove?()
    it 'should apply step to change field in collection', ->
      co ->
        collectionName = 'MigrationsCollection'
        KEY = 'TEST_MEMORY_MIGRATION_008'
        facade = LeanRC::Facade.getInstance KEY
        class Test extends LeanRC
          @inheritProtected()
          @root __dirname
          @initialize()
        class MemoryCollection extends LeanRC::Collection
          @inheritProtected()
          @include LeanRC::MemoryCollectionMixin
          @include LeanRC::GenerateUuidIdMixin
          @module Test
          @initialize()
        class TestRecord extends LeanRC::Record
          @inheritProtected()
          @module Test
          @attr 'test': String
          @initialize()
        class BaseMigration extends LeanRC::Migration
          @inheritProtected()
          @include LeanRC::MemoryMigrationMixin
          @module Test
          @change ->
            @changeField 'tests', 'test', type: LeanRC::Migration::SUPPORTED_TYPES.number
          @initialize()
        collection = MemoryCollection.new collectionName,
          delegate: 'BaseMigration'
        facade.registerProxy collection
        testsCollection = MemoryCollection.new 'TestsCollection',
          delegate: 'TestRecord'
        facade.registerProxy testsCollection
        yield testsCollection.create test: '42'
        yield testsCollection.create test: '42'
        yield testsCollection.create test: '42'
        migration = BaseMigration.new {type: 'Test::BaseMigration'}, collection
        yield migration.up()
        for own id, doc of testsCollection[Symbol.for '~collection']
          assert.propertyVal doc, 'test', 42
        yield return
  describe '#renameField', ->
    facade = null
    afterEach ->
      facade?.remove?()
    it 'should apply step to rename field in collection', ->
      co ->
        collectionName = 'MigrationsCollection'
        KEY = 'TEST_MEMORY_MIGRATION_009'
        facade = LeanRC::Facade.getInstance KEY
        class Test extends LeanRC
          @inheritProtected()
          @root __dirname
          @initialize()
        class MemoryCollection extends LeanRC::Collection
          @inheritProtected()
          @include LeanRC::MemoryCollectionMixin
          @include LeanRC::GenerateUuidIdMixin
          @module Test
          @initialize()
        class TestRecord extends LeanRC::Record
          @inheritProtected()
          @module Test
          @attr 'test': String
          @initialize()
        class BaseMigration extends LeanRC::Migration
          @inheritProtected()
          @include LeanRC::MemoryMigrationMixin
          @module Test
          @change ->
            @renameField 'tests', 'test', 'test1'
          @initialize()
        collection = MemoryCollection.new collectionName,
          delegate: 'BaseMigration'
        facade.registerProxy collection
        testsCollection = MemoryCollection.new 'TestsCollection',
          delegate: 'TestRecord'
        facade.registerProxy testsCollection
        yield testsCollection.create test: '42'
        yield testsCollection.create test: '42'
        yield testsCollection.create test: '42'
        migration = BaseMigration.new {type: 'Test::BaseMigration'}, collection
        yield migration.up()
        for own id, doc of testsCollection[Symbol.for '~collection']
          assert.notProperty doc, 'test'
          assert.property doc, 'test1'
          assert.propertyVal doc, 'test1', '42'
        yield return
  describe '#renameIndex', ->
    facade = null
    afterEach ->
      facade?.remove?()
    it 'should apply step to rename index in collection', ->
      co ->
        collectionName = 'MigrationsCollection'
        KEY = 'TEST_MEMORY_MIGRATION_010'
        facade = LeanRC::Facade.getInstance KEY
        class Test extends LeanRC
          @inheritProtected()
          @root __dirname
          @initialize()
        class MemoryCollection extends LeanRC::Collection
          @inheritProtected()
          @include LeanRC::MemoryCollectionMixin
          @include LeanRC::GenerateUuidIdMixin
          @module Test
          @initialize()
        class BaseMigration extends LeanRC::Migration
          @inheritProtected()
          @include LeanRC::MemoryMigrationMixin
          @module Test
          @change ->
            @renameIndex 'collectionName', 'oldIndexname', 'newIndexName'
          @initialize()
        collection = MemoryCollection.new collectionName,
          delegate: 'BaseMigration'
        facade.registerProxy collection
        migration = BaseMigration.new {type: 'Test::BaseMigration'}, collection
        spyRenameIndex = sinon.spy migration, 'renameIndex'
        yield migration.up()
        assert.isTrue spyRenameIndex.calledWith 'collectionName', 'oldIndexname', 'newIndexName'
        yield return
  describe '#renameCollection', ->
    facade = null
    afterEach ->
      facade?.remove?()
    it 'should apply step to rename collection', ->
      co ->
        collectionName = 'MigrationsCollection'
        KEY = 'TEST_MEMORY_MIGRATION_011'
        facade = LeanRC::Facade.getInstance KEY
        class Test extends LeanRC
          @inheritProtected()
          @root __dirname
          @initialize()
        class MemoryCollection extends LeanRC::Collection
          @inheritProtected()
          @include LeanRC::MemoryCollectionMixin
          @include LeanRC::GenerateUuidIdMixin
          @module Test
          @initialize()
        class BaseMigration extends LeanRC::Migration
          @inheritProtected()
          @include LeanRC::MemoryMigrationMixin
          @module Test
          @change ->
            @renameCollection 'oldCollectionName', 'newCollectionName'
          @initialize()
        collection = MemoryCollection.new collectionName,
          delegate: 'BaseMigration'
        facade.registerProxy collection
        migration = BaseMigration.new {type: 'Test::BaseMigration'}, collection
        spyRenameCollection = sinon.spy migration, 'renameCollection'
        yield migration.up()
        assert.isTrue spyRenameCollection.calledWith 'oldCollectionName', 'newCollectionName'
        yield return
  describe '#dropCollection', ->
    facade = null
    afterEach ->
      facade?.remove?()
    it 'should apply step to drop collection', ->
      co ->
        collectionName = 'MigrationsCollection'
        KEY = 'TEST_MEMORY_MIGRATION_012'
        facade = LeanRC::Facade.getInstance KEY
        class Test extends LeanRC
          @inheritProtected()
          @root __dirname
          @initialize()
        class MemoryCollection extends LeanRC::Collection
          @inheritProtected()
          @include LeanRC::MemoryCollectionMixin
          @include LeanRC::GenerateUuidIdMixin
          @module Test
          @initialize()
        class TestRecord extends LeanRC::Record
          @inheritProtected()
          @module Test
          @attr 'test': String
          @initialize()
        class BaseMigration extends LeanRC::Migration
          @inheritProtected()
          @include LeanRC::MemoryMigrationMixin
          @module Test
          @change ->
            @dropCollection 'tests'
          @initialize()
        collection = MemoryCollection.new collectionName,
          delegate: 'BaseMigration'
        facade.registerProxy collection
        testsCollection = MemoryCollection.new 'TestsCollection',
          delegate: 'TestRecord'
        facade.registerProxy testsCollection
        yield testsCollection.create test: '42'
        yield testsCollection.create test: '42'
        yield testsCollection.create test: '42'
        migration = BaseMigration.new {type: 'Test::BaseMigration'}, collection
        yield migration.up()
        assert.deepEqual testsCollection[Symbol.for '~collection'], {}
        yield return
  describe '#dropEdgeCollection', ->
    facade = null
    afterEach ->
      facade?.remove?()
    it 'should apply step to drop edge collection', ->
      co ->
        collectionName = 'MigrationsCollection'
        KEY = 'TEST_MEMORY_MIGRATION_013'
        facade = LeanRC::Facade.getInstance KEY
        class Test extends LeanRC
          @inheritProtected()
          @root __dirname
          @initialize()
        class MemoryCollection extends LeanRC::Collection
          @inheritProtected()
          @include LeanRC::MemoryCollectionMixin
          @include LeanRC::GenerateUuidIdMixin
          @module Test
          @initialize()
        class TestRecord extends LeanRC::Record
          @inheritProtected()
          @module Test
          @attr 'test': String
          @initialize()
        class BaseMigration extends LeanRC::Migration
          @inheritProtected()
          @include LeanRC::MemoryMigrationMixin
          @module Test
          @change ->
            @dropEdgeCollection 'Tests1', 'Tests2'
          @initialize()
        collection = MemoryCollection.new collectionName,
          delegate: 'BaseMigration'
        facade.registerProxy collection
        testsCollection = MemoryCollection.new 'Tests1Tests2Collection',
          delegate: 'TestRecord'
        facade.registerProxy testsCollection
        yield testsCollection.create test: '42'
        yield testsCollection.create test: '42'
        yield testsCollection.create test: '42'
        migration = BaseMigration.new {type: 'Test::BaseMigration'}, collection
        yield migration.up()
        assert.deepEqual testsCollection[Symbol.for '~collection'], {}
        yield return
  describe '#removeField', ->
    facade = null
    afterEach ->
      facade?.remove?()
    it 'should apply step to remove field in collection', ->
      co ->
        collectionName = 'MigrationsCollection'
        KEY = 'TEST_MEMORY_MIGRATION_014'
        facade = LeanRC::Facade.getInstance KEY
        class Test extends LeanRC
          @inheritProtected()
          @root __dirname
          @initialize()
        class MemoryCollection extends LeanRC::Collection
          @inheritProtected()
          @include LeanRC::MemoryCollectionMixin
          @include LeanRC::GenerateUuidIdMixin
          @module Test
          @initialize()
        class TestRecord extends LeanRC::Record
          @inheritProtected()
          @module Test
          @attr 'test': String
          @initialize()
        class BaseMigration extends LeanRC::Migration
          @inheritProtected()
          @include LeanRC::MemoryMigrationMixin
          @module Test
          @change ->
            @removeField 'tests', 'test'
          @initialize()
        collection = MemoryCollection.new collectionName,
          delegate: 'BaseMigration'
        facade.registerProxy collection
        testsCollection = MemoryCollection.new 'TestsCollection',
          delegate: 'TestRecord'
        facade.registerProxy testsCollection
        yield testsCollection.create test: '42'
        yield testsCollection.create test: '42'
        yield testsCollection.create test: '42'
        migration = BaseMigration.new {type: 'Test::BaseMigration'}, collection
        yield migration.up()
        for own id, doc of testsCollection[Symbol.for '~collection']
          assert.notProperty doc, 'test'
        yield return
  describe '#removeIndex', ->
    facade = null
    afterEach ->
      facade?.remove?()
    it 'should apply step to remove index in collection', ->
      co ->
        collectionName = 'MigrationsCollection'
        KEY = 'TEST_MEMORY_MIGRATION_015'
        facade = LeanRC::Facade.getInstance KEY
        class Test extends LeanRC
          @inheritProtected()
          @root __dirname
          @initialize()
        class MemoryCollection extends LeanRC::Collection
          @inheritProtected()
          @include LeanRC::MemoryCollectionMixin
          @include LeanRC::GenerateUuidIdMixin
          @module Test
          @initialize()
        class BaseMigration extends LeanRC::Migration
          @inheritProtected()
          @include LeanRC::MemoryMigrationMixin
          @module Test
          @change ->
            @removeIndex 'collectionName', ['attr1', 'attr2'], {
              type: "hash"
              unique: yes
              sparse: no
            }
          @initialize()
        collection = MemoryCollection.new collectionName,
          delegate: 'BaseMigration'
        facade.registerProxy collection
        migration = BaseMigration.new {type: 'Test::BaseMigration'}, collection
        spyRemoveIndex = sinon.spy migration, 'removeIndex'
        yield migration.up()
        assert.isTrue spyRemoveIndex.calledWith 'collectionName', ['attr1', 'attr2'], {
          type: "hash"
          unique: yes
          sparse: no
        }
        yield return
  describe '#removeTimestamps', ->
    facade = null
    afterEach ->
      facade?.remove?()
    it 'should apply step to remove timestamps in collection', ->
      co ->
        collectionName = 'MigrationsCollection'
        KEY = 'TEST_MEMORY_MIGRATION_016'
        facade = LeanRC::Facade.getInstance KEY
        class Test extends LeanRC
          @inheritProtected()
          @root __dirname
          @initialize()
        class MemoryCollection extends LeanRC::Collection
          @inheritProtected()
          @include LeanRC::MemoryCollectionMixin
          @include LeanRC::GenerateUuidIdMixin
          @module Test
          @initialize()
        class TestRecord extends LeanRC::Record
          @inheritProtected()
          @module Test
          @attr 'test': String
          @initialize()
        class BaseMigration extends LeanRC::Migration
          @inheritProtected()
          @include LeanRC::MemoryMigrationMixin
          @module Test
          @change ->
            @removeTimestamps 'tests'
          @initialize()
        collection = MemoryCollection.new collectionName,
          delegate: 'BaseMigration'
        facade.registerProxy collection
        testsCollection = MemoryCollection.new 'TestsCollection',
          delegate: 'TestRecord'
        facade.registerProxy testsCollection
        DATE = new Date()
        yield testsCollection.create test: '42', createdAt: DATE
        yield testsCollection.create test: '42', createdAt: DATE
        yield testsCollection.create test: '42', createdAt: DATE
        migration = BaseMigration.new {type: 'Test::BaseMigration'}, collection
        for own id, doc of testsCollection[Symbol.for '~collection']
          assert.property doc, 'createdAt'
          assert.property doc, 'updatedAt'
          assert.property doc, 'deletedAt'
        yield migration.up()
        for own id, doc of testsCollection[Symbol.for '~collection']
          assert.notProperty doc, 'createdAt'
          assert.notProperty doc, 'updatedAt'
          assert.notProperty doc, 'deletedAt'
        yield return
