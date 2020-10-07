{ expect, assert } = require 'chai'
sinon = require 'sinon'
LeanRC = require.main.require 'lib'
RC = require '@leansdk/rc/lib'
{
  NilT
  FuncG, SubsetG
  RecordInterface, CursorInterface, CollectionInterface
  Utils: { co }
} = LeanRC::

describe 'IterableMixin', ->
  describe '.new', ->
    facade = null
    afterEach ->
      facade?.remove?()
    it 'should create iterable instance', ->
      co ->
        KEY = 'TEST_ITERABLE_MIXIN_001'
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
        class Iterable extends LeanRC::Collection
          @inheritProtected()
          @include LeanRC::MemoryCollectionMixin
          @include LeanRC::IterableMixin
          @module Test
          @public delegate: SubsetG(RecordInterface),
            default: TestRecord
          @public @async takeAll: FuncG([], CursorInterface),
            default: ->
              yield RC::Promise.resolve LeanRC::Cursor.new @, @getData()
          @initialize()
        array = [ {}, {}, {} ]
        collectionName = 'TestsCollection'
        collection = Iterable.new collectionName, array
        facade.registerProxy collection
        iterable = facade.retrieveProxy collectionName
        cursor = yield iterable.takeAll()
        assert.equal (yield cursor.count()), 3, 'Records length does not match'
        return
  describe '#forEach', ->
    facade = null
    afterEach ->
      facade?.remove?()
    it 'should call lambda in each record in iterable', ->
      co ->
        KEY = 'TEST_ITERABLE_MIXIN_002'
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
        class Iterable extends LeanRC::Collection
          @inheritProtected()
          @include LeanRC::MemoryCollectionMixin
          @include LeanRC::IterableMixin
          @module Test
          @public delegate: SubsetG(RecordInterface),
            default: TestRecord
          @public @async takeAll: FuncG([], CursorInterface),
            default: ->
              yield RC::Promise.resolve LeanRC::Cursor.new @, @getData()
          @initialize()
        array = [ { test: 'three', type: 'Test::TestRecord'  }, { test: 'men', type: 'Test::TestRecord'  }, { test: 'in', type: 'Test::TestRecord'  }, { test: 'a boat', type: 'Test::TestRecord'  } ]
        collectionName = 'TestsCollection'
        collection = Iterable.new collectionName, array
        facade.registerProxy collection
        iterable = facade.retrieveProxy collectionName
        spyLambda = sinon.spy -> yield return
        yield iterable.forEach spyLambda
        assert.isTrue spyLambda.called, 'Lambda never called'
        assert.equal spyLambda.callCount, 4, 'Lambda calls are not match'
        assert.equal spyLambda.args[0][0].test, 'three', 'Lambda 1st call is not match'
        assert.equal spyLambda.args[1][0].test, 'men', 'Lambda 2nd call is not match'
        assert.equal spyLambda.args[2][0].test, 'in', 'Lambda 3rd call is not match'
        assert.equal spyLambda.args[3][0].test, 'a boat', 'Lambda 4th call is not match'
        return
  describe '#map', ->
    facade = null
    afterEach ->
      facade?.remove?()
    it 'should map records using lambda', ->
      co ->
        KEY = 'TEST_ITERABLE_MIXIN_003'
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
        class Iterable extends LeanRC::Collection
          @inheritProtected()
          @include LeanRC::MemoryCollectionMixin
          @include LeanRC::IterableMixin
          @module Test
          @public delegate: SubsetG(RecordInterface),
            default: TestRecord
          @public @async takeAll: FuncG([], CursorInterface),
            default: ->
              yield RC::Promise.resolve LeanRC::Cursor.new @, @getData()
          @initialize()
        array = [ { test: 'three', type: 'Test::TestRecord' }, { test: 'men', type: 'Test::TestRecord' }, { test: 'in', type: 'Test::TestRecord' }, { test: 'a boat', type: 'Test::TestRecord' } ]
        collectionName = 'TestsCollection'
        collection = Iterable.new collectionName, array
        facade.registerProxy collection
        iterable = facade.retrieveProxy collectionName
        records = yield iterable.map (record) ->
          record.test = '+' + record.test + '+'
          yield RC::Promise.resolve record
        assert.lengthOf records, 4, 'Records count is not match'
        assert.equal records[0].test, '+three+', '1st record is not match'
        assert.equal records[1].test, '+men+', '2nd record is not match'
        assert.equal records[2].test, '+in+', '3rd record is not match'
        assert.equal records[3].test, '+a boat+', '4th record is not match'
        return
  describe '#filter', ->
    facade = null
    afterEach ->
      facade?.remove?()
    it 'should filter records using lambda', ->
      co ->
        KEY = 'TEST_ITERABLE_MIXIN_004'
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
        class Iterable extends LeanRC::Collection
          @inheritProtected()
          @include LeanRC::MemoryCollectionMixin
          @include LeanRC::IterableMixin
          @module Test
          @public delegate: SubsetG(RecordInterface),
            default: TestRecord
          @public @async takeAll: FuncG([], CursorInterface),
            default: ->
              yield RC::Promise.resolve LeanRC::Cursor.new @, @getData()
          @initialize()
        array = [ { test: 'three', type: 'Test::TestRecord' }, { test: 'men', type: 'Test::TestRecord' }, { test: 'in', type: 'Test::TestRecord' }, { test: 'a boat', type: 'Test::TestRecord' } ]
        collectionName = 'TestsCollection'
        collection = Iterable.new collectionName, array
        facade.registerProxy collection
        iterable = facade.retrieveProxy collectionName
        records = yield iterable.filter (record) ->
          yield RC::Promise.resolve record.test.length > 3
        assert.lengthOf records, 2, 'Records count is not match'
        assert.equal records[0].test, 'three', '1st record is not match'
        assert.equal records[1].test, 'a boat', '2nd record is not match'
        return
  describe '#reduce', ->
    facade = null
    afterEach ->
      facade?.remove?()
    it 'should reduce records using lambda', ->
      co ->
        KEY = 'TEST_ITERABLE_MIXIN_005'
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
        class Iterable extends LeanRC::Collection
          @inheritProtected()
          @include LeanRC::MemoryCollectionMixin
          @include LeanRC::IterableMixin
          @module Test
          @public delegate: SubsetG(RecordInterface),
            default: TestRecord
          @public @async takeAll: FuncG([], CursorInterface),
            default: ->
              yield RC::Promise.resolve LeanRC::Cursor.new @, @getData()
          @initialize()
        array = [ { test: 'three', type: 'Test::TestRecord' }, { test: 'men', type: 'Test::TestRecord' }, { test: 'in', type: 'Test::TestRecord' }, { test: 'a boat', type: 'Test::TestRecord' } ]
        collectionName = 'TestsCollection'
        collection = Iterable.new collectionName, array
        facade.registerProxy collection
        iterable = facade.retrieveProxy collectionName
        records = yield iterable.reduce (accumulator, item) ->
          accumulator[item.test] = item
          yield RC::Promise.resolve accumulator
        , {}
        assert.equal records['three'].test, 'three', '1st record is not match'
        assert.equal records['men'].test, 'men', '2nd record is not match'
        assert.equal records['in'].test, 'in', '3rd record is not match'
        assert.equal records['a boat'].test, 'a boat', '4th record is not match'
        return
