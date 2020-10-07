{ expect, assert } = require 'chai'
sinon = require 'sinon'
_ = require 'lodash'
LeanRC = require.main.require 'lib'
RC = require '@leansdk/rc/lib'
{
  FuncG, UnionG, SubsetG, MaybeG
  QueryInterface, RecordInterface, CursorInterface, CollectionInterface, NilT
  Cursor
  Utils: { co }
} = LeanRC::

describe 'QueryableCollectionMixin', ->
  describe '.new', ->
    it 'should create queryable instance', ->
      co ->
        class Test extends LeanRC
          @inheritProtected()
          @initialize()
        class Queryable extends RC::CoreObject
          @inheritProtected()
          @include LeanRC::QueryableCollectionMixin
          @module Test
          @public @async parseQuery: FuncG(
            [UnionG Object, QueryInterface]
            UnionG Object, String, QueryInterface
          ),
            default: (aoQuery) -> yield return aoQuery
          @public @async executeQuery: FuncG(
            [UnionG Object, String, QueryInterface]
            CursorInterface
          ),
            default: (aoParsedQuery) -> yield return aoParsedQuery
          @initialize()
        queryable = Queryable.new()
        assert.instanceOf queryable, Queryable
        yield return
  describe '#query', ->
    it 'should execute query', ->
      co ->
        class Test extends LeanRC
          @inheritProtected()
          @initialize()
        spyExecuteQuery = sinon.spy (aoParsedQuery) -> yield return Cursor.new null, [Symbol 'any']
        spyParseQuery = sinon.spy (aoQuery) -> yield return aoQuery
        class Queryable extends RC::CoreObject
          @inheritProtected()
          @include LeanRC::QueryableCollectionMixin
          @module Test
          @public @async parseQuery: FuncG(
            [UnionG Object, QueryInterface]
            UnionG Object, String, QueryInterface
          ),
            default: spyParseQuery
          @public @async executeQuery: FuncG(
            [UnionG Object, String, QueryInterface]
            CursorInterface
          ),
            default: spyExecuteQuery
          @initialize()
        queryable = Queryable.new()# Test::TestRecord, array
        query = { test: 'test' }
        yield queryable.query query
        assert.isTrue spyParseQuery.calledWith(query)
        assert.isTrue spyExecuteQuery.calledWith(query)
        yield return
  describe '#exists', ->
    facade = null
    afterEach ->
      facade?.remove?()
    it 'should check data existance by query', ->
      co ->
        KEY = 'FACADE_TEST_QUERYABLE_002'
        facade = LeanRC::Facade.getInstance KEY
        class Test extends LeanRC
          @inheritProtected()
          @initialize()
        class TestRecord extends LeanRC::Record
          @inheritProtected()
          @module Test
          @attribute test: String
          @initialize()
        class Queryable extends LeanRC::Collection
          @inheritProtected()
          @include LeanRC::QueryableCollectionMixin
          @module Test
          @public delegate: SubsetG(RecordInterface),
            default: TestRecord
          @public @async parseQuery: FuncG(
            [UnionG Object, QueryInterface]
            UnionG Object, String, QueryInterface
          ),
            default: (aoQuery) -> yield return aoQuery
          @public @async executeQuery: FuncG(
            [UnionG Object, String, QueryInterface]
            CursorInterface
          ),
            default: (aoParsedQuery) ->
              data = _.filter @getData(), aoParsedQuery.$filter
              yield return Cursor.new @, data
          @public @async update: FuncG([UnionG(String, Number), Object], RecordInterface),
            default: (id, item) ->
              record = yield @find id
              record[key] = value  for own key, value of item
              yield return record
          @public @async push: FuncG(RecordInterface, RecordInterface),
            default: (record) ->
              record.id = RC::Utils.uuid.v4()
              @getData().push record
              yield return record
          @initialize()
        collection = Queryable.new KEY, []
        facade.registerProxy collection
        queryable = facade.retrieveProxy KEY
        yield queryable.create test: 'test1'
        yield queryable.create test: 'test2'
        yield queryable.create test: 'test3'
        yield queryable.create test: 'test4'
        assert.isTrue yield queryable.exists { test: 'test2' }
        assert.isFalse yield queryable.exists { test: 'test5' }

        yield return
  describe '#findBy', ->
    facade = null
    afterEach ->
      facade?.remove?()
    it 'should find data by query', ->
      co ->
        KEY = 'FACADE_TEST_QUERYABLE_003'
        facade = LeanRC::Facade.getInstance KEY
        class Test extends LeanRC
          @inheritProtected()
          @initialize()
        class TestRecord extends LeanRC::Record
          @inheritProtected()
          @module Test
          @attribute test: String
          @public init: FuncG([Object, CollectionInterface], NilT),
            default: ->
              @super arguments...
              @type = 'Test::TestRecord'
              return
          @initialize()
        class Queryable extends LeanRC::Collection
          @inheritProtected()
          @include LeanRC::QueryableCollectionMixin
          @module Test
          @public delegate: SubsetG(RecordInterface),
            default: TestRecord
          @public @async parseQuery: FuncG(
            [UnionG Object, QueryInterface]
            UnionG Object, String, QueryInterface
          ),
            default: (aoQuery) -> yield return aoQuery
          @public @async executeQuery: FuncG(
            [UnionG Object, String, QueryInterface]
            CursorInterface
          ),
            default: (aoParsedQuery) ->
              data = _.filter @getData(), aoParsedQuery.$filter
              yield return Cursor.new @, data
          @public @async update: FuncG([UnionG(String, Number), Object], RecordInterface),
            default: (id, item) ->
              record = yield @find id
              record[key] = value  for own key, value of item
              yield return record
          @public @async push: FuncG(RecordInterface, RecordInterface),
            default: (record) ->
              record.id = RC::Utils.uuid.v4()
              @getData().push yield @delegate.serialize record
              yield return record
          @public @async takeBy: FuncG([Object, MaybeG Object], CursorInterface),
            default: (query) ->
              voQuery = Test::Query.new()
                .forIn '@doc': @collectionFullName()
                .filter query
                .limit 1
              return yield @query voQuery
          @initialize()
        collection = Queryable.new KEY, []
        facade.registerProxy collection
        queryable = facade.retrieveProxy KEY
        yield queryable.create test: 'test1'
        yield queryable.create test: 'test2'
        yield queryable.create test: 'test3'
        yield queryable.create test: 'test4'
        record1 = yield (yield queryable.findBy { 'test': 'test2' }).next()
        assert.isDefined record1
        assert.equal record1.test, 'test2'
        record2 = yield (yield queryable.findBy { 'test': 'test5' }).next()
        assert.isUndefined record2

        yield return
  describe '#deleteBy', ->
    facade = null
    afterEach ->
      facade?.remove?()
    it 'should mark data as deleted by query', ->
      co ->
        KEY = 'FACADE_TEST_QUERYABLE_004'
        facade = LeanRC::Facade.getInstance KEY
        class Test extends LeanRC
          @inheritProtected()
          @initialize()
        class TestRecord extends LeanRC::Record
          @inheritProtected()
          @module Test
          @attribute test: String
          @public init: FuncG([Object, CollectionInterface], NilT),
            default: ->
              @super arguments...
              @type = 'Test::TestRecord'
              return
          @initialize()
        class Queryable extends LeanRC::Collection
          @inheritProtected()
          @include LeanRC::QueryableCollectionMixin
          @module Test
          @public delegate: SubsetG(RecordInterface),
            default: TestRecord
          @public @async parseQuery: FuncG(
            [UnionG Object, QueryInterface]
            UnionG Object, String, QueryInterface
          ),
            default: (aoQuery) -> yield return aoQuery
          @public @async executeQuery: FuncG(
            [UnionG Object, String, QueryInterface]
            CursorInterface
          ),
            default: (aoParsedQuery) ->
              data = _.filter @getData(), aoParsedQuery.$filter
              yield return Cursor.new @, data
          @public @async update: FuncG([UnionG(String, Number), Object], RecordInterface),
            default: (id, item) ->
              data = _.filter @getData(), { id }
              if _.isArray data
                for datum in data
                  if item.constructor.attributes?
                    vhAttributes = {}
                    for own key of item.constructor.attributes
                      datum[key] = item[key]
                  else
                    datum[key] = value  for own key, value of item
              yield return data.length > 0
          @public @async take: FuncG([UnionG String, Number], RecordInterface),
            default: (id) ->
              data = _.find @getData(), { id }
              throw new Error 'NOT_FOUND'  unless data?
              yield data
          @public @async push: FuncG(RecordInterface, RecordInterface),
            default: (record) ->
              record.id = RC::Utils.uuid.v4()
              @getData().push yield @delegate.serialize record
              yield return record
          @public @async takeBy: FuncG([Object, MaybeG Object], CursorInterface),
            default: (query) ->
              voQuery = Test::Query.new()
                .forIn '@doc': @collectionFullName()
                .filter query
                .limit 1
              return yield @query voQuery
          @public @async includes: FuncG([UnionG String, Number], Boolean),
            default: (id) -> return yield @exists { id }
          @public @async override: FuncG([UnionG(String, Number), RecordInterface], RecordInterface),
            default: (id, aoRecord)->
              index = _.findIndex @getData(), { id }
              @getData()[index] = yield @serializer.serialize aoRecord
              return yield Test::Cursor.new(@, [@getData()[index]]).first()
          @initialize()
        collection = Queryable.new KEY, []
        facade.registerProxy collection
        queryable = facade.retrieveProxy KEY
        yield queryable.create test: 'test1'
        yield queryable.create test: 'test2'
        yield queryable.create test: 'test3'
        yield queryable.create test: 'test2'
        yield queryable.deleteBy { test: 'test2' }
        for rawData in queryable.getData()
          assert.isDefined rawData, 'No specified record'
          if rawData.test is 'test2'
            assert.propertyVal rawData, 'isHidden', yes, 'Record was not removed'
            assert.isNotNull rawData.deletedAt, 'Record deleted data is null'
            assert.isDefined rawData.deletedAt, 'Record deleted data is undefined'
          else
            assert.propertyVal rawData, 'isHidden', no, 'Record was removed'
            assert.isNull rawData.deletedAt, 'Record deleted data is not null'

        yield return
  describe '#removeBy', ->
    facade = null
    afterEach ->
      facade?.remove?()
    it 'should remove data by query', ->
      co ->
        KEY = 'FACADE_TEST_QUERYABLE_005'
        facade = LeanRC::Facade.getInstance KEY
        class Test extends LeanRC
          @inheritProtected()
          @initialize()
        class TestRecord extends LeanRC::Record
          @inheritProtected()
          @module Test
          @attribute test: String
          @public init: FuncG([Object, CollectionInterface], NilT),
            default: ->
              @super arguments...
              @type = 'Test::TestRecord'
              return
          @initialize()
        class Queryable extends LeanRC::Collection
          @inheritProtected()
          @include LeanRC::QueryableCollectionMixin
          @module Test
          @public delegate: SubsetG(RecordInterface),
            default: TestRecord
          @public @async parseQuery: FuncG(
            [UnionG Object, QueryInterface]
            UnionG Object, String, QueryInterface
          ),
            default: (aoQuery) -> yield return aoQuery
          @public @async executeQuery: FuncG(
            [UnionG Object, String, QueryInterface]
            CursorInterface
          ),
            default: (aoParsedQuery) ->
              data = []
              switch
                when aoParsedQuery['$remove']
                  _.remove @getData(), aoParsedQuery['$filter']
                  yield return Cursor.new @, []
                else
                  data = _.filter @getData(), aoParsedQuery.$filter
              yield return Cursor.new @, []
          @public @async update: FuncG([UnionG(String, Number), Object], RecordInterface),
            default: (id, item) ->
              data = _.filter @getData(), { id }
              if _.isArray data
                for datum in data
                  if item.constructor.attributes?
                    vhAttributes = {}
                    for own key of item.constructor.attributes
                      datum[key] = item[key]
                  else
                    datum[key] = value  for own key, value of item
              yield return data.length > 0
          @public @async take: FuncG([UnionG String, Number], RecordInterface),
            default: (id) ->
              data = _.find @getData(), { id }
              throw new Error 'NOT_FOUND'  unless data?
              yield return data
          @public @async push: FuncG(RecordInterface, RecordInterface),
            default: (record) ->
              record.id = RC::Utils.uuid.v4()
              @getData().push yield @delegate.serialize record
              yield return record
          @initialize()
        collection = Queryable.new KEY, []
        facade.registerProxy collection
        queryable = facade.retrieveProxy KEY
        yield queryable.create test: 'test1'
        yield queryable.create test: 'test2'
        yield queryable.create test: 'test3'
        yield queryable.create test: 'test2'
        yield queryable.removeBy { test: 'test2' }
        data = queryable.getData()
        assert.lengthOf data, 2, 'Records did not removed'
        assert.lengthOf _.filter(data, { test: 'test2' }), 0, 'Found removed records'

        yield return
  describe '#destroyBy', ->
    facade = null
    afterEach ->
      facade?.remove?()
    it 'should remove records by query', ->
      co ->
        KEY = 'FACADE_TEST_QUERYABLE_006'
        facade = LeanRC::Facade.getInstance KEY
        class Test extends LeanRC
          @inheritProtected()
          @initialize()
        class TestRecord extends LeanRC::Record
          @inheritProtected()
          @module Test
          @attribute test: String
          @public init: FuncG([Object, CollectionInterface], NilT),
            default: ->
              @super arguments...
              @type = 'Test::TestRecord'
              return
          @initialize()
        class Queryable extends LeanRC::Collection
          @inheritProtected()
          @include LeanRC::QueryableCollectionMixin
          @module Test
          @public delegate: SubsetG(RecordInterface),
            default: TestRecord
          @public @async parseQuery: FuncG(
            [UnionG Object, QueryInterface]
            UnionG Object, String, QueryInterface
          ),
            default: (aoQuery) -> yield return aoQuery
          @public @async executeQuery: FuncG(
            [UnionG Object, String, QueryInterface]
            CursorInterface
          ),
            default: (aoParsedQuery) ->
              data = []
              switch
                when aoParsedQuery['$remove']
                  _.remove @getData(), aoParsedQuery['$filter']
                  yield return
                else
                  data = _.filter @getData(), aoParsedQuery.$filter
              yield return Cursor.new @, data
          @public @async take: FuncG([UnionG String, Number], RecordInterface),
            default: (id) ->
              data = _.find @getData(), { id }
              throw new Error 'NOT_FOUND'  unless data?
              yield data
          @public @async push: FuncG(RecordInterface, RecordInterface),
            default: (record) ->
              record.id = RC::Utils.uuid.v4()
              @getData().push yield @delegate.serialize record
              yield return record
          @public @async remove: FuncG([UnionG String, Number], NilT),
            default: (id) ->
              _.remove @getData(), { id }
              yield return
          @public @async takeBy: FuncG([Object, MaybeG Object], CursorInterface),
            default: (query) ->
              voQuery = Test::Query.new()
                .forIn '@doc': @collectionFullName()
                .filter query
                .limit 1
              return yield @query voQuery
          @public @async includes: FuncG([UnionG String, Number], Boolean),
            default: (id) -> return yield @exists { id }
          @initialize()
        collection = Queryable.new KEY, []
        facade.registerProxy collection
        queryable = facade.retrieveProxy KEY
        yield queryable.create test: 'test1'
        yield queryable.create test: 'test2'
        yield queryable.create test: 'test3'
        yield queryable.create test: 'test2'
        yield queryable.destroyBy { test: 'test2' }
        data = queryable.getData()
        assert.lengthOf data, 2, 'Records did not removed'
        assert.lengthOf _.filter(data, { test: 'test2' }), 0, 'Found removed records'

        yield return
  describe '#updateBy', ->
    facade = null
    afterEach ->
      facade?.remove?()
    it 'should update data in records by query', ->
      co ->
        KEY = 'FACADE_TEST_QUERYABLE_009'
        facade = LeanRC::Facade.getInstance KEY
        class Test extends LeanRC
          @inheritProtected()
          @initialize()
        class TestRecord extends LeanRC::Record
          @inheritProtected()
          @module Test
          @attribute test: String
          @attribute updated: Boolean, { default: no }
          @public init: FuncG([Object, CollectionInterface], NilT),
            default: ->
              @super arguments...
              @type = 'Test::TestRecord'
              return
          @initialize()
        class Queryable extends LeanRC::Collection
          @inheritProtected()
          @include LeanRC::QueryableCollectionMixin
          @module Test
          @public delegate: SubsetG(RecordInterface),
            default: TestRecord
          @public @async parseQuery: FuncG(
            [UnionG Object, QueryInterface]
            UnionG Object, String, QueryInterface
          ),
            default: (aoQuery) -> yield return aoQuery
          @public @async executeQuery: FuncG(
            [UnionG Object, String, QueryInterface]
            CursorInterface
          ),
            default: (aoParsedQuery) ->
              data = _.filter @getData(), aoParsedQuery.$filter
              yield return Cursor.new @, data
          @public @async update: FuncG([UnionG(String, Number), Object], RecordInterface),
            default: (id, item) ->
              data = _.filter @getData(), { id }
              if _.isArray data
                for datum in data
                  if item.constructor.attributes?
                    vhAttributes = {}
                    for own key of item.constructor.attributes
                      datum[key] = item[key]
                  else
                    datum[key] = value  for own key, value of item
              yield return data.length > 0
          @public @async take: FuncG([UnionG String, Number], RecordInterface),
            default: (id) ->
              data = _.find @getData(), { id }
              throw new Error 'NOT_FOUND'  unless data?
              yield data
          @public @async push: FuncG(RecordInterface, RecordInterface),
            default: (record) ->
              record.id = RC::Utils.uuid.v4()
              @getData().push yield @delegate.serialize record
              yield return record
          @public @async takeBy: FuncG([Object, MaybeG Object], CursorInterface),
            default: (query) ->
              voQuery = Test::Query.new()
                .forIn '@doc': @collectionFullName()
                .filter query
                .limit 1
              return yield @query voQuery
          @public @async includes: FuncG([UnionG String, Number], Boolean),
            default: (id) -> return yield @exists { id }
          @public @async override: FuncG([UnionG(String, Number), RecordInterface], RecordInterface),
            default: (id, aoRecord)->
              index = _.findIndex @getData(), { id }
              @getData()[index] = yield @serializer.serialize aoRecord
              return yield Test::Cursor.new(@, [@getData()[index]]).first()
          @initialize()
        collection = Queryable.new KEY, []
        facade.registerProxy collection
        queryable = facade.retrieveProxy KEY
        yield queryable.create test: 'test1'
        yield queryable.create test: 'test2'
        yield queryable.create test: 'test3'
        yield queryable.create test: 'test2'
        yield queryable.updateBy { test: 'test2' }, { updated: yes }
        for rawData in queryable.getData()
          assert.isDefined rawData, 'No specified record'
          if rawData.test is 'test2'
            assert.propertyVal rawData, 'updated', yes, 'Record was not updated'
          else
            assert.propertyVal rawData, 'updated', no, 'Record was updated'

        yield return
  describe '#patchBy', ->
    facade = null
    afterEach ->
      facade?.remove?()
    it 'should update data in records by query', ->
      co ->
        KEY = 'FACADE_TEST_QUERYABLE_010'
        facade = LeanRC::Facade.getInstance KEY
        class Test extends LeanRC
          @inheritProtected()
          @initialize()
        class TestRecord extends LeanRC::Record
          @inheritProtected()
          @module Test
          @attribute test: String
          @attribute updated: Boolean, { default: no }
          @public init: FuncG([Object, CollectionInterface], NilT),
            default: ->
              @super arguments...
              @type = 'Test::TestRecord'
              return
          @initialize()
        class Queryable extends LeanRC::Collection
          @inheritProtected()
          @include LeanRC::QueryableCollectionMixin
          @module Test
          @public delegate: SubsetG(RecordInterface),
            default: TestRecord
          @public @async parseQuery: FuncG(
            [UnionG Object, QueryInterface]
            UnionG Object, String, QueryInterface
          ),
            default: (aoQuery) -> yield return aoQuery
          @public @async executeQuery: FuncG(
            [UnionG Object, String, QueryInterface]
            CursorInterface
          ),
            default: (aoParsedQuery) ->
              if (item = aoParsedQuery['$patch'])?
                toBeUpdated = _.filter @getData(), aoParsedQuery.$filter
                if _.isArray toBeUpdated
                  for datum in toBeUpdated
                    if item.constructor.attributes?
                      vhAttributes = {}
                      for own key of item.constructor.attributes
                        datum[key] = item[key]
                    else
                      datum[key] = value  for own key, value of item
              data = _.filter @getData(), aoParsedQuery.$filter
              yield return Cursor.new @, data
          @public @async take: FuncG([UnionG String, Number], RecordInterface),
            default: (id) ->
              data = _.find @getData(), { id }
              throw new Error 'NOT_FOUND'  unless data?
              yield data
          @public @async push: FuncG(RecordInterface, RecordInterface),
            default: (record) ->
              record.id = RC::Utils.uuid.v4()
              @getData().push yield @delegate.serialize record
              yield return record
          @initialize()
        collection = Queryable.new KEY, []
        facade.registerProxy collection
        queryable = facade.retrieveProxy KEY
        yield queryable.create test: 'test1'
        yield queryable.create test: 'test2'
        yield queryable.create test: 'test3'
        yield queryable.create test: 'test2'
        yield queryable.patchBy { test: 'test2' }, { updated: yes }
        for rawData in queryable.getData()
          assert.isDefined rawData, 'No specified record'
          if rawData.test is 'test2'
            assert.propertyVal rawData, 'updated', yes, 'Record was not patched'
          else
            assert.propertyVal rawData, 'updated', no, 'Record was patched'

        yield return
