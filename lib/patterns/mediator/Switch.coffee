# This file is part of LeanRC.
#
# LeanRC is free software: you can redistribute it and/or modify
# it under the terms of the GNU Lesser General Public License as published by
# the Free Software Foundation, either version 3 of the License, or
# (at your option) any later version.
#
# LeanRC is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
# GNU Lesser General Public License for more details.
#
# You should have received a copy of the GNU Lesser General Public License
# along with LeanRC.  If not, see <https://www.gnu.org/licenses/>.

# EventEmitter  = require 'events'
methods       = require 'methods'
# pathToRegexp  = require 'path-to-regexp'
# assert        = require 'assert'
# Stream        = require 'stream'
# onFinished    = require 'on-finished'


###
```coffee
module.exports = (Module)->
  class HttpSwitch extends Module::Switch
    @inheritProtected()
    @include Module::ArangoSwitchMixin

    @module Module

    @public routerName: String,
      default: 'ApplicationRouter'
    @public jsonRendererName: String,
      default: 'JsonRenderer'  # or 'ApplicationRenderer'
  HttpSwitch.initialize()
```
###


module.exports = (Module)->
  {
    MIGRATIONS
    APPLICATION_ROUTER
    APPLICATION_MEDIATOR
    HANDLER_RESULT
    AnyT, PointerT, AsyncFunctionT
    FuncG, ListG, MaybeG, InterfaceG, StructG, DictG, UnionG
    SwitchInterface, ContextInterface, RendererInterface, NotificationInterface
    ResourceInterface
    Mediator, Context
    ConfigurableMixin
    Renderer
    Utils: {
      _
      inflect
      co
      isGeneratorFunction
      genRandomAlphaNumbers
      statuses
    }
  } = Module::


  class Switch extends Mediator
    @inheritProtected()
    @include ConfigurableMixin
    @implements SwitchInterface
    @module Module

    ipoHttpServer = PointerT @private httpServer: Object
    ipoRenderers = PointerT @private renderers: MaybeG DictG String, MaybeG RendererInterface

    @public middlewares: Array
    @public handlers: Array

    @public responseFormats: ListG(String),
      get: -> [
        'json', 'html', 'xml', 'atom', 'text'
      ]

    @public routerName: String,
      default: APPLICATION_ROUTER

    @public defaultRenderer: String,
      default: 'json'

    @public @static compose: FuncG([ListG(Function), ListG MaybeG ListG Function], AsyncFunctionT),
      default: (middlewares, handlers)->
        unless _.isArray middlewares
          throw new Error 'Middleware stack must be an array!'
        unless _.isArray handlers
          throw new Error 'Handlers stack must be an array!'
        co.wrap (context)->
          for middleware in middlewares
            unless _.isFunction middleware
              throw new Error 'Middleware must be composed of functions!'
            yield middleware context
          runned = no
          for handlerGroup in handlers
            unless handlerGroup?
              continue
            for handler in handlerGroup
              unless _.isFunction handler
                throw new Error 'Handler must be composed of functions!'
              if yield handler context
                runned = yes
                break
            break if runned
          yield return

    # from https://github.com/koajs/route/blob/master/index.js ###############
    decode = FuncG([MaybeG String], MaybeG String) (val)-> # чистая функция
      decodeURIComponent val if val

    matches = FuncG([ContextInterface, String], Boolean) (ctx, method)->
      return yes unless method
      return yes if ctx.method is method
      if method is 'GET' and ctx.method is 'HEAD'
        return yes
      return no

    @public @static createMethod: FuncG([MaybeG String]),
      default: (method)->
        originMethodName = method
        if method
          method = method.toUpperCase()
        else
          originMethodName = 'all'

        @public "#{originMethodName}": FuncG([String, Function]),
          default: (path, routeFunc)->
            unless routeFunc
              throw new Error 'handler is required'
            { facade } = @
            { ERROR, DEBUG, LEVELS, SEND_TO_LOG } = Module::LogMessage
            self = @
            keys = []
            pathToRegexp = require 'path-to-regexp'
            re = pathToRegexp path, keys
            facade.sendNotification SEND_TO_LOG, "#{method ? 'ALL'} #{path} -> #{re}", LEVELS[DEBUG]

            @use keys.length, co.wrap (ctx)->
              unless matches ctx, method
                yield return
              m = re.exec ctx.path
              if m
                pathParams = m[1..]
                  .map decode
                  .reduce (prev, item, index)->
                    prev[keys[index].name] = item
                    prev
                  , {}
                ctx.routePath = path
                facade.sendNotification SEND_TO_LOG, "#{ctx.method} #{path} matches #{ctx.path} #{JSON.stringify pathParams}", LEVELS[DEBUG]
                ctx.pathParams = pathParams
                return yield routeFunc.call self, ctx
              yield return

            # это надо будет заиспользовать когда решится вопрос "как подрубить свайгер"
            #@defineSwaggerEndpoint voEndpoint
            return
        return

    Class = @
    methods.forEach (method)->
      # console.log 'SWITCH:', @
      Class.createMethod method

    @public del: Function,
      default: (args...)->
        @delete args...

    @createMethod() # create @public all:...
    ##########################################################################

    # @public jsonRendererName: String
    # @public htmlRendererName: String
    # @public xmlRendererName: String
    # @public atomRendererName: String

    @public listNotificationInterests: FuncG([], Array),
      default: ->
        [
          HANDLER_RESULT
        ]

    @public handleNotification: FuncG(NotificationInterface),
      default: (aoNotification)->
        vsName = aoNotification.getName()
        voBody = aoNotification.getBody()
        vsType = aoNotification.getType()
        switch vsName
          when HANDLER_RESULT
            @getViewComponent().emit vsType, voBody
        return

    @public onRegister: Function,
      default: ->
        EventEmitter = require 'events'
        voEmitter = new EventEmitter()
        if voEmitter.listeners('error').length is 0
          voEmitter.on 'error', @onerror.bind @
        @setViewComponent voEmitter
        @defineRoutes()
        @serverListen()
        return

    @public onRemove: Function,
      default: ->
        voEmitter = @getViewComponent()
        voEmitter.eventNames().forEach (eventName)->
          voEmitter.removeAllListeners eventName
        @[ipoHttpServer].close()
        return

    @public serverListen: Function,
      default: ->
        port = process?.env?.PORT ? @configs.port
        { facade } = @
        http = require 'http'
        @[ipoHttpServer] = http.createServer @callback()
        @[ipoHttpServer].listen port, ->
          # console.log "listening on port #{port}"
          { ERROR, DEBUG, LEVELS, SEND_TO_LOG } = Module::LogMessage
          facade.sendNotification SEND_TO_LOG, "listening on port #{port}", LEVELS[DEBUG]
        return

    @public use: FuncG([UnionG(Number, Function), MaybeG Function], SwitchInterface),
      default: (index, middleware)->
        unless middleware?
          middleware = index
          index = null
        unless _.isFunction middleware
          throw new Error 'middleware or handler must be a function!'
        if isGeneratorFunction middleware
          { name: oldName } = middleware
          middleware = co.wrap middleware
          middleware._name = oldName
        middlewareName = middleware._name ? middleware.name ? '-'
        { ERROR, DEBUG, LEVELS, SEND_TO_LOG } = Module::LogMessage
        @sendNotification SEND_TO_LOG, "use #{middlewareName}", LEVELS[DEBUG]
        if index?
          @handlers[index] ?= []
          @handlers[index].push middleware
        else
          @middlewares.push middleware
        return @

    @public callback: FuncG([], AsyncFunctionT),
      default: ->
        fn = @constructor.compose @middlewares, @handlers
        self = @
        onFinished = require 'on-finished'
        handleRequest = co.wrap (req, res)->
          t1 = Date.now()
          { ERROR, DEBUG, LEVELS, SEND_TO_LOG } = Module::LogMessage
          self.sendNotification SEND_TO_LOG, '>>>>>> START REQUEST HANDLING', LEVELS[DEBUG]
          res.statusCode = 404
          voContext = Context.new req, res, self
          try
            yield fn voContext
            self.respond voContext
          catch err
            voContext.onerror err

          onFinished res, (err)->
            voContext.onerror err
            return
          self.sendNotification SEND_TO_LOG, '>>>>>> END REQUEST HANDLING', LEVELS[DEBUG]
          reqLength = voContext.request.length
          resLength = voContext.response.length
          time = Date.now() - t1
          yield self.handleStatistics reqLength, resLength, time, voContext
          yield return
        handleRequest

    # NOTE: пустая функция, которую вызываем из callback и передаем в нее длину реквеста, длину респонза, время выполнения, и контекст, чтобы потом в отдельном миксине можно было определить тело этого метода, т.е. как реализовывать сохранение (реагировать) этой статистики.
    @public @async handleStatistics: FuncG([Number, Number, Number, ContextInterface]),
      default: (reqLength, resLength, time, aoContext)->
        { DEBUG, LEVELS, SEND_TO_LOG } = Module::LogMessage
        @sendNotification SEND_TO_LOG, "
          REQUEST LENGTH #{reqLength} byte
          RESPONSE LENGTH #{resLength} byte
          HANDLED BY #{time} ms
        ", LEVELS[DEBUG]
        yield return

    # Default error handler
    @public onerror: FuncG(Error),
      default: (err)->
        assert = require 'assert'
        assert _.isError(err), "non-error thrown: #{err}"
        return if 404 is err.status or err.expose
        return if @configs.silent
        msg = err.stack ? String err
        { ERROR, DEBUG, LEVELS, SEND_TO_LOG } = Module::LogMessage
        @sendNotification SEND_TO_LOG, msg.replace(/^/gm, '  '), LEVELS[ERROR]
        return

    @public respond: FuncG(ContextInterface),
      default: (ctx)->
        return if ctx.respond is no
        return unless ctx.writable
        body = ctx.body
        code = ctx.status
        if statuses.empty[code]
          ctx.body = null
          ctx.res.end()
          return
        if 'HEAD' is ctx.method
          if not ctx.res.headersSent and _.isObjectLike body
            ctx.length = Buffer.byteLength JSON.stringify body
          ctx.res.end()
          return
        unless body?
          body = ctx.message ? String code
          unless ctx.res.headersSent
            ctx.type = 'text'
            ctx.length = Buffer.byteLength body
          ctx.res.end body
          return
        if _.isBuffer(body) or _.isString body
          ctx.res.end body
          return
        if body instanceof require 'stream'
          body.pipe ctx.res
          return
        body = JSON.stringify body ? null
        unless ctx.res.headersSent
          ctx.length = Buffer.byteLength body
        ctx.res.end body
        return

    @public rendererFor: FuncG(String, RendererInterface),
      default: (asFormat)->
        @[ipoRenderers] ?= {}
        @[ipoRenderers][asFormat] ?= do (asFormat)=>
          voRenderer = if @["#{asFormat}RendererName"]?
            @facade.retrieveProxy @["#{asFormat}RendererName"]
          voRenderer ?= Renderer.new()
          voRenderer
        @[ipoRenderers][asFormat]

    @public @async sendHttpResponse: FuncG([ContextInterface, MaybeG(AnyT), ResourceInterface, InterfaceG {
      method: String
      path: String
      resource: String
      action: String
      tag: String
      template: String
      keyName: MaybeG String
      entityName: String
      recordName: MaybeG String
    }]),
      default: (ctx, aoData, resource, opts)->
        if opts.action is 'create'
          ctx.status = 201
        # unless ctx.headers?.accept?
        #   yield return
        # switch (vsFormat = ctx.accepts @responseFormats)
        #   when no
        #   else
        #     if @["#{vsFormat}RendererName"]?
        #       voRenderer = @rendererFor vsFormat
        #       voRendered = yield voRenderer
        #         .render ctx, aoData, resource, opts
        #       ctx.body = voRendered
        # yield return

        if ctx.headers?.accept?
          switch (vsFormat = ctx.accepts @responseFormats)
            when no
            else
              if @["#{vsFormat}RendererName"]?
                voRenderer = @rendererFor vsFormat
        else
          if @["#{@defaultRenderer}RendererName"]?
            voRenderer = @rendererFor @defaultRenderer
        if voRenderer?
          voRendered = yield voRenderer
            .render ctx, aoData, resource, opts
          ctx.body = voRendered
        yield return

    @public defineRoutes: Function,
      default: ->
        voRouter = @facade.retrieveProxy @routerName ? APPLICATION_ROUTER
        voRouter.routes.forEach (aoRoute)=>
          @createNativeRoute aoRoute
        return

    @public sender: FuncG([String, StructG({
      context: ContextInterface
      reverse: String
    }), InterfaceG {
      method: String
      path: String
      resource: String
      action: String
      tag: String
      template: String
      keyName: MaybeG String
      entityName: String
      recordName: MaybeG String
    }]),
      default: (resourceName, aoMessage, {method, path, resource, action})->
        @sendNotification resourceName, aoMessage, action
        return

    # @public defineSwaggerEndpoint: Function,
    #   default: (aoSwaggerEndpoint, resourceName, action)->
    #     voGateway = @facade.retrieveProxy "#{resourceName}Gateway"
    #     {
    #       tags
    #       headers
    #       pathParams
    #       queryParams
    #       payload
    #       responses
    #       errors
    #       title
    #       synopsis
    #       isDeprecated
    #     } = voGateway.swaggerDefinitionFor action
    #     tags?.forEach (tag)->
    #       aoSwaggerEndpoint.tag tag
    #     headers?.forEach ({name, schema, description})->
    #       aoSwaggerEndpoint.header name, schema, description
    #     pathParams?.forEach ({name, schema, description})->
    #       aoSwaggerEndpoint.pathParam name, schema, description
    #     queryParams?.forEach ({name, schema, description})->
    #       aoSwaggerEndpoint.queryParam name, schema, description
    #     if payload?
    #       aoSwaggerEndpoint.body payload.schema, payload.mimes, payload.description
    #     responses?.forEach ({status, schema, mimes, description})->
    #       aoSwaggerEndpoint.response status, schema, mimes, description
    #     errors?.forEach ({status, description})->
    #       aoSwaggerEndpoint.error status, description
    #     aoSwaggerEndpoint.summary title            if title?
    #     aoSwaggerEndpoint.description synopsis     if synopsis?
    #     aoSwaggerEndpoint.deprecated isDeprecated  if isDeprecated?
    #     return

    @public createNativeRoute: FuncG([InterfaceG {
      method: String
      path: String
      resource: String
      action: String
      tag: String
      template: String
      keyName: MaybeG String
      entityName: String
      recordName: MaybeG String
    }]),
      default: (opts)->
        {method, path} = opts
        resourceName = inflect.camelize inflect.underscore "#{opts.resource.replace /[/]/g, '_'}Resource"

        self = @
        @[method]? path, co.wrap (context)->
          yield Module::Promise.new (resolve, reject)->
            try
              reverse = genRandomAlphaNumbers 32
              self.getViewComponent().once reverse, co.wrap ({error, result, resource})->
                if error?
                  console.log '>>>>>> ERROR AFTER RESOURCE', error
                  reject error
                  yield return
                try
                  yield self.sendHttpResponse context, result, resource, opts
                  resolve()
                  yield return
                catch err
                  reject err
                  yield return
              self.sender resourceName, {context, reverse}, opts
            catch err
              reject err
            return
          yield return yes
        return

    @public init: FuncG([MaybeG(String), MaybeG AnyT]),
      default: (args...)->
        @super args...
        @[ipoRenderers] = {}
        @middlewares = []
        @handlers = []
        return


    @initialize()
