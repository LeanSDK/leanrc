# accepts       = require 'accepts'
# createError   = require 'http-errors'
assert        = require 'assert'

###
Идеи взяты из https://github.com/koajs/koa/blob/master/lib/context.js
###


module.exports = (Module)->
  {
    DEVELOPMENT
    AnyT, NilT
    FuncG, UnionG, MaybeG
    RequestInterface, ResponseInterface, SwitchInterface, CookiesInterface
    ContextInterface
    CoreObject
    Request, Response, Cookies
    Utils: { _, statuses }
  } = Module::

  class Context extends CoreObject
    @inheritProtected()
    @implements ContextInterface
    @module Module

    @public req: Object # native request object
    @public res: Object # native response object
    @public request: RequestInterface
    @public response: ResponseInterface
    @public cookies: CookiesInterface
    @public accept: Object
    @public state: Object
    @public switch: SwitchInterface
    @public respond: Boolean
    @public routePath: String
    @public pathParams: Object
    @public transaction: Object
    @public session: Object

    # @public database: String # возможно это тоже надо получать из метода из отдельного модуля

    @public throw: FuncG([UnionG(String, Number), MaybeG(String), MaybeG Object], NilT),
      default: (args...)->
        createError = require 'http-errors'
        throw createError args...

    @public assert: FuncG([AnyT, UnionG(String, Number), MaybeG(String), MaybeG Object], NilT),
      default: assert

    @public onerror: FuncG(Error, NilT),
      default: (err)->
        return unless err?
        unless _.isError err
          err = new Error "non-error thrown: #{err}"
        headerSent = no
        if @headerSent or not @writable
          headerSent = err.headerSent = yes
        @switch.getViewComponent().emit 'error', err, @

        return if headerSent
        {res} = @
        if _.isFunction res.getHeaderNames
          res.getHeaderNames().forEach (name)-> res.removeHeader name
        if (vlHeaderNames = Object.keys res.headers ? {}).length > 0
          vlHeaderNames.forEach (name)-> res.removeHeader name
        @set err.headers ? {}
        @type = 'text'
        err.status = 404 if 'ENOENT' is err.code
        err.status = 500 if not _.isNumber(err.status) or not statuses[err.status]
        code = statuses[err.status]
        msg = if err.expose
          err.message
        else
          code
        message =
          error: yes
          errorNum: err.status
          errorMessage: msg
          code: err.code ? code
        if @switch.configs.environment is DEVELOPMENT
          message.exception = "#{err.name ? 'Error'}: #{msg}"
          message.stacktrace = err.stack.split '\n'
        @status = err.status
        message = JSON.stringify message
        @length = Buffer.byteLength message
        @res.end message
        return

    # Request aliases
    @public header: Object,
      get: -> @request.header
    @public headers: Object,
      get: -> @request.headers
    @public method: String,
      get: -> @request.method
      set: (method)-> @request.method = method
    @public url: String,
      get: -> @request.url
      set: (url)-> @request.url = url
    @public originalUrl: String
    @public origin: String,
      get: -> @request.origin
    @public href: String,
      get: -> @request.href
    @public path: String,
      get: -> @request.path
      set: (path)-> @request.path = path
    @public query: Object,
      get: -> @request.query
      set: (query)-> @request.query = query
    @public querystring: String,
      get: -> @request.querystring
      set: (querystring)-> @request.querystring = querystring
    @public host: String,
      get: -> @request.host
    @public hostname: String,
      get: -> @request.hostname
    @public fresh: Boolean,
      get: -> @request.fresh
    @public stale: Boolean,
      get: -> @request.stale
    @public socket: Object,
      get: -> @request.socket
    @public protocol: String,
      get: -> @request.protocol
    @public secure: Boolean,
      get: -> @request.secure
    @public ip: String,
      get: -> @request.ip
    @public ips: Array,
      get: -> @request.ips
    @public subdomains: Array,
      get: -> @request.subdomains
    @public 'is': FuncG([UnionG String, Array], UnionG String, Boolean, NilT),
      default: (args...)-> @request.is args...
    @public accepts: FuncG([UnionG String, Array], UnionG String, Array, Boolean),
      default: (args...)-> @request.accepts args...
    @public acceptsEncodings: FuncG([UnionG String, Array], UnionG String, Array),
      default: (args...)-> @request.acceptsEncodings args...
    @public acceptsCharsets: FuncG([UnionG String, Array], UnionG String, Array),
      default: (args...)-> @request.acceptsCharsets args...
    @public acceptsLanguages: FuncG([UnionG String, Array], UnionG String, Array),
      default: (args...)-> @request.acceptsLanguages args...
    @public get: FuncG(String, String),
      default: (args...)-> @request.get args...

    # Response aliases
    @public body: UnionG(String, Buffer, Object, Array, Number, Boolean),
      get: -> @response.body
      set: (body)-> @response.body = body
    @public status: UnionG(String, Number),
      get: -> @response.status
      set: (status)-> @response.status = status
    @public message: String,
      get: -> @response.message
      set: (message)-> @response.message = message
    @public length: Number,
      get: -> @response.length
      set: (length)-> @response.length = length
    @public writable: Boolean,
      get: -> @response.writable
    @public type: String,
      get: -> @response.type
      set: (type)-> @response.type = type
    @public headerSent: Boolean,
      get: -> @response.headerSent
    @public redirect: FuncG([String, String], NilT),
      default: (args...)-> @response.redirect args...
    @public attachment: FuncG(String, NilT),
      default: (args...)-> @response.attachment args...
    @public set: FuncG([UnionG(String, Object, Array), String], NilT),
      default: (args...)-> @response.set args...
    @public append: FuncG([String, UnionG String, Array], UnionG String, Array),
      default: (args...)-> @response.append args...
    @public vary: FuncG(String, NilT),
      default: (args...)-> @response.vary args...
    @public flushHeaders: Function,
      default: (args...)-> @response.flushHeaders args...
    @public remove: FuncG(String, NilT),
      default: (args...)-> @response.remove args...
    @public lastModified: Date,
      set: (date)-> @response.lastModified = date
    @public etag: String,
      set: (etag)-> @response.etag = etag

    # @public toJSON: Function,
    #   default: ->
    #     # request: @request.toJSON()
    #     # response: @response.toJSON()
    #     # app: @switch.constructor.NAME
    #     originalUrl: @originalUrl
    #     req: '<original req>'
    #     res: '<original res>'
    #     socket: '<original node socket or undefined>'

    # @public inspect: Function,
    #   default: -> @toJSON()

    @public @static @async restoreObject: Function,
      default: ->
        throw new Error "restoreObject method not supported for #{@name}"
        yield return

    @public @static @async replicateObject: Function,
      default: ->
        throw new Error "replicateObject method not supported for #{@name}"
        yield return

    @public init: FuncG([Object, Object, SwitchInterface], NilT),
      default: (req, res, switchInstanse)->
        @super()
        accepts = require 'accepts'
        @req = req
        @res = res
        @switch = switchInstanse
        @originalUrl = req.url
        @accept = accepts req
        @request = Request.new(@)
        @response = Response.new(@)
        key = @switch.configs.cookieKey
        secure = req.secure
        @cookies = Cookies.new req, res, {key, secure}
        @state = {}
        return


    @initialize()
