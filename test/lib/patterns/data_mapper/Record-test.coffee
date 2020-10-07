{ expect, assert } = require 'chai'
sinon = require 'sinon'
_ = require 'lodash'
RC = require '@leansdk/rc/lib'
LeanRC = require.main.require 'lib'
{
  FuncG, SubsetG
  RecordInterface
  Record
  Utils: { co }
} = LeanRC::

describe 'Record', ->
  describe '.new', ->
    facade = null
    afterEach ->
      facade?.remove?()
    it 'should create record instance', ->
      expect ->
        collectionName = 'TestsCollection'
        KEY = 'TEST_RECORD_001'
        facade = LeanRC::Facade.getInstance KEY
        class Test extends LeanRC
          @inheritProtected()
          @initialize()
        class TestsCollection extends Test::Collection
          @inheritProtected()
          @include LeanRC::MemoryCollectionMixin
          @include LeanRC::GenerateUuidIdMixin
          @module Test
          @initialize()
        class TestRecord extends LeanRC::Record
          @inheritProtected()
          @module Test
          @attr test: String
          @initialize()
        collection = TestsCollection.new collectionName,
          delegate: 'TestRecord'
        facade.registerProxy collection
        record = TestRecord.new {type: 'Test::TestRecord'}, collection
        assert.instanceOf record, TestRecord, 'Not a TestRecord'
        assert.instanceOf record, LeanRC::Record, 'Not a Record'
      .to.not.throw Error
  describe '.parseRecordName', ->
    it 'should record name from text', ->
      expect ->
        class Test extends LeanRC
          @inheritProtected()
          @initialize()
        class TestsCollection extends Test::Collection
          @inheritProtected()
          @include LeanRC::MemoryCollectionMixin
          @include LeanRC::GenerateUuidIdMixin
          @module Test
          @initialize()
        class TestRecord extends LeanRC::Record
          @inheritProtected()
          @module Test
          @public @static findRecordByName: FuncG(String, SubsetG RecordInterface),
            default: (asType) ->
              TestRecord
          @attr test: String
          @initialize()
        parsedName = TestRecord.parseRecordName 'test-record'
        assert.deepEqual parsedName, ['Test', 'TestRecord'], 'Parsed incorrectly'
        parsedName = TestRecord.parseRecordName 'Tester::Test'
        assert.deepEqual parsedName, ['Tester', 'TestRecord'], 'Parsed incorrectly'
      .to.not.throw Error
  describe '#parseRecordName', ->
    facade = null
    afterEach ->
      facade?.remove?()
    it 'should record name in instance from text', ->
      expect ->
        collectionName = 'TestsCollection'
        KEY = 'TEST_RECORD_003'
        facade = LeanRC::Facade.getInstance KEY
        class Test extends LeanRC
          @inheritProtected()
          @initialize()
        class TestsCollection extends Test::Collection
          @inheritProtected()
          @include LeanRC::MemoryCollectionMixin
          @include LeanRC::GenerateUuidIdMixin
          @module Test
          @initialize()
        class TestRecord extends LeanRC::Record
          @inheritProtected()
          @module Test
          @public @static findRecordByName: FuncG(String, SubsetG RecordInterface),
            default: (asType) ->
              TestRecord
          @attr test: String
          @initialize()
        collection = TestsCollection.new collectionName,
          delegate: 'TestRecord'
        facade.registerProxy collection
        vsRecord = TestRecord.new {type: 'Test::TestRecord'}, collection
        parsedName = vsRecord.parseRecordName 'test-record'
        assert.deepEqual parsedName, ['Test', 'TestRecord'], 'Parsed incorrectly'
        parsedName = vsRecord.parseRecordName 'Tester::Test'
        assert.deepEqual parsedName, ['Tester', 'TestRecord'], 'Parsed incorrectly'
      .to.not.throw Error
  describe '.parentClassNames', ->
    it 'should get records class parent class names', ->
      expect ->
        class Test extends LeanRC
          @inheritProtected()
          @initialize()
        class TestsCollection extends Test::Collection
          @inheritProtected()
          @include LeanRC::MemoryCollectionMixin
          @include LeanRC::GenerateUuidIdMixin
          @module Test
          @initialize()
        class TestRecord extends LeanRC::Record
          @inheritProtected()
          @module Test
          @public @static findRecordByName: FuncG(String, SubsetG RecordInterface),
            default: (asType) ->
              TestRecord
          @attr test: String
          @initialize()
        classNames = TestRecord.parentClassNames()
        assert.deepEqual classNames, [ 'CoreObject', 'ChainsMixin', 'Record', 'TestRecord' ], 'Parsed incorrectly'
      .to.not.throw Error
  describe '.attribute, .attr', ->
    it 'should define attributes for class', ->
      expect ->
        class Test extends LeanRC
          @inheritProtected()
          @initialize()
        class TestsCollection extends Test::Collection
          @inheritProtected()
          @include LeanRC::MemoryCollectionMixin
          @include LeanRC::GenerateUuidIdMixin
          @module Test
          @initialize()
        class TestRecord extends LeanRC::Record
          @inheritProtected()
          @module Test
          @public @static findRecordByName: FuncG(String, SubsetG RecordInterface),
            default: (asType) -> TestRecord
          @attribute string: String
          @attr number: Number
          @attr date: Date
          @attr boolean: Boolean
          @initialize()
        assert.isTrue 'string' of TestRecord.attributes, 'Attribute `string` did not defined'
        assert.isTrue 'number' of TestRecord.attributes, 'Attribute `number` did not defined'
        assert.isTrue 'boolean' of TestRecord.attributes, 'Attribute `boolean` did not defined'
        assert.isTrue 'date' of TestRecord.attributes, 'Attribute `date` did not defined'
      .to.not.throw Error
  describe '.computed, .comp', ->
    it 'should define computed properties for class', ->
      expect ->
        class Test extends LeanRC
          @inheritProtected()
          @initialize()
        class TestsCollection extends Test::Collection
          @inheritProtected()
          @include LeanRC::MemoryCollectionMixin
          @include LeanRC::GenerateUuidIdMixin
          @module Test
          @initialize()
        class TestRecord extends LeanRC::Record
          @inheritProtected()
          @module Test
          @public @static findRecordByName: FuncG(String, SubsetG RecordInterface),
            default: (asType) -> TestRecord
          @attr test: String
          @computed string: String,
            get: (aoData) -> aoData
          @comp number: Number,
            get: (aoData) -> aoData
          @computed boolean: Boolean,
            get: (aoData) -> aoData
          @comp date: Date,
            get: (aoData) -> aoData
          @initialize()
        assert.isTrue 'string' of TestRecord.computeds, 'Computed property `string` did not defined'
        assert.isTrue 'number' of TestRecord.computeds, 'Computed property `number` did not defined'
        assert.isTrue 'boolean' of TestRecord.computeds, 'Computed property `boolean` did not defined'
        assert.isTrue 'date' of TestRecord.computeds, 'Computed property `date` did not defined'
      .to.not.throw Error
  describe '#create, #isNew', ->
    facade = null
    afterEach ->
      facade?.remove?()
    it 'should create new record', ->
      co ->
        collectionName = 'TestsCollection'
        KEY = 'TEST_RECORD_007'
        facade = LeanRC::Facade.getInstance KEY
        class Test extends LeanRC
          @inheritProtected()
          @initialize()
        class TestsCollection extends Test::Collection
          @inheritProtected()
          @include LeanRC::MemoryCollectionMixin
          @include LeanRC::GenerateUuidIdMixin
          @module Test
          @initialize()
        class TestRecord extends LeanRC::Record
          @inheritProtected()
          @module Test
          @public @static findRecordByName: FuncG(String, SubsetG RecordInterface),
            default: (asType) -> TestRecord
          @attr test: String
          @initialize()
        collection = TestsCollection.new collectionName,
          delegate: 'TestRecord'
        facade.registerProxy collection
        record = TestRecord.new {type: 'Test::TestRecord'}, collection
        assert.isTrue yield record.isNew(), 'Record is not new'
        yield record.create()
        assert.isFalse yield record.isNew(), 'Record is still new'
        yield return
  describe '#destroy', ->
    facade = null
    afterEach ->
      facade?.remove?()
    it 'should remove record', ->
      co ->
        collectionName = 'TestsCollection'
        KEY = 'TEST_RECORD_008'
        facade = LeanRC::Facade.getInstance KEY
        class Test extends LeanRC
          @inheritProtected()
          @initialize()
        class TestsCollection extends Test::Collection
          @inheritProtected()
          @include LeanRC::MemoryCollectionMixin
          @include LeanRC::GenerateUuidIdMixin
          @module Test
          @initialize()
        class TestRecord extends LeanRC::Record
          @inheritProtected()
          @module Test
          @public @static findRecordByName: FuncG(String, SubsetG RecordInterface),
            default: (asType) -> TestRecord
          @attr test: String
          @initialize()
        collection = TestsCollection.new collectionName,
          delegate: 'TestRecord'
        facade.registerProxy collection
        record = TestRecord.new
          type: 'Test::TestRecord'
        , collection
        assert.isTrue (yield record.isNew()), 'Record is not new'
        yield record.create()
        assert.isFalse (yield record.isNew()), 'Record is still new'
        yield record.destroy()
        assert.isFalse (yield collection.find(record.id))?, 'Record still in collection'
        yield return
  describe '#update', ->
    facade = null
    afterEach ->
      facade?.remove?()
    it 'should update record', ->
      co ->
        collectionName = 'TestsCollection'
        KEY = 'TEST_RECORD_009'
        facade = LeanRC::Facade.getInstance KEY
        class Test extends LeanRC
          @inheritProtected()
          @initialize()
        class TestsCollection extends Test::Collection
          @inheritProtected()
          @include LeanRC::MemoryCollectionMixin
          @include LeanRC::GenerateUuidIdMixin
          @module Test
          @initialize()
        class TestRecord extends LeanRC::Record
          @inheritProtected()
          @module Test
          @public @static findRecordByName: FuncG(String, SubsetG RecordInterface),
            default: (asType) -> TestRecord
          @attr test: String
          @initialize()
        collection = TestsCollection.new collectionName,
          delegate: 'TestRecord'
        facade.registerProxy collection
        record = TestRecord.new
          type: 'Test::TestRecord'
          test: 'test1'
        , collection
        yield record.create()
        assert.equal (yield collection.find record.id).test, 'test1', 'Initial attr not saved'
        record.test = 'test2'
        yield record.update()
        assert.equal (yield collection.find record.id).test, 'test2', 'Updated attr not saved'
        yield return
  describe '#clone', ->
    facade = null
    afterEach ->
      facade?.remove?()
    it 'should clone record', ->
      co ->
        collectionName = 'TestsCollection'
        KEY = 'TEST_RECORD_010'
        facade = LeanRC::Facade.getInstance KEY
        class Test extends LeanRC
          @inheritProtected()
          @initialize()
        class TestsCollection extends Test::Collection
          @inheritProtected()
          @include LeanRC::MemoryCollectionMixin
          @include LeanRC::GenerateUuidIdMixin
          @module Test
          @initialize()
        class TestRecord extends LeanRC::Record
          @inheritProtected()
          @module Test
          @public @static findRecordByName: FuncG(String, SubsetG RecordInterface),
            default: (asType) -> Test::TestRecord
          @attr test: String
          @initialize()
        collection = TestsCollection.new collectionName,
          delegate: 'TestRecord'
        facade.registerProxy collection
        record = TestRecord.new
          type: 'Test::TestRecord'
          test: 'test1'
        , collection
        recordCopy = yield record.clone()
        assert.equal record.test, recordCopy.test
        assert.notEqual record.id, recordCopy.id
  describe '#save', ->
    facade = null
    afterEach ->
      facade?.remove?()
    it 'should save record', ->
      co ->
        collectionName = 'TestsCollection'
        KEY = 'TEST_RECORD_011'
        facade = LeanRC::Facade.getInstance KEY
        class Test extends LeanRC
          @inheritProtected()
          @initialize()
        class TestsCollection extends Test::Collection
          @inheritProtected()
          @include LeanRC::MemoryCollectionMixin
          @include LeanRC::GenerateUuidIdMixin
          @module Test
          @initialize()
        class TestRecord extends LeanRC::Record
          @inheritProtected()
          @module Test
          @public @static findRecordByName: FuncG(String, SubsetG RecordInterface),
            default: (asType) -> TestRecord
          @attr test: String
          @initialize()
        collection = TestsCollection.new collectionName,
          delegate: 'TestRecord'
        facade.registerProxy collection
        record = TestRecord.new
          type: 'Test::TestRecord'
          test: 'test1'
        , collection
        yield record.save()
        assert.isTrue (yield collection.find(record.id))?, 'Record is not saved'
        yield return
  describe '#delete', ->
    facade = null
    afterEach ->
      facade?.remove?()
    it 'should create and then delete a record', ->
      co ->
        collectionName = 'TestsCollection'
        KEY = 'TEST_RECORD_012'
        facade = LeanRC::Facade.getInstance KEY
        class Test extends LeanRC
          @inheritProtected()
          @initialize()
        class TestsCollection extends Test::Collection
          @inheritProtected()
          @include LeanRC::MemoryCollectionMixin
          @include LeanRC::GenerateUuidIdMixin
          @module Test
          @initialize()
        class TestRecord extends LeanRC::Record
          @inheritProtected()
          @module Test
          @public @static findRecordByName: FuncG(String, SubsetG RecordInterface),
            default: (asType) -> TestRecord
          @attr test: String
          @initialize()
        collection = TestsCollection.new collectionName,
          delegate: 'TestRecord'
        facade.registerProxy collection
        record = TestRecord.new
          type: 'Test::TestRecord'
          test: 'test1'
        , collection
        yield record.save()
        assert.isTrue (yield collection.find(record.id))?, 'Record is not saved'
        yield record.delete()
        assert.isTrue (yield collection.find record.id).isHidden, 'Record is not marked as delete'
        yield return
  describe '#copy', ->
    facade = null
    afterEach ->
      facade?.remove?()
    it 'should create and then copy the record', ->
      co ->
        collectionName = 'TestsCollection'
        KEY = 'TEST_RECORD_013'
        facade = LeanRC::Facade.getInstance KEY
        class Test extends LeanRC
          @inheritProtected()
          @initialize()
        class TestsCollection extends Test::Collection
          @inheritProtected()
          @include LeanRC::MemoryCollectionMixin
          @include LeanRC::GenerateUuidIdMixin
          @module Test
          @initialize()
        class TestRecord extends LeanRC::Record
          @inheritProtected()
          @module Test
          @public @static findRecordByName: FuncG(String, SubsetG RecordInterface),
            default: (asType) -> TestRecord
          @attr test: String
          @initialize()
        collection = TestsCollection.new collectionName,
          delegate: 'TestRecord'
        facade.registerProxy collection
        record = TestRecord.new
          type: 'Test::TestRecord'
          test: 'test1'
        , collection
        yield record.save()
        assert.isTrue (yield collection.find(record.id))?, 'Record is not saved'
        newRecord = yield record.copy()
        assert.isTrue (yield collection.find(newRecord.id))?, 'Record copy not saved'
        yield return
  describe '#decrement, #increment, #toggle', ->
    facade = null
    afterEach ->
      facade?.remove?()
    it 'should decrease/increase value of number attribute and toggle boolean', ->
      co ->
        collectionName = 'TestsCollection'
        KEY = 'TEST_RECORD_014'
        facade = LeanRC::Facade.getInstance KEY
        class Test extends LeanRC
          @inheritProtected()
          @initialize()
        class TestsCollection extends Test::Collection
          @inheritProtected()
          @include LeanRC::MemoryCollectionMixin
          @include LeanRC::GenerateUuidIdMixin
          @module Test
          @initialize()
        class TestRecord extends LeanRC::Record
          @inheritProtected()
          @module Test
          @public @static findRecordByName: FuncG(String, SubsetG RecordInterface),
            default: (asType) -> TestRecord
          @attr test: Number
          @attr has: Boolean
          @initialize()
        collection = TestsCollection.new collectionName,
          delegate: 'TestRecord'
        facade.registerProxy collection
        record = TestRecord.new
          type: 'Test::TestRecord'
          test: 1000
          has: true
        , collection
        yield record.save()
        assert.equal record.test, 1000, 'Initial number value is incorrect'
        assert.isTrue record.has, 'Initial boolean value is incorrect'
        record.decrement 'test', 7
        assert.equal record.test, 993, 'Descreased number value is incorrect'
        record.increment 'test', 19
        assert.equal record.test, 1012, 'Increased number value is incorrect'
        record.toggle 'has'
        assert.isFalse record.has, 'Toggled boolean value is incorrect'
        record.toggle 'has'
        assert.isTrue record.has, 'Toggled boolean value is incorrect'
        yield return
  describe '#updateAttribute, #updateAttributes', ->
    facade = null
    afterEach ->
      facade?.remove?()
    it 'should update attributes', ->
      co ->
        collectionName = 'TestsCollection'
        KEY = 'TEST_RECORD_015'
        facade = LeanRC::Facade.getInstance KEY
        class Test extends LeanRC
          @inheritProtected()
          @initialize()
        class TestsCollection extends Test::Collection
          @inheritProtected()
          @include LeanRC::MemoryCollectionMixin
          @include LeanRC::GenerateUuidIdMixin
          @module Test
          @initialize()
        class TestRecord extends LeanRC::Record
          @inheritProtected()
          @module Test
          @public @static findRecordByName: FuncG(String, SubsetG RecordInterface),
            default: (asType) -> TestRecord
          @attr test: Number
          @attr has: Boolean
          @attr word: String
          @initialize()
        collection = TestsCollection.new collectionName,
          delegate: 'TestRecord'
        facade.registerProxy collection
        record = TestRecord.new
          type: 'Test::TestRecord'
          test: 1000
          has: true
          word: 'test'
        , collection
        record.save()
        assert.equal record.test, 1000, 'Initial number value is incorrect'
        assert.isTrue record.has, 'Initial boolean value is incorrect'
        record.updateAttribute 'test', 200
        assert.equal record.test, 200, 'Number attribue not updated correctly'
        record.updateAttribute 'word', 'word'
        assert.equal record.word, 'word', 'String attribue not updated correctly'
        record.updateAttribute 'has', no
        assert.equal record.has, no, 'Boolean attribue not updated correctly'
        record.updateAttributes test: 888, has: yes, word: 'other'
        assert.equal record.test, 888, 'Number attribue not updated correctly'
        assert.equal record.has, yes, 'Boolean attribue not updated correctly'
        assert.equal record.word, 'other', 'String attribue not updated correctly'
        yield return
  describe '#touch', ->
    facade = null
    afterEach ->
      facade?.remove?()
    it 'should save data with date', ->
      co ->
        collectionName = 'TestsCollection'
        KEY = 'TEST_RECORD_016'
        facade = LeanRC::Facade.getInstance KEY
        class Test extends LeanRC
          @inheritProtected()
          @initialize()
        class TestsCollection extends Test::Collection
          @inheritProtected()
          @include LeanRC::MemoryCollectionMixin
          @include LeanRC::GenerateUuidIdMixin
          @module Test
          @initialize()
        class BasicTestRecord extends LeanRC::Record
          @inheritProtected()
          @module Test
          @public @static findRecordByName: FuncG(String, SubsetG RecordInterface),
            default: (asType) -> BasicTestRecord
          @attribute test: Number
          @attribute has: Boolean
          @attribute word: String
          @initialize()
        class TestRecord extends BasicTestRecord
          @inheritProtected()
          @module Test
          @public @static findRecordByName: FuncG(String, SubsetG RecordInterface),
            default: (asType) -> TestRecord
          @attribute name: String
          @initialize()
        collection = TestsCollection.new collectionName,
          delegate: 'TestRecord'
        facade.registerProxy collection
        record = TestRecord.new
          type: 'Test::TestRecord'
          test: 1000
          has: true
          word: 'test'
          name: 'name'
        , collection
        yield record.touch()
        assert.equal (yield collection.find record.id).test, 1000, 'Number attribue `test` not updated correctly'
        assert.equal (yield collection.find record.id).has, yes, 'Boolean attribue `has` not updated correctly'
        assert.equal (yield collection.find record.id).word, 'test', 'String attribue `word` not updated correctly'
        assert.equal (yield collection.find record.id).name, 'name', 'String attribue `name` not updated correctly'
        assert.isAtMost (yield collection.find record.id).updatedAt, new Date(), 'Date attribue not updated correctly'
        yield return
  describe '#changedAttributes, #resetAttribute, #rollbackAttributes', ->
    facade = null
    afterEach ->
      facade?.remove?()
    it 'should test, reset and rollback attributes', ->
      co ->
        collectionName = 'TestsCollection'
        KEY = 'TEST_RECORD_017'
        facade = LeanRC::Facade.getInstance KEY
        class Test extends LeanRC
          @inheritProtected()
          @initialize()
        class TestsCollection extends Test::Collection
          @inheritProtected()
          @include LeanRC::MemoryCollectionMixin
          @include LeanRC::GenerateUuidIdMixin
          @module Test
          @initialize()
        class TestRecord extends LeanRC::Record
          @inheritProtected()
          @module Test
          @public @static findRecordByName: FuncG(String, SubsetG RecordInterface),
            default: (asType) -> TestRecord
          @attr test: Number
          @attr has: Boolean
          @attr word: String
          @initialize()
        collection = TestsCollection.new collectionName,
          delegate: 'TestRecord'
        facade.registerProxy collection
        record = TestRecord.new
          type: 'Test::TestRecord'
          test: 1000
          has: true
          word: 'test'
        , collection
        yield record.save()
        record.test = 888
        assert.deepEqual (yield record.changedAttributes()).test, [ 1000, 888 ], 'Update is incorrect'
        yield record.resetAttribute 'test'
        assert.isUndefined (yield record.changedAttributes()).test, 'Reset is incorrect'
        record.test = 888
        record.has = no
        record.word = 'other'
        yield record.rollbackAttributes()
        assert.equal record.test, 1000, 'Number attribue did not rolled back correctly'
        assert.equal record.has, yes, 'Boolean attribue did not rolled back correctly'
        assert.equal record.word, 'test', 'String attribue did not rolled back correctly'
        yield return
  describe '.normalize, .serialize', ->
    facade = null
    afterEach ->
      facade?.remove?()
    it 'should serialize and deserialize attributes', ->
      co ->
        collectionName = 'TestsCollection'
        KEY = 'TEST_RECORD_018'
        facade = LeanRC::Facade.getInstance KEY
        class Test extends LeanRC
          @inheritProtected()
          @initialize()
        class TestsCollection extends Test::Collection
          @inheritProtected()
          @include LeanRC::MemoryCollectionMixin
          @include LeanRC::GenerateUuidIdMixin
          @module Test
          @initialize()
        class TestRecord extends LeanRC::Record
          @inheritProtected()
          @module Test
          @public @static findRecordByName: FuncG(String, SubsetG RecordInterface),
            default: (asType) -> TestRecord
          @attr test: Number
          @attr has: Boolean
          @attr word: String
          @initialize()
        collection = TestsCollection.new collectionName,
          delegate: 'TestRecord'
        facade.registerProxy collection
        record = yield TestRecord.normalize
          type: 'Test::TestRecord'
          test: 1000
          has: true
          word: 'test'
        , collection
        assert.propertyVal record, 'test', 1000, 'Property `test` not defined'
        assert.propertyVal record, 'has', yes, 'Property `has` not defined'
        assert.propertyVal record, 'word', 'test', 'Property `word` not defined'
        assert.deepEqual record.changedAttributes(), {}, 'Attributes are altered'
        snapshot = yield TestRecord.serialize record
        assert.deepEqual snapshot, {
          id: null
          type: 'Test::TestRecord'
          isHidden: no
          rev: null
          type: 'Test::TestRecord'
          test: 1000
          has: true
          word: 'test'
          createdAt: null
          updatedAt: null
          deletedAt: null
        }, 'Snapshot is incorrect'
        yield return
  describe '.recoverize, .objectize', ->
    facade = null
    afterEach ->
      facade?.remove?()
    it 'should recoverize and objectize attributes', ->
      co ->
        collectionName = 'TestsCollection'
        KEY = 'TEST_RECORD_019'
        facade = LeanRC::Facade.getInstance KEY
        class Test extends LeanRC
          @inheritProtected()
          @initialize()
        class TestsCollection extends Test::Collection
          @inheritProtected()
          @include LeanRC::MemoryCollectionMixin
          @include LeanRC::GenerateUuidIdMixin
          @module Test
          @initialize()
        class TestRecord extends LeanRC::Record
          @inheritProtected()
          @module Test
          @public @static findRecordByName: FuncG(String, SubsetG RecordInterface),
            default: (asType) -> TestRecord
          @attr test: Number
          @attr has: Boolean
          @attr word: String
          @initialize()
        collection = TestsCollection.new collectionName,
          delegate: 'TestRecord'
        facade.registerProxy collection
        record = yield TestRecord.recoverize
          type: 'Test::TestRecord'
          test: 1000
          has: true
          word: 'test'
        , collection
        assert.propertyVal record, 'test', 1000, 'Property `test` not defined'
        assert.propertyVal record, 'has', yes, 'Property `has` not defined'
        assert.propertyVal record, 'word', 'test', 'Property `word` not defined'
        assert.deepEqual record.changedAttributes(), {}, 'Attributes are altered'
        snapshot = TestRecord.objectize record
        assert.deepEqual snapshot, {
          id: null
          type: 'Test::TestRecord'
          isHidden: no
          rev: null
          type: 'Test::TestRecord'
          test: 1000
          has: true
          word: 'test'
          createdAt: null
          updatedAt: null
          deletedAt: null
        }, 'JSON snapshot is incorrect'
        yield return
  describe '.makeSnapshot', ->
    facade = null
    afterEach ->
      facade?.remove?()
    it 'should make snapshot for ipoInternalRecord', ->
      co ->
        collectionName = 'TestsCollection'
        KEY = 'TEST_RECORD_020'
        facade = LeanRC::Facade.getInstance KEY
        class Test extends LeanRC
          @inheritProtected()
          @initialize()
        class TestsCollection extends Test::Collection
          @inheritProtected()
          @include LeanRC::MemoryCollectionMixin
          @include LeanRC::GenerateUuidIdMixin
          @module Test
          @initialize()
        class TestRecord extends LeanRC::Record
          @inheritProtected()
          @module Test
          @public @static findRecordByName: FuncG(String, SubsetG RecordInterface),
            default: (asType) -> TestRecord
          @attr test: Number
          @attr has: Boolean
          @attr word: String
          @initialize()
        collection = TestsCollection.new collectionName,
          delegate: 'TestRecord'
        facade.registerProxy collection
        record = yield TestRecord.normalize
          type: 'Test::TestRecord'
          test: 1000
          has: true
          word: 'test'
        , collection
        assert.propertyVal record, 'test', 1000, 'Property `test` not defined'
        assert.propertyVal record, 'has', yes, 'Property `has` not defined'
        assert.propertyVal record, 'word', 'test', 'Property `word` not defined'
        assert.deepEqual record.changedAttributes(), {}, 'Attributes are altered'
        snapshot = TestRecord.makeSnapshot record
        assert.deepEqual snapshot, {
          id: null
          type: 'Test::TestRecord'
          isHidden: no
          rev: null
          test: 1000
          has: yes
          word: 'test'
          createdAt: null
          updatedAt: null
          deletedAt: null
        }, 'JSON snapshot is incorrect'
        yield return
  describe '.replicateObject', ->
    facade = null
    afterEach ->
      facade?.remove?()
    it 'should create replica for record', ->
      co ->
        collectionName = 'TestsCollection'
        KEY = 'TEST_RECORD_021'
        facade = LeanRC::Facade.getInstance KEY
        class Test extends LeanRC
          @inheritProtected()
          @initialize()
        class TestsCollection extends LeanRC::Collection
          @inheritProtected()
          @include LeanRC::MemoryCollectionMixin
          @include LeanRC::GenerateUuidIdMixin
          @module Test
          @initialize()
        class TestRecord extends LeanRC::Record
          @inheritProtected()
          @module Test
          @public @static findRecordByName: FuncG(String, SubsetG RecordInterface),
            default: (asType) -> TestRecord
          @attr test: Number
          @attr has: Boolean
          @attr word: String
          @initialize()
        collection = TestsCollection.new collectionName,
          delegate: 'TestRecord'
        facade.registerProxy collection
        record = yield collection.create
          type: 'Test::TestRecord'
          test: 1000
          has: true
          word: 'test'
        replica = yield TestRecord.replicateObject record
        assert.deepEqual replica,
          type: 'instance'
          class: 'TestRecord'
          multitonKey: KEY
          collectionName: collectionName
          isNew: no
          id: record.id
        facade.remove()
        yield return
  describe '.restoreObject', ->
    facade = null
    afterEach ->
      facade?.remove?()
    it 'should restore record from replica', ->
      co ->
        collectionName = 'TestsCollection'
        KEY = 'TEST_RECORD_022'
        facade = LeanRC::Facade.getInstance KEY
        class Test extends LeanRC
          @inheritProtected()
          @initialize()
        class TestsCollection extends LeanRC::Collection
          @inheritProtected()
          @include LeanRC::MemoryCollectionMixin
          @include LeanRC::GenerateUuidIdMixin
          @module Test
          @initialize()
        class TestRecord extends LeanRC::Record
          @inheritProtected()
          @module Test
          @public @static findRecordByName: FuncG(String, SubsetG RecordInterface),
            default: (asType) -> TestRecord
          @attr test: Number
          @attr has: Boolean
          @attr word: String
          @initialize()
        collection = TestsCollection.new collectionName,
          delegate: 'TestRecord'
        facade.registerProxy collection
        record = yield collection.create
          type: 'Test::TestRecord'
          test: 1000
          has: true
          word: 'test'
        restoredRecord = yield TestRecord.restoreObject Test,
          type: 'instance'
          class: 'TestRecord'
          multitonKey: KEY
          collectionName: collectionName
          isNew: no
          id: record.id
        assert.notEqual record, restoredRecord
        assert.deepEqual record, restoredRecord
        record = yield collection.build(
          id: '123'
          type: 'Test::TestRecord'
          test: 1000
          has: true
          word: 'test'
        )
        restoredRecord = yield TestRecord.restoreObject Test,
          type: 'instance'
          class: 'TestRecord'
          multitonKey: KEY
          collectionName: collectionName
          isNew: yes
          attributes: id: '123', type: 'Test::TestRecord', test: 1000, has: yes, word: 'test'
        assert.notEqual record, restoredRecord
        assert.deepEqual record, restoredRecord
        facade.remove()
        yield return
  describe '#afterCreate', ->
    facade = null
    afterEach ->
      facade?.remove?()
    it 'should be called after create', ->
      co ->
        collectionName = 'TestsCollection'
        KEY = 'TEST_RECORD_023'
        facade = LeanRC::Facade.getInstance KEY
        class Test extends LeanRC
          @inheritProtected()
          @initialize()
        class TestsCollection extends LeanRC::Collection
          @inheritProtected()
          @include LeanRC::MemoryCollectionMixin
          @include LeanRC::GenerateUuidIdMixin
          @module Test
          @initialize()
        class TestRecord extends LeanRC::Record
          @inheritProtected()
          @module Test
          @initialize()
        collection = TestsCollection.new collectionName,
          delegate: 'TestRecord'
        facade.registerProxy collection
        spyRunNotitfication = sinon.spy collection, 'recordHasBeenChanged'
        record = yield collection.build {id: 123}
        yield record.save()
        assert.isTrue spyRunNotitfication.calledWith('createdRecord'), '`afterCreate` run incorrect'
        yield return
  describe '#beforeUpdate', ->
    facade = null
    afterEach ->
      facade?.remove?()
    it 'should be called before update', ->
      co ->
        collectionName = 'TestsCollection'
        KEY = 'TEST_RECORD_024'
        facade = LeanRC::Facade.getInstance KEY
        class Test extends LeanRC
          @inheritProtected()
          @initialize()
        class TestsCollection extends LeanRC::Collection
          @inheritProtected()
          @include LeanRC::MemoryCollectionMixin
          @include LeanRC::GenerateUuidIdMixin
          @module Test
          @initialize()
        class TestRecord extends LeanRC::Record
          @inheritProtected()
          @module Test
          @initialize()
        collection = TestsCollection.new collectionName,
          delegate: 'TestRecord'
        facade.registerProxy collection
        record = yield collection.build {id: 123}
        yield record.save()
        oldUpdatedAt = record.updatedAt
        updated = yield record.save()
        newUpdatedAt = record.updatedAt
        assert.notEqual oldUpdatedAt, newUpdatedAt, 'Record not updated'
        facade.remove()
  describe '#beforeCreate', ->
    facade = null
    afterEach ->
      facade?.remove?()
    it 'should be called before create', ->
      co ->
        collectionName = 'TestsCollection'
        KEY = 'TEST_RECORD_025'
        facade = LeanRC::Facade.getInstance KEY
        class Test extends LeanRC
          @inheritProtected()
          @initialize()
        class TestsCollection extends LeanRC::Collection
          @inheritProtected()
          @include LeanRC::MemoryCollectionMixin
          @include LeanRC::GenerateUuidIdMixin
          @module Test
          @initialize()
        class TestRecord extends LeanRC::Record
          @inheritProtected()
          @module Test
          @initialize()
        collection = TestsCollection.new collectionName,
          delegate: 'TestRecord'
        facade.registerProxy collection
        record = yield collection.build({type: 'Test::TestRecord'})
        assert.isUndefined record.id
        yield record.save()
        assert.isDefined record.id
        facade.remove()
  describe '#afterUpdate', ->
    facade = null
    afterEach ->
      facade?.remove?()
    it 'should be called after update', ->
      co ->
        collectionName = 'TestsCollection'
        KEY = 'TEST_RECORD_026'
        facade = LeanRC::Facade.getInstance KEY
        class Test extends LeanRC
          @inheritProtected()
          @initialize()
        class TestsCollection extends LeanRC::Collection
          @inheritProtected()
          @include LeanRC::MemoryCollectionMixin
          @include LeanRC::GenerateUuidIdMixin
          @module Test
          @initialize()
        class TestRecord extends LeanRC::Record
          @inheritProtected()
          @module Test
          @attribute test: String
          @initialize()
        collection = TestsCollection.new collectionName,
          delegate: 'TestRecord'
        facade.registerProxy collection
        spyRunNotitfication = sinon.spy collection, 'recordHasBeenChanged'
        record = yield collection.build {id: 123}
        yield record.save()
        updated = yield record.save()
        assert.isTrue spyRunNotitfication.calledWith('updatedRecord'), '`afterUpdate` run incorrect'
        facade.remove()
  describe '#beforeDelete', ->
    facade = null
    afterEach ->
      facade?.remove?()
    it 'should be called before delete', ->
      co ->
        collectionName = 'TestsCollection'
        KEY = 'TEST_RECORD_027'
        facade = LeanRC::Facade.getInstance KEY
        class Test extends LeanRC
          @inheritProtected()
          @initialize()
        class TestsCollection extends LeanRC::Collection
          @inheritProtected()
          @include LeanRC::MemoryCollectionMixin
          @include LeanRC::GenerateUuidIdMixin
          @module Test
          @initialize()
        class TestRecord extends LeanRC::Record
          @inheritProtected()
          @module Test
          @attribute test: String
          @initialize()
        collection = TestsCollection.new collectionName,
          delegate: 'TestRecord'
        facade.registerProxy collection
        record = yield collection.build {id: 123}
        yield record.save()
        oldUpdatedAt = record.updatedAt
        deleted = yield record.delete()
        newUpdatedAt = record.updatedAt
        assert.notEqual oldUpdatedAt, newUpdatedAt, 'Record not updated'
        assert.isDefined deleted.deletedAt, 'Record not deleted'
        assert.isTrue deleted.isHidden, 'Record not hidden'
        facade.remove()
  describe '#afterDelete', ->
    facade = null
    afterEach ->
      facade?.remove?()
    it 'should be called after delete', ->
      co ->
        collectionName = 'TestsCollection'
        KEY = 'TEST_RECORD_028'
        facade = LeanRC::Facade.getInstance KEY
        class Test extends LeanRC
          @inheritProtected()
          @initialize()
        class TestsCollection extends Test::Collection
          @inheritProtected()
          @include LeanRC::MemoryCollectionMixin
          @include LeanRC::GenerateUuidIdMixin
          @module Test
          @initialize()
        class TestRecord extends LeanRC::Record
          @inheritProtected()
          @module Test
          @attribute test: String
          @initialize()
        collection = TestsCollection.new collectionName,
          delegate: 'TestRecord'
        facade.registerProxy collection
        spyRunNotitfication = sinon.spy collection, 'recordHasBeenChanged'
        record = yield collection.build {id: 123}
        yield record.save()
        deleted = yield record.delete()
        assert.isTrue spyRunNotitfication.calledWith('deletedRecord'), '`afterDelete` run incorrect'
        facade.remove()
  describe '#afterDestroy', ->
    facade = null
    afterEach ->
      facade?.remove?()
    it 'should be called after destroy', ->
      co ->
        collectionName = 'TestsCollection'
        KEY = 'TEST_RECORD_029'
        facade = LeanRC::Facade.getInstance KEY
        class Test extends LeanRC
          @inheritProtected()
          @initialize()
        class TestsCollection extends LeanRC::Collection
          @inheritProtected()
          @include LeanRC::MemoryCollectionMixin
          @include LeanRC::GenerateUuidIdMixin
          @module Test
          @initialize()
        class TestRecord extends LeanRC::Record
          @inheritProtected()
          @module Test
          @attribute test: String
          @initialize()
        collection = TestsCollection.new collectionName,
          delegate: 'TestRecord'
        facade.registerProxy collection
        spyRunNotitfication = sinon.spy collection, 'recordHasBeenChanged'
        record = yield collection.build {id: 123}
        yield record.save()
        yield record.destroy()
        assert.isTrue spyRunNotitfication.calledWith('destroyedRecord'), '`afterDestroy` run incorrect'
        facade.remove()
