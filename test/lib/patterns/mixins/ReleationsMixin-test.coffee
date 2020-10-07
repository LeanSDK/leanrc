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

describe 'RelationsMixin', ->
  describe '.new', ->
    facade = null
    afterEach ->
      facade?.remove?()
    it 'should create item with record mixin', ->
      expect ->
        collectionName = 'TestsCollection'
        KEY = 'TEST_RELATIONS_MIXIN_001'
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
          @include LeanRC::RelationsMixin
          @module Test
          @public @static findRecordByName: FuncG(String, SubsetG RecordInterface),
            default: (asType) -> TestRecord
          @initialize()
        collection = TestsCollection.new collectionName,
          delegate: 'TestRecord'
        facade.registerProxy collection
        record = TestRecord.new {type: 'Test::TestRecord'}, collection
        assert.instanceOf record, TestRecord, 'record is not a TestRecord instance'
      .to.not.throw Error
  describe '.relatedTo', ->
    it 'relatedTo: should define one-to-one or one-to-many optional relation for class', ->
      co ->
        class Test extends LeanRC
          @inheritProtected()
          @initialize()
        class TestRecord extends LeanRC::Record
          @inheritProtected()
          @include LeanRC::RelationsMixin
          @module Test
          @public @static findRecordByName: FuncG(String, SubsetG RecordInterface),
            default: (asType) -> TestRecord
          @relatedTo relation: LeanRC::PromiseT,
            attr: 'relation_attr'
            refKey: 'id'
            recordName: -> 'TestRecord'
            collectionName: -> 'TestsCollection'
            through: ['tomatosRels', by: 'cucumberId']
            inverse: 'test'
          @initialize()
        { relation: relationData } = TestRecord.relations
        assert.equal relationData.refKey, 'id', 'Value of `refKey` is incorrect'
        assert.equal relationData.attr, 'relation_attr', 'Value of `attr` is incorrect'
        assert.equal relationData.inverse, 'test', 'Value of `inverse` is incorrect'
        assert.equal relationData.relation, 'relatedTo', 'Value of `relation` is incorrect'
        assert.deepEqual relationData.through, ['tomatosRels', by: 'cucumberId'], 'Value of `through` is incorrect'
        assert.isArray relationData.through, 'Value of `through` isn`t array'
        assert.isString relationData.through[0], 'Value of `through[0]` isn`t string'
        assert.isObject relationData.through[1], 'Value of `through[1]` isn`t object'
        assert.isString relationData.through[1].by, 'Value of `through[1].by` isn`t string'
        assert.equal relationData.recordName.call(Test::TestRecord), 'TestRecord', 'Value of `recordName` is incorrect'
        assert.equal relationData.collectionName.call(Test::TestRecord), 'TestsCollection', 'Value of `collectionName` is incorrect'
        yield return
    it 'relatedTo: should define options automatically', ->
      co ->
        class Test extends LeanRC
          @inheritProtected()
          @initialize()
        class TestRecord extends LeanRC::Record
          @inheritProtected()
          @include LeanRC::RelationsMixin
          @module Test
          @public @static findRecordByName: FuncG(String, SubsetG RecordInterface),
            default: (asType) -> TestRecord
          @relatedTo cucumber: LeanRC::PromiseT
          @initialize()
        { cucumber: relationData } = TestRecord.relations
        assert.equal relationData.attr, 'cucumberId', 'Value of `attr` is incorrect'
        assert.equal relationData.recordName.call(Test::TestRecord), 'CucumberRecord', 'Value of `recordName` is incorrect'
        assert.equal relationData.collectionName.call(Test::TestRecord), 'CucumbersCollection', 'Value of `collectionName` is incorrect'
        assert.equal relationData.inverse, 'tests', 'Value of `inverse` is incorrect'
        yield return
  describe '.belongsTo', ->
    it 'belongsTo: should define one-to-one or one-to-many parent relation for class', ->
      co ->
        class Test extends LeanRC
          @inheritProtected()
          @initialize()
        class TestRecord extends LeanRC::Record
          @inheritProtected()
          @include LeanRC::RelationsMixin
          @module Test
          @public @static findRecordByName: FuncG(String, SubsetG RecordInterface),
            default: (asType) -> TestRecord
          @belongsTo relation: LeanRC::PromiseT,
            attr: 'relation_attr'
            refKey: 'id'
            recordName: -> 'TestRecord'
            collectionName: -> 'TestsCollection'
            through: ['tomatosRels', by: 'cucumberId']
            inverse: 'test'
          @initialize()
        { relation: relationData } = TestRecord.relations
        assert.equal relationData.refKey, 'id', 'Value of `refKey` is incorrect'
        assert.equal relationData.attr, 'relation_attr', 'Value of `attr` is incorrect'
        assert.equal relationData.inverse, 'test', 'Value of `inverse` is incorrect'
        assert.equal relationData.relation, 'belongsTo', 'Value of `relation` is incorrect'
        assert.deepEqual relationData.through, ['tomatosRels', by: 'cucumberId'], 'Value of `through` is incorrect'
        assert.isArray relationData.through, 'Value of `through` isn`t array'
        assert.isString relationData.through[0], 'Value of `through[0]` isn`t string'
        assert.isObject relationData.through[1], 'Value of `through[1]` isn`t object'
        assert.isString relationData.through[1].by, 'Value of `through[1].by` isn`t string'
        assert.equal relationData.recordName.call(Test::TestRecord), 'TestRecord', 'Value of `recordName` is incorrect'
        assert.equal relationData.collectionName.call(Test::TestRecord), 'TestsCollection', 'Value of `collectionName` is incorrect'
        yield return
    it 'belongsTo: should define options automatically', ->
      co ->
        class Test extends LeanRC
          @inheritProtected()
          @initialize()
        class TestRecord extends LeanRC::Record
          @inheritProtected()
          @include LeanRC::RelationsMixin
          @module Test
          @public @static findRecordByName: FuncG(String, SubsetG RecordInterface),
            default: (asType) -> TestRecord
          @belongsTo cucumber: LeanRC::PromiseT
          @initialize()
        { cucumber: relationData } = TestRecord.relations
        assert.equal relationData.attr, 'cucumberId', 'Value of `attr` is incorrect'
        assert.equal relationData.recordName.call(Test::TestRecord), 'CucumberRecord', 'Value of `recordName` is incorrect'
        assert.equal relationData.collectionName.call(Test::TestRecord), 'CucumbersCollection', 'Value of `collectionName` is incorrect'
        assert.equal relationData.inverse, 'tests', 'Value of `inverse` is incorrect'
        yield return
  describe '.hasMany', ->
    it 'hasMany: should define one-to-one or one-to-many relation for class', ->
      co ->
        class Test extends LeanRC
          @inheritProtected()
          @initialize()
        class TestRecord extends LeanRC::Record
          @inheritProtected()
          @include LeanRC::RelationsMixin
          @module Test
          @public @static findRecordByName: FuncG(String, SubsetG RecordInterface),
            default: (asType) -> TestRecord
          @hasMany manyRelation: LeanRC::PromiseT,
            refKey: 'id'
            recordName: -> 'TestRecord'
            collectionName: -> 'TestsCollection'
            through: ['tomatosRels', by: 'cucumberId']
            inverse: 'test'
          @initialize()
        { manyRelation: relationData } = TestRecord.relations
        assert.equal relationData.refKey, 'id', 'Value of `refKey` is incorrect'
        assert.equal relationData.inverse, 'test', 'Value of `inverse` is incorrect'
        assert.equal relationData.relation, 'hasMany', 'Value of `relation` is incorrect'
        assert.deepEqual relationData.through, ['tomatosRels', by: 'cucumberId'], 'Value of `through` is incorrect'
        assert.isArray relationData.through, 'Value of `through` isn`t array'
        assert.isString relationData.through[0], 'Value of `through[0]` isn`t string'
        assert.isObject relationData.through[1], 'Value of `through[1]` isn`t object'
        assert.isString relationData.through[1].by, 'Value of `through[1].by` isn`t string'
        assert.equal relationData.recordName.call(Test::TestRecord), 'TestRecord', 'Value of `recordName` is incorrect'
        assert.equal relationData.collectionName.call(Test::TestRecord), 'TestsCollection', 'Value of `collectionName` is incorrect'
        yield return
  describe '.hasOne', ->
    it 'hasOne: should define many-to-one or many-to-one relation for class', ->
      co ->
        class Test extends LeanRC
          @inheritProtected()
          @initialize()
        class TestRecord extends LeanRC::Record
          @inheritProtected()
          @include LeanRC::RelationsMixin
          @module Test
          @public @static findRecordByName: FuncG(String, SubsetG RecordInterface),
            default: (asType) -> TestRecord
          @hasOne oneRelation: LeanRC::PromiseT,
            refKey: 'id'
            recordName: -> 'TestRecord'
            collectionName: -> 'TestsCollection'
            through: ['tomatosRels', by: 'cucumberId']
            inverse: 'test'
          @initialize()
        { oneRelation: relationData } = TestRecord.relations
        assert.equal relationData.refKey, 'id', 'Value of `refKey` is incorrect'
        assert.equal relationData.inverse, 'test', 'Value of `inverse` is incorrect'
        assert.equal relationData.relation, 'hasOne', 'Value of `relation` is incorrect'
        assert.deepEqual relationData.through, ['tomatosRels', by: 'cucumberId'], 'Value of `through` is incorrect'
        assert.isArray relationData.through, 'Value of `through` isn`t array'
        assert.isString relationData.through[0], 'Value of `through[0]` isn`t string'
        assert.isObject relationData.through[1], 'Value of `through[1]` isn`t object'
        assert.isString relationData.through[1].by, 'Value of `through[1].by` isn`t string'
        assert.equal relationData.recordName.call(Test::TestRecord), 'TestRecord', 'Value of `recordName` is incorrect'
        assert.equal relationData.collectionName.call(Test::TestRecord), 'TestsCollection', 'Value of `collectionName` is incorrect'
        yield return
  describe '.inverseFor', ->
    it 'should get inverse info', ->
      co ->
        class Test extends LeanRC
          @inheritProtected()
          @initialize()
        class RelationRecord extends LeanRC::Record
          @inheritProtected()
          @include LeanRC::RelationsMixin
          @module Test
          @hasOne test: LeanRC::PromiseT,
            inverse: 'relation_attr'
          @initialize()
        class TestRecord extends LeanRC::Record
          @inheritProtected()
          @include LeanRC::RelationsMixin
          @module Test
          @belongsTo relation: LeanRC::PromiseT,
            attr: 'relation_attr'
            refKey: 'id'
            inverse: 'test'
          @initialize()
        inverseInfo = TestRecord.inverseFor 'relation'
        assert.equal inverseInfo.recordClass, RelationRecord, 'Record class is incorrect'
        assert.equal inverseInfo.attrName,'test', 'Record class is incorrect'
        assert.equal inverseInfo.relation, 'hasOne', 'Record class is incorrect'
        yield return
