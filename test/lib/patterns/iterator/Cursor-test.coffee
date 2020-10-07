{ expect, assert } = require 'chai'
sinon = require 'sinon'
LeanRC = require.main.require 'lib'
RC = require '@leansdk/rc/lib'
Cursor = LeanRC::Cursor
{ co } = RC::Utils

describe 'Cursor', ->
  describe '.new', ->
    it 'should create cursor instance', ->
      expect ->
        class Test extends LeanRC
          @inheritProtected()
        Test.initialize()
        class TestRecord extends LeanRC::Record
          @inheritProtected()
          @module Test
        TestRecord.initialize()
        class MemoryCollection extends LeanRC::Collection
          @inheritProtected()
          @include LeanRC::MemoryCollectionMixin
          @include LeanRC::GenerateUuidIdMixin
          @module Test
        MemoryCollection.initialize()
        voMemoryCollection = MemoryCollection.new 'MemoryCollection',
          delegate: TestRecord
        array = [ {}, {}, {} ]
        cursor = Cursor.new voMemoryCollection, array
      .to.not.throw Error
  describe '#setCollection', ->
    it 'should setup record', ->
      expect ->
        class Test extends LeanRC
          @inheritProtected()
        Test.initialize()
        class TestRecord extends LeanRC::Record
          @inheritProtected()
          @module Test
        TestRecord.initialize()
        class MemoryCollection extends LeanRC::Collection
          @inheritProtected()
          @include LeanRC::MemoryCollectionMixin
          @include LeanRC::GenerateUuidIdMixin
          @module Test
        MemoryCollection.initialize()
        voMemoryCollection = MemoryCollection.new 'MemoryCollection',
          delegate: TestRecord
        cursor = Cursor.new()
        cursor.setCollection voMemoryCollection
      .to.not.throw Error
  describe '#next', ->
    it 'should get next values one by one', ->
      co ->
        class Test extends LeanRC
          @inheritProtected()
        Test.initialize()
        class TestRecord extends LeanRC::Record
          @inheritProtected()
          @module Test
          @attribute data: String, { default: '' }
        TestRecord.initialize()
        class MemoryCollection extends LeanRC::Collection
          @inheritProtected()
          @include LeanRC::MemoryCollectionMixin
          @include LeanRC::GenerateUuidIdMixin
          @module Test
        MemoryCollection.initialize()
        array = [ { data: 'three', type: 'Test::TestRecord'  }, { data: 'men', type: 'Test::TestRecord'  }, { data: 'in', type: 'Test::TestRecord'  }, { data: 'a boat', type: 'Test::TestRecord'  } ]
        voMemoryCollection = MemoryCollection.new 'MemoryCollection',
          delegate: TestRecord
        cursor = Cursor.new voMemoryCollection, array
        assert.equal (yield cursor.next()).data, 'three', 'First item is incorrect'
        assert.equal (yield cursor.next()).data, 'men', 'Second item is incorrect'
        assert.equal (yield cursor.next()).data, 'in', 'Third item is incorrect'
        assert.equal (yield cursor.next()).data, 'a boat', 'Fourth item is incorrect'
        assert.isUndefined (yield cursor.next()), 'Unexpected item is present'
  describe '#hasNext', ->
    it 'should check if next value is present', ->
      co ->
        class Test extends LeanRC
          @inheritProtected()
        Test.initialize()
        class TestRecord extends LeanRC::Record
          @inheritProtected()
          @module Test
          @attribute data: String, { default: '' }
        TestRecord.initialize()
        class MemoryCollection extends LeanRC::Collection
          @inheritProtected()
          @include LeanRC::MemoryCollectionMixin
          @include LeanRC::GenerateUuidIdMixin
          @module Test
        MemoryCollection.initialize()
        voMemoryCollection = MemoryCollection.new 'MemoryCollection',
          delegate: TestRecord
        array = [ { data: 'data', type: 'Test::TestRecord'  } ]
        cursor = Cursor.new voMemoryCollection, array
        assert.isTrue (yield cursor.hasNext()), 'There is no next value'
        data = yield cursor.next()
        assert.isFalse (yield cursor.hasNext()), 'There is something else'
  describe '#toArray', ->
    it 'should get array from cursor', ->
      co ->
        class Test extends LeanRC
          @inheritProtected()
        Test.initialize()
        class TestRecord extends LeanRC::Record
          @inheritProtected()
          @module Test
          @attribute data: String, { default: '' }
        TestRecord.initialize()
        class MemoryCollection extends LeanRC::Collection
          @inheritProtected()
          @include LeanRC::MemoryCollectionMixin
          @include LeanRC::GenerateUuidIdMixin
          @module Test
        MemoryCollection.initialize()
        voMemoryCollection = MemoryCollection.new 'MemoryCollection',
          delegate: TestRecord
        array = [ { data: 'three', type: 'Test::TestRecord'  }, { data: 'men', type: 'Test::TestRecord'  }, { data: 'in', type: 'Test::TestRecord'  }, { data: 'a boat', type: 'Test::TestRecord'  } ]
        cursor = Cursor.new voMemoryCollection, array
        records = yield cursor.toArray()
        assert.equal records.length, array.length, 'Counts of input and output data are different'
        for record, index in records
          assert.instanceOf record, Test::TestRecord, "Record #{index} is incorrect"
          assert.equal record.data, array[index].data, "Record #{index} `data` is incorrect"
        return
  describe '#close', ->
    it 'should remove records from cursor', ->
      co ->
        class Test extends LeanRC
          @inheritProtected()
        Test.initialize()
        class TestRecord extends LeanRC::Record
          @inheritProtected()
          @module Test
          @attribute data: String, { default: '' }
        TestRecord.initialize()
        class MemoryCollection extends LeanRC::Collection
          @inheritProtected()
          @include LeanRC::MemoryCollectionMixin
          @include LeanRC::GenerateUuidIdMixin
          @module Test
        MemoryCollection.initialize()
        voMemoryCollection = MemoryCollection.new 'MemoryCollection',
          delegate: TestRecord
        array = [ { data: 'three', type: 'Test::TestRecord'  }, { data: 'men', type: 'Test::TestRecord'  }, { data: 'in', type: 'Test::TestRecord'  }, { data: 'a boat', type: 'Test::TestRecord'  } ]
        cursor = Cursor.new voMemoryCollection, array
        assert.isTrue (yield cursor.hasNext()), 'There is no next value'
        yield cursor.close()
        assert.isFalse (yield cursor.hasNext()), 'There is something else'
        return
  describe '#count', ->
    it 'should count records in cursor', ->
      co ->
        class Test extends LeanRC
          @inheritProtected()
        Test.initialize()
        class TestRecord extends LeanRC::Record
          @inheritProtected()
          @module Test
          @attribute data: String, { default: '' }
        TestRecord.initialize()
        class MemoryCollection extends LeanRC::Collection
          @inheritProtected()
          @include LeanRC::MemoryCollectionMixin
          @include LeanRC::GenerateUuidIdMixin
          @module Test
        MemoryCollection.initialize()
        voMemoryCollection = MemoryCollection.new 'MemoryCollection',
          delegate: TestRecord
        array = [ { data: 'three', type: 'Test::TestRecord'  }, { data: 'men', type: 'Test::TestRecord'  }, { data: 'in', type: 'Test::TestRecord'  }, { data: 'a boat', type: 'Test::TestRecord'  } ]
        cursor = Cursor.new voMemoryCollection, array
        assert.equal (yield cursor.count()), 4, 'Count works incorrectly'
        return
  describe '#forEach', ->
    it 'should call lambda in each record in cursor', ->
      co ->
        class Test extends LeanRC
          @inheritProtected()
        Test.initialize()
        class TestRecord extends LeanRC::Record
          @inheritProtected()
          @module Test
          @attribute data: String, { default: '' }
        TestRecord.initialize()
        class MemoryCollection extends LeanRC::Collection
          @inheritProtected()
          @include LeanRC::MemoryCollectionMixin
          @include LeanRC::GenerateUuidIdMixin
          @module Test
        MemoryCollection.initialize()
        voMemoryCollection = MemoryCollection.new 'MemoryCollection',
          delegate: TestRecord
        array = [ { data: 'three', type: 'Test::TestRecord'  }, { data: 'men', type: 'Test::TestRecord'  }, { data: 'in', type: 'Test::TestRecord'  }, { data: 'a boat', type: 'Test::TestRecord'  } ]
        cursor = Cursor.new voMemoryCollection, array
        spyLambda = sinon.spy -> yield return
        yield cursor.forEach spyLambda
        assert.isTrue spyLambda.called, 'Lambda never called'
        assert.equal spyLambda.callCount, 4, 'Lambda calls are not match'
        assert.equal spyLambda.args[0][0].data, 'three', 'Lambda 1st call is not match'
        assert.equal spyLambda.args[1][0].data, 'men', 'Lambda 2nd call is not match'
        assert.equal spyLambda.args[2][0].data, 'in', 'Lambda 3rd call is not match'
        assert.equal spyLambda.args[3][0].data, 'a boat', 'Lambda 4th call is not match'
        return
  describe '#map', ->
    it 'should map records using lambda', ->
      co ->
        class Test extends LeanRC
          @inheritProtected()
        Test.initialize()
        class TestRecord extends LeanRC::Record
          @inheritProtected()
          @module Test
          @attribute data: String, { default: '' }
        TestRecord.initialize()
        class MemoryCollection extends LeanRC::Collection
          @inheritProtected()
          @include LeanRC::MemoryCollectionMixin
          @include LeanRC::GenerateUuidIdMixin
          @module Test
        MemoryCollection.initialize()
        voMemoryCollection = MemoryCollection.new 'MemoryCollection',
          delegate: TestRecord
        array = [ { data: 'three', type: 'Test::TestRecord'  }, { data: 'men', type: 'Test::TestRecord'  }, { data: 'in', type: 'Test::TestRecord'  }, { data: 'a boat', type: 'Test::TestRecord'  } ]
        cursor = Cursor.new voMemoryCollection, array
        records = yield cursor.map (record) ->
          record.data = '+' + record.data + '+'
          yield RC::Promise.resolve record
        assert.lengthOf records, 4, 'Records count is not match'
        assert.equal records[0].data, '+three+', '1st record is not match'
        assert.equal records[1].data, '+men+', '2nd record is not match'
        assert.equal records[2].data, '+in+', '3rd record is not match'
        assert.equal records[3].data, '+a boat+', '4th record is not match'
        return
  describe '#filter', ->
    it 'should filter records using lambda', ->
      co ->
        class Test extends LeanRC
          @inheritProtected()
        Test.initialize()
        class TestRecord extends LeanRC::Record
          @inheritProtected()
          @module Test
          @attribute data: String, { default: '' }
        TestRecord.initialize()
        class MemoryCollection extends LeanRC::Collection
          @inheritProtected()
          @include LeanRC::MemoryCollectionMixin
          @include LeanRC::GenerateUuidIdMixin
          @module Test
        MemoryCollection.initialize()
        voMemoryCollection = MemoryCollection.new 'MemoryCollection',
          delegate: TestRecord
        array = [ { data: 'three', type: 'Test::TestRecord'  }, { data: 'men', type: 'Test::TestRecord'  }, { data: 'in', type: 'Test::TestRecord'  }, { data: 'a boat', type: 'Test::TestRecord'  } ]
        cursor = Cursor.new voMemoryCollection, array
        records = yield cursor.filter (record) ->
          yield RC::Promise.resolve record.data.length > 3
        assert.lengthOf records, 2, 'Records count is not match'
        assert.equal records[0].data, 'three', '1st record is not match'
        assert.equal records[1].data, 'a boat', '2nd record is not match'
        return
  describe '#find', ->
    it 'should find record using lambda', ->
      co ->
        class Test extends LeanRC
          @inheritProtected()
        Test.initialize()
        class TestRecord extends LeanRC::Record
          @inheritProtected()
          @module Test
          @attribute name: String, { default: 'Unknown' }
        TestRecord.initialize()
        class MemoryCollection extends LeanRC::Collection
          @inheritProtected()
          @include LeanRC::MemoryCollectionMixin
          @include LeanRC::GenerateUuidIdMixin
          @module Test
        MemoryCollection.initialize()
        voMemoryCollection = MemoryCollection.new 'MemoryCollection',
          delegate: TestRecord
        array = [ { name: 'Jerome', type: 'Test::TestRecord'  }, { name: 'George', type: 'Test::TestRecord'  }, { name: 'Harris', type: 'Test::TestRecord'  } ]
        cursor = Cursor.new voMemoryCollection, array
        record = yield cursor.find (record) ->
          yield RC::Promise.resolve record.name is 'George'
        assert.equal record.name, 'George', 'Record is not match'
        return
  describe '#compact', ->
    it 'should get non-empty records from cursor', ->
      co ->
        class Test extends LeanRC
          @inheritProtected()
        Test.initialize()
        class TestRecord extends LeanRC::Record
          @inheritProtected()
          @module Test
          @attribute data: String, { default: '' }
        TestRecord.initialize()
        class MemoryCollection extends LeanRC::Collection
          @inheritProtected()
          @include LeanRC::MemoryCollectionMixin
          @include LeanRC::GenerateUuidIdMixin
          @module Test
        MemoryCollection.initialize()
        voMemoryCollection = MemoryCollection.new 'MemoryCollection',
          delegate: TestRecord
        array = [ null, { data: 'men', type: 'Test::TestRecord'  }, undefined, { data: 'a boat', type: 'Test::TestRecord'  } ]
        cursor = Cursor.new voMemoryCollection, array
        records = yield cursor.compact()
        assert.lengthOf records, 2, 'Records count not match'
        assert.equal records[0].data, 'men', '1st record is not match'
        assert.equal records[1].data, 'a boat', '2nd record is not match'
        return
  describe '#reduce', ->
    it 'should reduce records using lambda', ->
      co ->
        class Test extends LeanRC
          @inheritProtected()
        Test.initialize()
        class TestRecord extends LeanRC::Record
          @inheritProtected()
          @module Test
          @attribute data: String, { default: '' }
        TestRecord.initialize()
        class MemoryCollection extends LeanRC::Collection
          @inheritProtected()
          @include LeanRC::MemoryCollectionMixin
          @include LeanRC::GenerateUuidIdMixin
          @module Test
        MemoryCollection.initialize()
        voMemoryCollection = MemoryCollection.new 'MemoryCollection',
          delegate: TestRecord
        array = [ { data: 'three', type: 'Test::TestRecord'  }, { data: 'men', type: 'Test::TestRecord'  }, { data: 'in', type: 'Test::TestRecord'  }, { data: 'a boat', type: 'Test::TestRecord'  } ]
        cursor = Cursor.new voMemoryCollection, array
        records = yield cursor.reduce (accumulator, item) ->
          accumulator[item.data] = item
          yield RC::Promise.resolve accumulator
        , {}
        assert.equal records['three'].data, 'three', '1st record is not match'
        assert.equal records['men'].data, 'men', '2nd record is not match'
        assert.equal records['in'].data, 'in', '3rd record is not match'
        assert.equal records['a boat'].data, 'a boat', '4th record is not match'
        return
  describe '#first', ->
    it 'should get first record from cursor', ->
      co ->
        class Test extends LeanRC
          @inheritProtected()
        Test.initialize()
        class TestRecord extends LeanRC::Record
          @inheritProtected()
          @module Test
          @attribute data: String, { default: '' }
        TestRecord.initialize()
        class MemoryCollection extends LeanRC::Collection
          @inheritProtected()
          @include LeanRC::MemoryCollectionMixin
          @include LeanRC::GenerateUuidIdMixin
          @module Test
        MemoryCollection.initialize()
        voMemoryCollection = MemoryCollection.new 'MemoryCollection',
          delegate: TestRecord
        array = [ { data: 'three', type: 'Test::TestRecord'  }, { data: 'men', type: 'Test::TestRecord'  }, { data: 'in', type: 'Test::TestRecord'  }, { data: 'a boat', type: 'Test::TestRecord'  } ]
        cursor = Cursor.new voMemoryCollection, array
        record = yield cursor.first()
        assert.equal record.data, 'three', '1st record is not match'
        array = [ { data: 'Jerome', type: 'Test::TestRecord'  }, { data: 'George', type: 'Test::TestRecord'  }, { data: 'Harris', type: 'Test::TestRecord'  } ]
        cursor = Cursor.new voMemoryCollection, array
        record = yield cursor.first()
        assert.equal record.data, 'Jerome', 'Another 1st record is not match'
        return
