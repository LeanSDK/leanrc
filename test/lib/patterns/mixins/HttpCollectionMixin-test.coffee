{ expect, assert } = require 'chai'
sinon = require 'sinon'
_ = require 'lodash'
LeanRC = require.main.require 'lib'
RC = require '@leansdk/rc/lib'
{
  NilT
  FuncG
  CollectionInterface, RecordInterface
  Utils: { co }
} = LeanRC::

commonServerInitializer = require.main.require 'test/common/server'
server = commonServerInitializer fixture: 'HttpCollectionMixin'

describe 'HttpCollectionMixin', ->
  describe '.new', ->
    it 'should create HTTP collection instance', ->
      co ->
        collectionName = 'TestsCollection'
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
        class HttpCollection extends LeanRC::Collection
          @inheritProtected()
          @include LeanRC::QueryableCollectionMixin
          @include LeanRC::HttpCollectionMixin
          @module Test
          @initialize()
        collection = HttpCollection.new collectionName,
          delegate: 'TestRecord'
        assert.instanceOf collection, HttpCollection
        yield return
  describe '#sendRequest', ->
    facade = null
    before ->
      server.listen 8000
    after ->
      server.close()
      facade?.remove?()
    it 'should make simple request', ->
      co ->
        collectionName = 'TestsCollection'
        KEY = 'FACADE_TEST_HTTP_COLLECTION_000'
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
        class HttpCollection extends LeanRC::Collection
          @inheritProtected()
          @include LeanRC::QueryableCollectionMixin
          @include LeanRC::HttpCollectionMixin
          @module Test
          @initialize()
        facade.registerProxy HttpCollection.new collectionName,
          delegate: 'TestRecord'
        collection = facade.retrieveProxy collectionName
        assert.instanceOf collection, HttpCollection
        data = yield collection.sendRequest
          method: 'GET'
          url: 'http://localhost:8000'
          options:
            json: yes
            headers: {}
        assert.equal data.status, 200
        assert.equal data.body?.message, 'OK'
        yield return
  describe '#requestToHash, #makeRequest', ->
    facade = null
    before ->
      server.listen 8000
    after ->
      server.close()
      facade?.remove?()
    it 'should make simple request', ->
      co ->
        collectionName = 'TestsCollection'
        KEY = 'FACADE_TEST_HTTP_COLLECTION_001'
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
        class HttpCollection extends LeanRC::Collection
          @inheritProtected()
          @include LeanRC::QueryableCollectionMixin
          @include LeanRC::HttpCollectionMixin
          @module Test
          @initialize()
        facade.registerProxy HttpCollection.new collectionName,
          delegate: 'TestRecord'
        collection = facade.retrieveProxy collectionName
        assert.instanceOf collection, HttpCollection
        hash = collection.requestToHash
          method: 'GET'
          url: 'http://localhost:8000'
          headers: {}
          data: null
        assert.equal hash.method, 'GET', 'Method is incorrect'
        assert.equal hash.url, 'http://localhost:8000', 'URL is incorrect'
        assert.equal hash.options?.json, yes, 'JSON option is not set'
        data = yield collection.makeRequest
          method: 'GET'
          url: 'http://localhost:8000'
          headers: {}
          data: null
        assert.equal data.status, 200, 'Request received not OK status'
        assert.equal data?.body?.message, 'OK', 'Incorrect body'
        yield return
  describe '#methodForRequest', ->
    it 'should get method name from request params', ->
      co ->
        collectionName = 'TestsCollection'
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
        class HttpCollection extends LeanRC::Collection
          @inheritProtected()
          @include LeanRC::QueryableCollectionMixin
          @include LeanRC::HttpCollectionMixin
          @module Test
          @initialize()
        collection = HttpCollection.new collectionName,
          delegate: 'TestRecord'
        method = collection.methodForRequest
          requestType: 'query'
          recordName: 'TestRecord'
        assert.equal method, 'POST', 'Find method is incorrect'
        method = collection.methodForRequest
          requestType: 'patchBy'
          recordName: 'TestRecord'
        assert.equal method, 'POST', 'Insert method is incorrect'
        method = collection.methodForRequest
          requestType: 'removeBy'
          recordName: 'TestRecord'
        assert.equal method, 'POST', 'Update method is incorrect'
        method = collection.methodForRequest
          requestType: 'takeAll'
          recordName: 'TestRecord'
        assert.equal method, 'GET', 'Replace method is incorrect'
        method = collection.methodForRequest
          requestType: 'takeBy'
          recordName: 'TestRecord'
        assert.equal method, 'GET', 'Remove method is incorrect'
        method = collection.methodForRequest
          requestType: 'take'
          recordName: 'TestRecord'
        assert.equal method, 'GET', 'Find method is incorrect'
        method = collection.methodForRequest
          requestType: 'push'
          recordName: 'TestRecord'
        assert.equal method, 'POST', 'Insert method is incorrect'
        method = collection.methodForRequest
          requestType: 'remove'
          recordName: 'TestRecord'
        assert.equal method, 'DELETE', 'Update method is incorrect'
        method = collection.methodForRequest
          requestType: 'override'
          recordName: 'TestRecord'
        assert.equal method, 'PUT', 'Replace method is incorrect'
        method = collection.methodForRequest
          requestType: 'someOther'
          recordName: 'TestRecord'
        assert.equal method, 'GET', 'Any other method is incorrect'
        yield return
  describe '#urlPrefix', ->
    it 'should get url prefix', ->
      co ->
        collectionName = 'TestsCollection'
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
        class HttpCollection extends LeanRC::Collection
          @inheritProtected()
          @include LeanRC::QueryableCollectionMixin
          @include LeanRC::HttpCollectionMixin
          @module Test
          @public host: String, { default: 'http://localhost:8000' }
          @public namespace: String, { default: 'v1' }
          @initialize()
        collection = HttpCollection.new collectionName,
          delegate: 'TestRecord'
        url = collection.urlPrefix 'Test', 'Tests'
        assert.equal url, 'Tests/Test'
        url = collection.urlPrefix '/Test'
        assert.equal url, 'http://localhost:8000/Test'
        url = collection.urlPrefix()
        assert.equal url, 'http://localhost:8000/v1'
        yield return
  describe '#makeURL', ->
    it 'should get new url by options', ->
      co ->
        collectionName = 'TestsCollection'
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
        class HttpCollection extends LeanRC::Collection
          @inheritProtected()
          @include LeanRC::QueryableCollectionMixin
          @include LeanRC::HttpCollectionMixin
          @module Test
          @public host: String, { default: 'http://localhost:8000' }
          @public namespace: String, { default: 'v1' }
          @initialize()
        collection = HttpCollection.new collectionName,
          delegate: 'TestRecord'
        url = collection.makeURL 'Test', null, null, yes
        assert.equal url, 'http://localhost:8000/v1/tests/query'
        url = collection.makeURL 'Test', {a: '1'}, null, yes
        assert.equal url, 'http://localhost:8000/v1/tests/query?query=%7B%22a%22%3A%221%22%7D'
        # url = collection.makeURL 'Test', {a: '1'}, null, no
        # assert.equal url, 'http://localhost:8000/v1/tests?query=%7B%22a%22%3A%221%22%7D'
        url = collection.makeURL 'Test', {a: '1'}, null, no
        assert.equal url, 'http://localhost:8000/v1/tests?query=%7B%22a%22%3A%221%22%7D'
        url = collection.makeURL 'Test', null, '123', no
        assert.equal url, 'http://localhost:8000/v1/tests/123'
        # url = collection.makeURL 'Test', {a: '1'}, null, no
        # assert.equal url, 'http://localhost:8000/v1/tests/123'
        # url = collection.makeURL 'Test', {a: '1'}, null, no
        # assert.equal url, 'http://localhost:8000/v1/tests/123'
        # url = collection.makeURL 'Test', {a: '1'}, null, no
        # assert.isUndefined url
        yield return
  describe '#pathForType', ->
    it 'should get url for type', ->
      co ->
        collectionName = 'TestsCollection'
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
        class HttpCollection extends LeanRC::Collection
          @inheritProtected()
          @include LeanRC::QueryableCollectionMixin
          @include LeanRC::HttpCollectionMixin
          @module Test
          @public host: String, { default: 'http://localhost:8000' }
          @public namespace: String, { default: 'v1' }
          @initialize()
        collection = HttpCollection.new collectionName,
          delegate: 'TestRecord'
        url = collection.pathForType 'Type'
        assert.equal url, 'types'
        url = collection.pathForType 'TestRecord'
        assert.equal url, 'tests'
        url = collection.pathForType 'test-info'
        assert.equal url, 'test_infos'
        yield return
  describe '#urlForQuery', ->
    it 'should get url for `query` request', ->
      co ->
        collectionName = 'TestsCollection'
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
        class HttpCollection extends LeanRC::Collection
          @inheritProtected()
          @include LeanRC::QueryableCollectionMixin
          @include LeanRC::HttpCollectionMixin
          @module Test
          @public host: String, { default: 'http://localhost:8000' }
          @public namespace: String, { default: 'v1' }
          @initialize()
        collection = HttpCollection.new collectionName,
          delegate: 'TestRecord'
        url = collection.urlForQuery 'Test', {}
        assert.equal url, 'http://localhost:8000/v1/tests/query'
        url = collection.urlForQuery 'TestRecord', {}
        assert.equal url, 'http://localhost:8000/v1/tests/query'
        yield return
  describe '#urlForPatchBy', ->
    it 'should get url for `patch by` request', ->
      co ->
        collectionName = 'TestsCollection'
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
        class HttpCollection extends LeanRC::Collection
          @inheritProtected()
          @include LeanRC::QueryableCollectionMixin
          @include LeanRC::HttpCollectionMixin
          @module Test
          @public host: String, { default: 'http://localhost:8000' }
          @public namespace: String, { default: 'v1' }
          @initialize()
        collection = HttpCollection.new collectionName,
          delegate: 'TestRecord'
        url = collection.urlForPatchBy 'Test', {}
        assert.equal url, 'http://localhost:8000/v1/tests/query'
        url = collection.urlForPatchBy 'TestRecord', {}
        assert.equal url, 'http://localhost:8000/v1/tests/query'
        yield return
  describe '#urlForRemoveBy', ->
    it 'should get url for `remove by` request', ->
      co ->
        collectionName = 'TestsCollection'
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
        class HttpCollection extends LeanRC::Collection
          @inheritProtected()
          @include LeanRC::QueryableCollectionMixin
          @include LeanRC::HttpCollectionMixin
          @module Test
          @public host: String, { default: 'http://localhost:8000' }
          @public namespace: String, { default: 'v1' }
          @initialize()
        collection = HttpCollection.new collectionName,
          delegate: 'TestRecord'
        url = collection.urlForRemoveBy 'Test', {}
        assert.equal url, 'http://localhost:8000/v1/tests/query'
        url = collection.urlForRemoveBy 'TestRecord', {}
        assert.equal url, 'http://localhost:8000/v1/tests/query'
        yield return
  describe '#urlForTakeAll', ->
    it 'should get url for `take all` request', ->
      co ->
        collectionName = 'TestsCollection'
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
        class HttpCollection extends LeanRC::Collection
          @inheritProtected()
          @include LeanRC::QueryableCollectionMixin
          @include LeanRC::HttpCollectionMixin
          @module Test
          @public host: String, { default: 'http://localhost:8000' }
          @public namespace: String, { default: 'v1' }
          @initialize()
        collection = HttpCollection.new collectionName,
          delegate: 'TestRecord'
        url = collection.urlForTakeAll 'Test', {}
        assert.equal url, 'http://localhost:8000/v1/tests?query=%7B%7D'
        url = collection.urlForTakeAll 'TestRecord', {}
        assert.equal url, 'http://localhost:8000/v1/tests?query=%7B%7D'
        yield return
  describe '#urlForTakeBy', ->
    it 'should get url for `take by` request', ->
      co ->
        collectionName = 'TestsCollection'
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
        class HttpCollection extends LeanRC::Collection
          @inheritProtected()
          @include LeanRC::QueryableCollectionMixin
          @include LeanRC::HttpCollectionMixin
          @module Test
          @public host: String, { default: 'http://localhost:8000' }
          @public namespace: String, { default: 'v1' }
          @initialize()
        collection = HttpCollection.new collectionName,
          delegate: 'TestRecord'
        url = collection.urlForTakeBy 'Test', {}
        assert.equal url, 'http://localhost:8000/v1/tests?query=%7B%7D'
        url = collection.urlForTakeBy 'TestRecord', {}
        assert.equal url, 'http://localhost:8000/v1/tests?query=%7B%7D'
        yield return
  describe '#urlForTake', ->
    it 'should get url for `take` request', ->
      co ->
        collectionName = 'TestsCollection'
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
        class HttpCollection extends LeanRC::Collection
          @inheritProtected()
          @include LeanRC::QueryableCollectionMixin
          @include LeanRC::HttpCollectionMixin
          @module Test
          @public host: String, { default: 'http://localhost:8000' }
          @public namespace: String, { default: 'v1' }
          @initialize()
        collection = HttpCollection.new collectionName,
          delegate: 'TestRecord'
        url = collection.urlForTake 'Test', '123'
        assert.equal url, 'http://localhost:8000/v1/tests/123'
        url = collection.urlForTake 'TestRecord', '123'
        assert.equal url, 'http://localhost:8000/v1/tests/123'
        yield return
  describe '#urlForPush', ->
    it 'should get url for `push` request', ->
      co ->
        collectionName = 'TestsCollection'
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
        class HttpCollection extends LeanRC::Collection
          @inheritProtected()
          @include LeanRC::QueryableCollectionMixin
          @include LeanRC::HttpCollectionMixin
          @module Test
          @public host: String, { default: 'http://localhost:8000' }
          @public namespace: String, { default: 'v1' }
          @initialize()
        collection = HttpCollection.new collectionName,
          delegate: 'TestRecord'
        url = collection.urlForPush 'Test', {}
        assert.equal url, 'http://localhost:8000/v1/tests'
        url = collection.urlForPush 'TestRecord', {}
        assert.equal url, 'http://localhost:8000/v1/tests'
        yield return
  describe '#urlForRemove', ->
    it 'should get url for `remove` request', ->
      co ->
        collectionName = 'TestsCollection'
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
        class HttpCollection extends LeanRC::Collection
          @inheritProtected()
          @include LeanRC::QueryableCollectionMixin
          @include LeanRC::HttpCollectionMixin
          @module Test
          @public host: String, { default: 'http://localhost:8000' }
          @public namespace: String, { default: 'v1' }
          @initialize()
        collection = HttpCollection.new collectionName,
          delegate: 'TestRecord'
        url = collection.urlForRemove 'Test', '123'
        assert.equal url, 'http://localhost:8000/v1/tests/123'
        url = collection.urlForRemove 'TestRecord', '123'
        assert.equal url, 'http://localhost:8000/v1/tests/123'
        yield return
  describe '#urlForOverride', ->
    it 'should get url for `override` request', ->
      co ->
        collectionName = 'TestsCollection'
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
        class HttpCollection extends LeanRC::Collection
          @inheritProtected()
          @include LeanRC::QueryableCollectionMixin
          @include LeanRC::HttpCollectionMixin
          @module Test
          @public host: String, { default: 'http://localhost:8000' }
          @public namespace: String, { default: 'v1' }
          @initialize()
        collection = HttpCollection.new collectionName,
          delegate: 'TestRecord'
        url = collection.urlForOverride 'Test', {}, '123'
        assert.equal url, 'http://localhost:8000/v1/tests/123'
        url = collection.urlForOverride 'TestRecord', {}, '123'
        assert.equal url, 'http://localhost:8000/v1/tests/123'
        yield return
  describe '#buildURL', ->
    it 'should get url from request params', ->
      co ->
        collectionName = 'TestsCollection'
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
        class HttpCollection extends LeanRC::Collection
          @inheritProtected()
          @include LeanRC::QueryableCollectionMixin
          @include LeanRC::HttpCollectionMixin
          @module Test
          @public host: String, { default: 'http://localhost:8000' }
          @public namespace: String, { default: 'v1' }
          @public urlForSomeRequest: Function, { default: -> '' }
          @initialize()
        collection = HttpCollection.new collectionName,
          delegate: 'TestRecord'
        url = collection.buildURL 'Test', {}, null, 'query', {a: '1'}
        assert.equal url, 'http://localhost:8000/v1/tests/query'
        url = collection.buildURL 'Test', {}, null, 'patchBy', {a: '1'}
        assert.equal url, 'http://localhost:8000/v1/tests/query'
        url = collection.buildURL 'Test', {}, null, 'removeBy', {a: '1'}
        assert.equal url, 'http://localhost:8000/v1/tests/query'
        url = collection.buildURL 'Test', {}, null, 'takeAll', {a: '1'}
        assert.equal url, 'http://localhost:8000/v1/tests?query=%7B%22a%22%3A%221%22%7D'
        url = collection.buildURL 'Test', {}, null, 'takeBy', {a: '1'}
        assert.equal url, 'http://localhost:8000/v1/tests?query=%7B%22a%22%3A%221%22%7D'
        url = collection.buildURL 'Test', {}, '123', 'take'
        assert.equal url, 'http://localhost:8000/v1/tests/123'
        url = collection.buildURL 'Test', {a: '1'}, null, 'push'
        assert.equal url, 'http://localhost:8000/v1/tests'
        url = collection.buildURL 'Test', {}, '123', 'remove'
        assert.equal url, 'http://localhost:8000/v1/tests/123'
        url = collection.buildURL 'Test', {}, '123', 'override'
        assert.equal url, 'http://localhost:8000/v1/tests/123'
        url = collection.buildURL 'Test', {}, null, 'someRequest', {a: '1'}
        assert.isString url
        yield return
  describe '#urlForRequest', ->
    it 'should get url from request params', ->
      co ->
        collectionName = 'TestsCollection'
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
        class HttpCollection extends LeanRC::Collection
          @inheritProtected()
          @include LeanRC::QueryableCollectionMixin
          @include LeanRC::HttpCollectionMixin
          @module Test
          @public host: String, { default: 'http://localhost:8000' }
          @public namespace: String, { default: 'v1' }
          @public urlForTest: Function,
            default: (recordName, query, snapshot, id) ->
              "TEST_#{recordName ? 'RECORD_NAME'}_#{id ? 'RECORD_ID'}_#{JSON.stringify(snapshot) ? 'SNAPSHOT'}_#{JSON.stringify(query) ? 'QUERY'}"
          @initialize()
        collection = HttpCollection.new collectionName,
          delegate: 'TestRecord'
        url = collection.urlForRequest
          recordName: 'Test'
          snapshot: {}
          requestType: 'query'
          query: {}
          id: '123'
        assert.equal url, 'http://localhost:8000/v1/tests/query'
        url = collection.urlForRequest
          recordName: 'Test'
          snapshot: {}
          requestType: 'patchBy'
          query: {}
          id: '123'
        assert.equal url, 'http://localhost:8000/v1/tests/query'
        url = collection.urlForRequest
          recordName: 'Test'
          snapshot: {}
          requestType: 'removeBy'
          query: {}
          id: '123'
        assert.equal url, 'http://localhost:8000/v1/tests/query'
        url = collection.urlForRequest
          recordName: 'Test'
          snapshot: {}
          requestType: 'takeAll'
          query: {}
          id: '123'
        assert.equal url, 'http://localhost:8000/v1/tests?query=%7B%7D'
        url = collection.urlForRequest
          recordName: 'Test'
          snapshot: {}
          requestType: 'takeBy'
          query: {}
          id: '123'
        assert.equal url, 'http://localhost:8000/v1/tests?query=%7B%7D'
        url = collection.urlForRequest
          recordName: 'Test'
          snapshot: {}
          requestType: 'take'
          query: {}
          id: '123'
        assert.equal url, 'http://localhost:8000/v1/tests/123'
        url = collection.urlForRequest
          recordName: 'Test'
          snapshot: {}
          requestType: 'push'
          query: {}
          id: '123'
        assert.equal url, 'http://localhost:8000/v1/tests'
        url = collection.urlForRequest
          recordName: 'Test'
          snapshot: {}
          requestType: 'remove'
          query: {}
          id: '123'
        assert.equal url, 'http://localhost:8000/v1/tests/123'
        url = collection.urlForRequest
          recordName: 'Test'
          snapshot: {}
          requestType: 'override'
          query: {}
          id: '123'
        assert.equal url, 'http://localhost:8000/v1/tests/123'
        url = collection.urlForRequest
          recordName: 'Test'
          snapshot: {}
          requestType: 'test'
          query: {}
          id: '123'
        assert.equal url, 'TEST_Test_123_{}_{}'
        yield return
  describe '#headersForRequest', ->
    it 'should get headers for collection', ->
      co ->
        collectionName = 'TestsCollection'
        KEY = 'TEST_HTTP_COLLECTION_123456'
        facade = LeanRC::Facade.getInstance KEY
        class Test extends LeanRC
          @inheritProtected()
          @root "#{__dirname}/config/root"
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
        configs = LeanRC::Configuration.new LeanRC::CONFIGURATION, Test::ROOT
        facade.registerProxy configs
        class HttpCollection extends LeanRC::Collection
          @inheritProtected()
          @include LeanRC::QueryableCollectionMixin
          @include LeanRC::HttpCollectionMixin
          @module Test
          @public host: String, { default: 'http://localhost:8000' }
          @public namespace: String, { default: 'v1' }
          @initialize()
        collection = HttpCollection.new collectionName,
          delegate: 'TestRecord'
        collection.initializeNotifier KEY
        headers = collection.headersForRequest
          requestType: 'query'
          recordName: 'test'
        assert.deepEqual headers,
          'Accept': 'application/json'
          'Authorization': "Bearer #{configs.apiKey}"
        headers = collection.headersForRequest
          requestType: 'patchBy'
          recordName: 'test'
        assert.deepEqual headers,
          'Accept': 'application/json'
          'Authorization': "Bearer #{configs.apiKey}"
        headers = collection.headersForRequest
          requestType: 'removeBy'
          recordName: 'test'
        assert.deepEqual headers,
          'Accept': 'application/json'
          'Authorization': "Bearer #{configs.apiKey}"
        headers = collection.headersForRequest
          requestType: 'takeAll'
          recordName: 'test'
        assert.deepEqual headers,
          'Accept': 'application/json'
          'Authorization': "Bearer #{configs.apiKey}"
          'NonLimitation': configs.apiKey
        headers = collection.headersForRequest
          requestType: 'takeBy'
          recordName: 'test'
        assert.deepEqual headers,
          'Accept': 'application/json'
          'Authorization': "Bearer #{configs.apiKey}"
          'NonLimitation': configs.apiKey
        headers = collection.headersForRequest
          requestType: 'take'
          recordName: 'test'
        assert.deepEqual headers,
          'Accept': 'application/json'
          'Authorization': "Bearer #{configs.apiKey}"
        headers = collection.headersForRequest
          requestType: 'push'
          recordName: 'test'
        assert.deepEqual headers,
          'Accept': 'application/json'
          'Authorization': "Bearer #{configs.apiKey}"
        headers = collection.headersForRequest
          requestType: 'remove'
          recordName: 'test'
        assert.deepEqual headers,
          'Accept': 'application/json'
          'Authorization': "Bearer #{configs.apiKey}"
        headers = collection.headersForRequest
          requestType: 'override'
          recordName: 'test'
        assert.deepEqual headers,
          'Accept': 'application/json'
          'Authorization': "Bearer #{configs.apiKey}"
        collection.headers = 'Allow': 'GET'
        headers = collection.headersForRequest()
        assert.deepEqual headers,
          'Accept': 'application/json'
          'Authorization': "Bearer #{configs.apiKey}"
          'Allow': 'GET'
        yield return
  describe '#dataForRequest', ->
    it 'should get data for request', ->
      co ->
        collectionName = 'TestsCollection'
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
        class HttpCollection extends LeanRC::Collection
          @inheritProtected()
          @include LeanRC::QueryableCollectionMixin
          @include LeanRC::HttpCollectionMixin
          @module Test
          @public host: String, { default: 'http://localhost:8000' }
          @public namespace: String, { default: 'v1' }
          @initialize()
        collection = HttpCollection.new collectionName,
          delegate: 'TestRecord'
        data = collection.dataForRequest
          requestType: 'push'
          recordName: 'TestRecord'
          snapshot: name: 'test1'
        assert.deepEqual data, { name: 'test1' }
        data = collection.dataForRequest
          requestType: 'override'
          recordName: 'TestRecord'
          snapshot: name: 'test2'
        assert.deepEqual data, { name: 'test2' }
        data = collection.dataForRequest
          requestType: 'query'
          recordName: 'TestRecord'
          query: name: 'test3'
        assert.deepEqual data, query: { name: 'test3' }
        data = collection.dataForRequest
          requestType: 'patchBy'
          recordName: 'TestRecord'
          query: name: 'test4'
        assert.deepEqual data, query: { name: 'test4' }
        data = collection.dataForRequest
          requestType: 'removeBy'
          recordName: 'TestRecord'
          query: name: 'test5'
        assert.deepEqual data, query: { name: 'test5' }
        yield return
  describe '#requestFor', ->
    it 'should request params', ->
      co ->
        collectionName = 'TestsCollection'
        KEY = 'TEST_HTTP_COLLECTION_654321'
        facade = LeanRC::Facade.getInstance KEY
        class Test extends LeanRC
          @inheritProtected()
          @root "#{__dirname}/config/root"
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
        configs = LeanRC::Configuration.new LeanRC::CONFIGURATION, Test::ROOT
        facade.registerProxy configs
        class HttpCollection extends LeanRC::Collection
          @inheritProtected()
          @include LeanRC::QueryableCollectionMixin
          @include LeanRC::HttpCollectionMixin
          @module Test
          @public host: String, { default: 'http://localhost:8000' }
          @public namespace: String, { default: 'v1' }
          @initialize()
        collection = HttpCollection.new collectionName,
          delegate: 'TestRecord'
        facade.registerProxy collection
        sampleData = name: 'test'
        request = collection.requestFor
          recordName: 'TestRecord'
          snapshot: undefined
          requestType: 'takeAll'
          query: name: 'test'
        assert.deepEqual request,
          method: 'GET'
          url: 'http://localhost:8000/v1/tests?query=%7B%22name%22%3A%22test%22%7D'
          headers:
            'Accept': 'application/json'
            'Authorization': "Bearer #{configs.apiKey}"
            'NonLimitation': configs.apiKey
          data: undefined
        request = collection.requestFor
          recordName: 'TestRecord'
          snapshot: sampleData
          requestType: 'push'
        assert.deepEqual request,
          method: 'POST'
          url: 'http://localhost:8000/v1/tests'
          headers:
            'Accept': 'application/json'
            'Authorization': "Bearer #{configs.apiKey}"
          data: sampleData
        request = collection.requestFor
          recordName: 'TestRecord'
          snapshot: sampleData
          requestType: 'override'
          id: '123'
        assert.deepEqual request,
          method: 'PUT'
          url: 'http://localhost:8000/v1/tests/123'
          headers:
            'Accept': 'application/json'
            'Authorization': "Bearer #{configs.apiKey}"
          data: sampleData
        request = collection.requestFor
          recordName: 'TestRecord'
          requestType: 'remove'
          query: name: 'test'
          id: '123'
        assert.deepEqual request,
          method: 'DELETE'
          url: 'http://localhost:8000/v1/tests/123'
          headers:
            'Accept': 'application/json'
            'Authorization': "Bearer #{configs.apiKey}"
          data: undefined
        request = collection.requestFor
          recordName: 'TestRecord'
          snapshot: undefined
          requestType: 'take'
          id: '123'
        assert.deepEqual request,
          method: 'GET'
          url: 'http://localhost:8000/v1/tests/123'
          headers:
            'Accept': 'application/json'
            'Authorization': "Bearer #{configs.apiKey}"
          data: undefined
        request = collection.requestFor
          recordName: 'TestRecord'
          snapshot: sampleData
          requestType: 'query'
          query: name: 'test'
        assert.deepEqual request,
          method: 'POST'
          url: 'http://localhost:8000/v1/tests/query'
          headers:
            'Accept': 'application/json'
            'Authorization': "Bearer #{configs.apiKey}"
          data: query: sampleData
        request = collection.requestFor
          recordName: 'TestRecord'
          snapshot: sampleData
          requestType: 'patchBy'
          query: name: 'test'
        assert.deepEqual request,
          method: 'POST'
          url: 'http://localhost:8000/v1/tests/query'
          headers:
            'Accept': 'application/json'
            'Authorization': "Bearer #{configs.apiKey}"
          data: query: sampleData
        request = collection.requestFor
          recordName: 'TestRecord'
          snapshot: sampleData
          requestType: 'removeBy'
          query: name: 'test'
        assert.deepEqual request,
          method: 'POST'
          url: 'http://localhost:8000/v1/tests/query'
          headers:
            'Accept': 'application/json'
            'Authorization': "Bearer #{configs.apiKey}"
          data: query: sampleData
        yield return
  describe '#push', ->
    facade = null
    before ->
      server.listen 8000
    after ->
      server.close()
      facade?.remove?()
    it 'should put data into collection', ->
      co ->
        collectionName = 'TestsCollection'
        KEY = 'FACADE_TEST_HTTP_COLLECTION_002'
        facade = LeanRC::Facade.getInstance KEY
        class Test extends LeanRC
          @inheritProtected()
          @root "#{__dirname}/config/root"
          @initialize()
        configs = LeanRC::Configuration.new LeanRC::CONFIGURATION, Test::ROOT
        facade.registerProxy configs
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
        class HttpCollection extends LeanRC::Collection
          @inheritProtected()
          @include LeanRC::QueryableCollectionMixin
          @include LeanRC::HttpCollectionMixin
          @module Test
          @public host: String, { default: 'http://localhost:8000' }
          @public namespace: String, { default: 'v1' }
          @initialize()
        facade.registerProxy HttpCollection.new collectionName,
          delegate: 'TestRecord'
        collection = facade.retrieveProxy collectionName
        spyPush = sinon.spy collection, 'push'
        spySendRequest = sinon.spy collection, 'sendRequest'
        assert.instanceOf collection, HttpCollection
        record = yield collection.create test: 'test1'
        assert.equal record, spyPush.args[0][0]
        assert.equal spySendRequest.args[0][0].method, 'POST'
        assert.equal spySendRequest.args[0][0].url, 'http://localhost:8000/v1/tests'
        assert.equal spySendRequest.args[0][0].options.body.test, 'test1'
        assert.equal spySendRequest.args[0][0].options.body.type, 'Test::TestRecord'
        assert.deepEqual spySendRequest.args[0][0].options.headers,
          'Accept': 'application/json'
          'Authorization': "Bearer #{configs.apiKey}"
        yield return
  describe '#remove', ->
    facade = null
    before ->
      server.listen 8000
    after ->
      server.close()
      facade?.remove?()
    it 'should remove data from collection', ->
      co ->
        collectionName = 'TestsCollection'
        KEY = 'FACADE_TEST_HTTP_COLLECTION_003'
        facade = LeanRC::Facade.getInstance KEY
        class Test extends LeanRC
          @inheritProtected()
          @root "#{__dirname}/config/root"
          @initialize()
        configs = LeanRC::Configuration.new LeanRC::CONFIGURATION, Test::ROOT
        facade.registerProxy configs
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
        class HttpCollection extends LeanRC::Collection
          @inheritProtected()
          @include LeanRC::QueryableCollectionMixin
          @include LeanRC::HttpCollectionMixin
          @module Test
          @public host: String, { default: 'http://localhost:8000' }
          @public namespace: String, { default: 'v1' }
          @public generateId: FuncG([RecordInterface], String),
            default: -> LeanRC::Utils.uuid.v4()
          @initialize()
        facade.registerProxy HttpCollection.new collectionName,
          delegate: 'TestRecord'
        collection = facade.retrieveProxy collectionName
        spySendRequest = sinon.spy collection, 'sendRequest'
        assert.instanceOf collection, HttpCollection
        record = yield collection.create test: 'test1'
        resp = yield record.destroy()
        assert.equal spySendRequest.args[2][0].method, 'DELETE'
        assert.include spySendRequest.args[2][0].url, 'http://localhost:8000/v1/tests/'
        assert.deepEqual spySendRequest.args[2][0].options?.headers,
          'Accept': 'application/json'
          'Authorization': "Bearer #{configs.apiKey}"
        yield return
  describe '#take', ->
    facade = null
    before ->
      server.listen 8000
    after ->
      server.close()
      facade?.remove?()
    it 'should get data item by id from collection', ->
      co ->
        collectionName = 'TestsCollection'
        KEY = 'FACADE_TEST_HTTP_COLLECTION_004'
        facade = LeanRC::Facade.getInstance KEY
        class Test extends LeanRC
          @inheritProtected()
          @root "#{__dirname}/config/root"
          @initialize()
        configs = LeanRC::Configuration.new LeanRC::CONFIGURATION, Test::ROOT
        facade.registerProxy configs
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
        class HttpCollection extends LeanRC::Collection
          @inheritProtected()
          @include LeanRC::QueryableCollectionMixin
          @include LeanRC::HttpCollectionMixin
          @module Test
          @public host: String, { default: 'http://localhost:8000' }
          @public namespace: String, { default: 'v1' }
          @public generateId: FuncG([RecordInterface], String),
            default: -> LeanRC::Utils.uuid.v4()
          @initialize()
        facade.registerProxy HttpCollection.new collectionName,
          delegate: 'TestRecord'
        collection = facade.retrieveProxy collectionName
        assert.instanceOf collection, HttpCollection
        record = yield collection.create test: 'test1'
        recordDuplicate = yield collection.take record.id
        assert.notEqual record, recordDuplicate
        for attribute in Test::TestRecord.attributes
          assert.equal record[attribute], recordDuplicate[attribute]
        yield return
  describe '#takeMany', ->
    facade = null
    before ->
      server.listen 8000
    after ->
      server.close()
      facade?.remove?()
    it 'should get data items by id list from collection', ->
      co ->
        collectionName = 'TestsCollection'
        KEY = 'FACADE_TEST_HTTP_COLLECTION_005'
        facade = LeanRC::Facade.getInstance KEY
        class Test extends LeanRC
          @inheritProtected()
          @root "#{__dirname}/config/root"
          @initialize()
        configs = LeanRC::Configuration.new LeanRC::CONFIGURATION, Test::ROOT
        facade.registerProxy configs
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
        class HttpCollection extends LeanRC::Collection
          @inheritProtected()
          @include LeanRC::QueryableCollectionMixin
          @include LeanRC::HttpCollectionMixin
          @module Test
          @public host: String, { default: 'http://localhost:8000' }
          @public namespace: String, { default: 'v1' }
          @public generateId: FuncG([RecordInterface], String),
            default: -> LeanRC::Utils.uuid.v4()
          @initialize()
        facade.registerProxy HttpCollection.new collectionName,
          delegate: 'TestRecord'
        collection = facade.retrieveProxy collectionName
        assert.instanceOf collection, HttpCollection
        originalRecords = []
        for i in [ 1 .. 5 ]
          originalRecords.push yield collection.create test: 'test1'
        ids = originalRecords.map (item) -> item.id
        recordDuplicates = yield (yield collection.takeMany ids).toArray()
        assert.equal originalRecords.length, recordDuplicates.length
        count = originalRecords.length
        for i in [ 1 .. count ]
          for attribute in Test::TestRecord.attributes
            assert.equal originalRecords[i][attribute], recordDuplicates[i][attribute]
        yield return
  describe '#takeBy', ->
    facade = null
    before ->
      server.listen 8000
    after ->
      server.close()
      facade?.remove?()
    it 'should get data items by id list from collection', ->
      co ->
        collectionName = 'TestsCollection'
        KEY = 'FACADE_TEST_HTTP_COLLECTION_006'
        facade = LeanRC::Facade.getInstance KEY
        class Test extends LeanRC
          @inheritProtected()
          @root "#{__dirname}/config/root"
          @initialize()
        configs = LeanRC::Configuration.new LeanRC::CONFIGURATION, Test::ROOT
        facade.registerProxy configs
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
        class HttpCollection extends LeanRC::Collection
          @inheritProtected()
          @include LeanRC::QueryableCollectionMixin
          @include LeanRC::HttpCollectionMixin
          @module Test
          @public host: String, { default: 'http://localhost:8000' }
          @public namespace: String, { default: 'v1' }
          @public generateId: FuncG([RecordInterface], String),
            default: -> LeanRC::Utils.uuid.v4()
          @initialize()
        facade.registerProxy HttpCollection.new collectionName,
          delegate: 'TestRecord'
        collection = facade.retrieveProxy collectionName
        assert.instanceOf collection, HttpCollection
        count = 5
        for i in [ 1 .. count ]
          yield collection.create test: 'test1'
        for i in [ 1 .. count ]
          yield collection.create test: 'test2'
        records = yield (yield collection.takeBy '@doc.test': 'test2').toArray()
        assert.lengthOf records, count
        for record in records
          assert.propertyVal record, 'test', 'test2'
        yield return
  describe '#takeAll', ->
    facade = null
    before ->
      server.listen 8000
    after ->
      server.close()
      facade?.remove?()
    it 'should get all data items from collection', ->
      co ->
        collectionName = 'TestsCollection'
        KEY = 'FACADE_TEST_HTTP_COLLECTION_007'
        facade = LeanRC::Facade.getInstance KEY
        class Test extends LeanRC
          @inheritProtected()
          @root "#{__dirname}/config/root"
          @initialize()
        configs = LeanRC::Configuration.new LeanRC::CONFIGURATION, Test::ROOT
        facade.registerProxy configs
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
        class HttpCollection extends LeanRC::Collection
          @inheritProtected()
          @include LeanRC::QueryableCollectionMixin
          @include LeanRC::HttpCollectionMixin
          @module Test
          @public host: String, { default: 'http://localhost:8000' }
          @public namespace: String, { default: 'v1' }
          @public generateId: FuncG([RecordInterface], String),
            default: -> LeanRC::Utils.uuid.v4()
          @initialize()
        facade.registerProxy HttpCollection.new collectionName,
          delegate: 'TestRecord'
        collection = facade.retrieveProxy collectionName
        assert.instanceOf collection, HttpCollection
        originalRecords = []
        for i in [ 1 .. 5 ]
          originalRecords.push yield collection.create test: 'test1'
        ids = originalRecords.map (item) -> item.id
        recordDuplicates = yield (yield collection.takeAll()).toArray()
        assert.equal originalRecords.length, recordDuplicates.length
        count = originalRecords.length
        for i in [ 1 .. count ]
          for attribute in Test::TestRecord.attributes
            assert.equal originalRecords[i][attribute], recordDuplicates[i][attribute]
        yield return
  describe '#override', ->
    facade = null
    before ->
      server.listen 8000
    after ->
      server.close()
      facade?.remove?()
    it 'should replace data item by id in collection', ->
      co ->
        collectionName = 'TestsCollection'
        KEY = 'FACADE_TEST_HTTP_COLLECTION_008'
        facade = LeanRC::Facade.getInstance KEY
        class Test extends LeanRC
          @inheritProtected()
          @root "#{__dirname}/config/root"
          @initialize()
        configs = LeanRC::Configuration.new LeanRC::CONFIGURATION, Test::ROOT
        facade.registerProxy configs
        class TestRecord extends LeanRC::Record
          @inheritProtected()
          @module Test
          @attribute name: String
          @public init: FuncG([Object, CollectionInterface], NilT),
            default: ->
              @super arguments...
              @type = 'Test::TestRecord'
              return
          @initialize()
        class HttpCollection extends LeanRC::Collection
          @inheritProtected()
          @include LeanRC::QueryableCollectionMixin
          @include LeanRC::HttpCollectionMixin
          @module Test
          @public host: String, { default: 'http://localhost:8000' }
          @public namespace: String, { default: 'v1' }
          @public generateId: FuncG([RecordInterface], String),
            default: -> LeanRC::Utils.uuid.v4()
          @initialize()
        facade.registerProxy HttpCollection.new collectionName,
          delegate: 'TestRecord'
        collection = facade.retrieveProxy collectionName
        assert.instanceOf collection, HttpCollection
        record = yield collection.create name: 'test1'
        updatedRecord = yield collection.override record.id, yield collection.build name: 'test2'
        assert.isDefined updatedRecord
        assert.equal record.id, updatedRecord.id
        assert.propertyVal record, 'name', 'test1'
        assert.propertyVal updatedRecord, 'name', 'test2'
        yield return
  describe '#includes', ->
    facade = null
    before ->
      server.listen 8000
    after ->
      server.close()
      facade?.remove?()
    it 'should test if item is included in the collection', ->
      co ->
        collectionName = 'TestsCollection'
        KEY = 'FACADE_TEST_HTTP_COLLECTION_009'
        facade = LeanRC::Facade.getInstance KEY
        class Test extends LeanRC
          @inheritProtected()
          @root "#{__dirname}/config/root"
          @initialize()
        configs = LeanRC::Configuration.new LeanRC::CONFIGURATION, Test::ROOT
        facade.registerProxy configs
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
        class HttpCollection extends LeanRC::Collection
          @inheritProtected()
          @include LeanRC::QueryableCollectionMixin
          @include LeanRC::HttpCollectionMixin
          @module Test
          @public host: String, { default: 'http://localhost:8000' }
          @public namespace: String, { default: 'v1' }
          @public generateId: FuncG([RecordInterface], String),
            default: -> LeanRC::Utils.uuid.v4()
          @initialize()
        facade.registerProxy HttpCollection.new collectionName,
          delegate: 'TestRecord'
        collection = facade.retrieveProxy collectionName
        assert.instanceOf collection, HttpCollection
        record = yield collection.create test: 'test1'
        assert.isDefined record
        includes = yield collection.includes record.id
        assert.isTrue includes
        yield return
  describe '#length', ->
    facade = null
    before ->
      server.listen 8000
    after ->
      server.close()
      facade?.remove?()
    it 'should count items in the collection', ->
      co ->
        collectionName = 'TestsCollection'
        KEY = 'FACADE_TEST_HTTP_COLLECTION_010'
        facade = LeanRC::Facade.getInstance KEY
        class Test extends LeanRC
          @inheritProtected()
          @root "#{__dirname}/config/root"
          @initialize()
        configs = LeanRC::Configuration.new LeanRC::CONFIGURATION, Test::ROOT
        facade.registerProxy configs
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
        class HttpCollection extends LeanRC::Collection
          @inheritProtected()
          @include LeanRC::QueryableCollectionMixin
          @include LeanRC::HttpCollectionMixin
          @include LeanRC::GenerateUuidIdMixin
          @module Test
          @public host: String, { default: 'http://localhost:8000' }
          @public namespace: String, { default: 'v1' }
          @public @async generateId: FuncG([RecordInterface], String),
            default: -> yield return LeanRC::Utils.uuid.v4()
          @initialize()
        facade.registerProxy HttpCollection.new collectionName,
          delegate: 'TestRecord'
        collection = facade.retrieveProxy collectionName
        assert.instanceOf collection, HttpCollection
        count = 11
        for i in [ 1 .. count ]
          yield collection.create test: 'test1'
        length = yield collection.length()
        assert.equal count, length
        yield return
