{ expect, assert } = require 'chai'
sinon = require 'sinon'
_ = require 'lodash'
# accepts = require 'accepts'
httpErrors = require 'http-errors'
LeanRC = require.main.require 'lib'
{ co } = LeanRC::Utils


describe 'Context', ->
  describe '.new', ->
    it 'should create Context instance', ->
      co ->
        class Test extends LeanRC
          @inheritProtected()
          @root "#{__dirname}/config/root"
        Test.initialize()
        class Context extends LeanRC::Context
          @inheritProtected()
          @module Test
        Context.initialize()
        switchInstance =
          configs:
            trustProxy: yes
            cookieKey: 'COOKIE_KEY'
        req =
          url: 'http://localhost:8888/test1'
          headers: 'x-forwarded-for': '192.168.0.1'
          secure: no
        res =
          _headers: 'Foo': 'Bar'
        context = Context.new req, res, switchInstance
        assert.instanceOf context, Context
        assert.equal context.req, req
        assert.equal context.res, res
        assert.equal context.switch, switchInstance
        assert.instanceOf context.request, Test::Request
        assert.instanceOf context.response, Test::Response
        assert.instanceOf context.cookies, Test::Cookies
        assert.deepEqual context.state, {}
        yield return
  describe '#throw', ->
    it 'should throw an error exception', ->
      co ->
        class Test extends LeanRC
          @inheritProtected()
          @root "#{__dirname}/config/root"
        Test.initialize()
        class Context extends LeanRC::Context
          @inheritProtected()
          @module Test
        Context.initialize()
        switchInstance =
          configs:
            trustProxy: yes
            cookieKey: 'COOKIE_KEY'
        req =
          url: 'http://localhost:8888/test1'
          headers: 'x-forwarded-for': '192.168.0.1'
          secure: no
        res =
          _headers: 'Foo': 'Bar'
        context = Context.new req, res, switchInstance
        assert.throws -> context.throw 404
        , httpErrors.HttpError
        assert.throws -> context.throw 501, 'Not Implemented'
        , httpErrors.HttpError
        yield return
  describe '#assert', ->
    it 'should assert with status codes', ->
      co ->
        class Test extends LeanRC
          @inheritProtected()
          @root "#{__dirname}/config/root"
        Test.initialize()
        class Context extends LeanRC::Context
          @inheritProtected()
          @module Test
        Context.initialize()
        switchInstance =
          configs:
            trustProxy: yes
            cookieKey: 'COOKIE_KEY'
        req =
          url: 'http://localhost:8888/test1'
          headers: 'x-forwarded-for': '192.168.0.1'
          secure: no
        res =
          _headers: 'Foo': 'Bar'
        context = Context.new req, res, switchInstance
        assert.doesNotThrow -> context.assert yes
        assert.throws -> context.assert 'test' is 'TEST', 500, 'Internal Error'
        , Error
        yield return
  describe '#header', ->
    it 'should get request header', ->
      co ->
        class Test extends LeanRC
          @inheritProtected()
          @root "#{__dirname}/config/root"
        Test.initialize()
        class Context extends LeanRC::Context
          @inheritProtected()
          @module Test
        Context.initialize()
        switchInstance =
          configs:
            trustProxy: yes
            cookieKey: 'COOKIE_KEY'
        req =
          url: 'http://localhost:8888/test1'
          headers: 'x-forwarded-for': '192.168.0.1'
          secure: no
        res =
          _headers: 'Foo': 'Bar'
        context = Context.new req, res, switchInstance
        assert.equal context.header, req.headers
        yield return
  describe '#headers', ->
    it 'should get request headers', ->
      co ->
        class Test extends LeanRC
          @inheritProtected()
          @root "#{__dirname}/config/root"
        Test.initialize()
        class Context extends LeanRC::Context
          @inheritProtected()
          @module Test
        Context.initialize()
        switchInstance =
          configs:
            trustProxy: yes
            cookieKey: 'COOKIE_KEY'
        req =
          url: 'http://localhost:8888/test1'
          headers: 'x-forwarded-for': '192.168.0.1'
          secure: no
        res =
          _headers: 'Foo': 'Bar'
        context = Context.new req, res, switchInstance
        assert.equal context.headers, req.headers
        yield return
  describe '#method', ->
    it 'should get and set request method', ->
      co ->
        class Test extends LeanRC
          @inheritProtected()
          @root "#{__dirname}/config/root"
        Test.initialize()
        class Context extends LeanRC::Context
          @inheritProtected()
          @module Test
        Context.initialize()
        switchInstance =
          configs:
            trustProxy: yes
            cookieKey: 'COOKIE_KEY'
        req =
          method: 'POST'
          url: 'http://localhost:8888/test1'
          headers: 'x-forwarded-for': '192.168.0.1'
          secure: no
        res =
          _headers: 'Foo': 'Bar'
        context = Context.new req, res, switchInstance
        assert.equal context.method, 'POST'
        context.method = 'PUT'
        assert.equal context.method, 'PUT'
        assert.equal req.method, 'PUT'
        yield return
  describe '#url', ->
    it 'should get and set request URL', ->
      co ->
        class Test extends LeanRC
          @inheritProtected()
          @root "#{__dirname}/config/root"
        Test.initialize()
        class Context extends LeanRC::Context
          @inheritProtected()
          @module Test
        Context.initialize()
        switchInstance =
          configs:
            trustProxy: yes
            cookieKey: 'COOKIE_KEY'
        req =
          method: 'POST'
          url: 'http://localhost:8888/test1'
          headers: 'x-forwarded-for': '192.168.0.1'
          secure: no
        res =
          _headers: 'Foo': 'Bar'
        context = Context.new req, res, switchInstance
        assert.equal context.url, 'http://localhost:8888/test1'
        context.url = 'http://localhost:8888/test2'
        assert.equal context.url, 'http://localhost:8888/test2'
        assert.equal req.url, 'http://localhost:8888/test2'
        yield return
  describe '#originalUrl', ->
    it 'should get original request URL', ->
      co ->
        class Test extends LeanRC
          @inheritProtected()
          @root "#{__dirname}/config/root"
        Test.initialize()
        class Context extends LeanRC::Context
          @inheritProtected()
          @module Test
        Context.initialize()
        switchInstance =
          configs:
            trustProxy: yes
            cookieKey: 'COOKIE_KEY'
        req =
          method: 'POST'
          url: 'http://localhost:8888/test1'
          headers: 'x-forwarded-for': '192.168.0.1'
          secure: no
        res =
          _headers: 'Foo': 'Bar'
        context = Context.new req, res, switchInstance
        assert.equal context.originalUrl, 'http://localhost:8888/test1'
        yield return
  describe '#origin', ->
    it 'should get request origin data', ->
      co ->
        class Test extends LeanRC
          @inheritProtected()
          @root "#{__dirname}/config/root"
        Test.initialize()
        class Context extends LeanRC::Context
          @inheritProtected()
          @module Test
        Context.initialize()
        switchInstance =
          configs:
            trustProxy: yes
            cookieKey: 'COOKIE_KEY'
        req =
          method: 'POST'
          url: 'http://localhost:8888/test1'
          headers:
            'x-forwarded-for': '192.168.0.1'
            'host': 'localhost:8888'
          secure: no
        res =
          _headers: 'Foo': 'Bar'
        context = Context.new req, res, switchInstance
        assert.equal context.origin, 'http://localhost:8888'
        req.secure = yes
        assert.equal context.origin, 'https://localhost:8888'
        yield return
  describe '#href', ->
    it 'should get request hyper reference', ->
      co ->
        class Test extends LeanRC
          @inheritProtected()
          @root "#{__dirname}/config/root"
        Test.initialize()
        class Context extends LeanRC::Context
          @inheritProtected()
          @module Test
        Context.initialize()
        switchInstance =
          configs:
            trustProxy: yes
            cookieKey: 'COOKIE_KEY'
        req =
          method: 'POST'
          url: '/test1'
          headers:
            'x-forwarded-for': '192.168.0.1'
            'host': 'localhost:8888'
          secure: no
        res =
          _headers: 'Foo': 'Bar'
        context = Context.new req, res, switchInstance
        assert.equal context.href, 'http://localhost:8888/test1'
        req.url = 'http://localhost1:9999/test2'
        context = Context.new req, res, switchInstance
        assert.equal context.href, 'http://localhost1:9999/test2'
        yield return
  describe '#path', ->
    it 'should get and set request path', ->
      co ->
        class Test extends LeanRC
          @inheritProtected()
          @root "#{__dirname}/config/root"
        Test.initialize()
        class Context extends LeanRC::Context
          @inheritProtected()
          @module Test
        Context.initialize()
        switchInstance =
          configs:
            trustProxy: yes
            cookieKey: 'COOKIE_KEY'
        req =
          method: 'POST'
          url: 'http://localhost:8888/test1?t=ttt'
          headers: 'x-forwarded-for': '192.168.0.1'
          secure: no
        res =
          _headers: 'Foo': 'Bar'
        context = Context.new req, res, switchInstance
        assert.equal context.path, '/test1'
        context.path = '/test2'
        assert.equal context.path, '/test2'
        assert.equal req.url, 'http://localhost:8888/test2?t=ttt'
        yield return
