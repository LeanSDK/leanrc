(function() {
  // This file is part of LeanRC.

  // LeanRC is free software: you can redistribute it and/or modify
  // it under the terms of the GNU Lesser General Public License as published by
  // the Free Software Foundation, either version 3 of the License, or
  // (at your option) any later version.

  // LeanRC is distributed in the hope that it will be useful,
  // but WITHOUT ANY WARRANTY; without even the implied warranty of
  // MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
  // GNU Lesser General Public License for more details.

  // You should have received a copy of the GNU Lesser General Public License
  // along with LeanRC.  If not, see <https://www.gnu.org/licenses/>.

  // EventEmitter  = require 'events'
  var methods;

  methods = require('methods');

  // pathToRegexp  = require 'path-to-regexp'
  // assert        = require 'assert'
  // Stream        = require 'stream'
  // onFinished    = require 'on-finished'
  /*
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
  */
  module.exports = function(Module) {
    var APPLICATION_MEDIATOR, APPLICATION_ROUTER, AnyT, AsyncFunctionT, ConfigurableMixin, Context, ContextInterface, DictG, FuncG, HANDLER_RESULT, InterfaceG, ListG, MIGRATIONS, MaybeG, Mediator, NotificationInterface, PointerT, Renderer, RendererInterface, ResourceInterface, StructG, Switch, SwitchInterface, UnionG, _, co, genRandomAlphaNumbers, inflect, isGeneratorFunction, statuses;
    ({
      MIGRATIONS,
      APPLICATION_ROUTER,
      APPLICATION_MEDIATOR,
      HANDLER_RESULT,
      AnyT,
      PointerT,
      AsyncFunctionT,
      FuncG,
      ListG,
      MaybeG,
      InterfaceG,
      StructG,
      DictG,
      UnionG,
      SwitchInterface,
      ContextInterface,
      RendererInterface,
      NotificationInterface,
      ResourceInterface,
      Mediator,
      Context,
      ConfigurableMixin,
      Renderer,
      Utils: {_, inflect, co, isGeneratorFunction, genRandomAlphaNumbers, statuses}
    } = Module.prototype);
    return Switch = (function() {
      var Class, decode, ipoHttpServer, ipoRenderers, matches;

      class Switch extends Mediator {};

      Switch.inheritProtected();

      Switch.include(ConfigurableMixin);

      Switch.implements(SwitchInterface);

      Switch.module(Module);

      ipoHttpServer = PointerT(Switch.private({
        httpServer: Object
      }));

      ipoRenderers = PointerT(Switch.private({
        renderers: MaybeG(DictG(String, MaybeG(RendererInterface)))
      }));

      Switch.public({
        middlewares: Array
      });

      Switch.public({
        handlers: Array
      });

      Switch.public({
        responseFormats: ListG(String)
      }, {
        get: function() {
          return ['json', 'html', 'xml', 'atom', 'text'];
        }
      });

      Switch.public({
        routerName: String
      }, {
        default: APPLICATION_ROUTER
      });

      Switch.public({
        defaultRenderer: String
      }, {
        default: 'json'
      });

      Switch.public(Switch.static({
        compose: FuncG([ListG(Function), ListG(MaybeG(ListG(Function)))], AsyncFunctionT)
      }, {
        default: function(middlewares, handlers) {
          if (!_.isArray(middlewares)) {
            throw new Error('Middleware stack must be an array!');
          }
          if (!_.isArray(handlers)) {
            throw new Error('Handlers stack must be an array!');
          }
          return co.wrap(function*(context) {
            var handler, handlerGroup, i, j, k, len, len1, len2, middleware, runned;
            for (i = 0, len = middlewares.length; i < len; i++) {
              middleware = middlewares[i];
              if (!_.isFunction(middleware)) {
                throw new Error('Middleware must be composed of functions!');
              }
              yield middleware(context);
            }
            runned = false;
            for (j = 0, len1 = handlers.length; j < len1; j++) {
              handlerGroup = handlers[j];
              if (handlerGroup == null) {
                continue;
              }
              for (k = 0, len2 = handlerGroup.length; k < len2; k++) {
                handler = handlerGroup[k];
                if (!_.isFunction(handler)) {
                  throw new Error('Handler must be composed of functions!');
                }
                if ((yield handler(context))) {
                  runned = true;
                  break;
                }
              }
              if (runned) {
                break;
              }
            }
          });
        }
      }));

      // from https://github.com/koajs/route/blob/master/index.js ###############
      decode = FuncG([MaybeG(String)], MaybeG(String))(function(val) { // чистая функция
        if (val) {
          return decodeURIComponent(val);
        }
      });

      matches = FuncG([ContextInterface, String], Boolean)(function(ctx, method) {
        if (!method) {
          return true;
        }
        if (ctx.method === method) {
          return true;
        }
        if (method === 'GET' && ctx.method === 'HEAD') {
          return true;
        }
        return false;
      });

      Switch.public(Switch.static({
        createMethod: FuncG([MaybeG(String)])
      }, {
        default: function(method) {
          var originMethodName;
          originMethodName = method;
          if (method) {
            method = method.toUpperCase();
          } else {
            originMethodName = 'all';
          }
          this.public({
            [`${originMethodName}`]: FuncG([String, Function])
          }, {
            default: function(path, routeFunc) {
              var DEBUG, ERROR, LEVELS, SEND_TO_LOG, facade, keys, pathToRegexp, re, self;
              if (!routeFunc) {
                throw new Error('handler is required');
              }
              ({facade} = this);
              ({ERROR, DEBUG, LEVELS, SEND_TO_LOG} = Module.prototype.LogMessage);
              self = this;
              keys = [];
              pathToRegexp = require('path-to-regexp');
              re = pathToRegexp(path, keys);
              facade.sendNotification(SEND_TO_LOG, `${method != null ? method : 'ALL'} ${path} -> ${re}`, LEVELS[DEBUG]);
              this.use(keys.length, co.wrap(function*(ctx) {
                var m, pathParams;
                if (!matches(ctx, method)) {
                  return;
                }
                m = re.exec(ctx.path);
                if (m) {
                  pathParams = m.slice(1).map(decode).reduce(function(prev, item, index) {
                    prev[keys[index].name] = item;
                    return prev;
                  }, {});
                  ctx.routePath = path;
                  facade.sendNotification(SEND_TO_LOG, `${ctx.method} ${path} matches ${ctx.path} ${JSON.stringify(pathParams)}`, LEVELS[DEBUG]);
                  ctx.pathParams = pathParams;
                  return (yield routeFunc.call(self, ctx));
                }
              }));
            }
          });
        }
      }));

      // это надо будет заиспользовать когда решится вопрос "как подрубить свайгер"
      //@defineSwaggerEndpoint voEndpoint
      Class = Switch;

      methods.forEach(function(method) {
        // console.log 'SWITCH:', @
        return Class.createMethod(method);
      });

      Switch.public({
        del: Function
      }, {
        default: function(...args) {
          return this.delete(...args);
        }
      });

      Switch.createMethod(); // create @public all:...

      //#########################################################################

      // @public jsonRendererName: String
      // @public htmlRendererName: String
      // @public xmlRendererName: String
      // @public atomRendererName: String
      Switch.public({
        listNotificationInterests: FuncG([], Array)
      }, {
        default: function() {
          return [HANDLER_RESULT];
        }
      });

      Switch.public({
        handleNotification: FuncG(NotificationInterface)
      }, {
        default: function(aoNotification) {
          var voBody, vsName, vsType;
          vsName = aoNotification.getName();
          voBody = aoNotification.getBody();
          vsType = aoNotification.getType();
          switch (vsName) {
            case HANDLER_RESULT:
              this.getViewComponent().emit(vsType, voBody);
          }
        }
      });

      Switch.public({
        onRegister: Function
      }, {
        default: function() {
          var EventEmitter, voEmitter;
          EventEmitter = require('events');
          voEmitter = new EventEmitter();
          if (voEmitter.listeners('error').length === 0) {
            voEmitter.on('error', this.onerror.bind(this));
          }
          this.setViewComponent(voEmitter);
          this.defineRoutes();
          this.serverListen();
        }
      });

      Switch.public({
        onRemove: Function
      }, {
        default: function() {
          var voEmitter;
          voEmitter = this.getViewComponent();
          voEmitter.eventNames().forEach(function(eventName) {
            return voEmitter.removeAllListeners(eventName);
          });
          this[ipoHttpServer].close();
        }
      });

      Switch.public({
        serverListen: Function
      }, {
        default: function() {
          var facade, http, port, ref, ref1;
          port = (ref = typeof process !== "undefined" && process !== null ? (ref1 = process.env) != null ? ref1.PORT : void 0 : void 0) != null ? ref : this.configs.port;
          ({facade} = this);
          http = require('http');
          this[ipoHttpServer] = http.createServer(this.callback());
          this[ipoHttpServer].listen(port, function() {
            var DEBUG, ERROR, LEVELS, SEND_TO_LOG;
            // console.log "listening on port #{port}"
            ({ERROR, DEBUG, LEVELS, SEND_TO_LOG} = Module.prototype.LogMessage);
            return facade.sendNotification(SEND_TO_LOG, `listening on port ${port}`, LEVELS[DEBUG]);
          });
        }
      });

      Switch.public({
        use: FuncG([UnionG(Number, Function), MaybeG(Function)], SwitchInterface)
      }, {
        default: function(index, middleware) {
          var DEBUG, ERROR, LEVELS, SEND_TO_LOG, base, middlewareName, oldName, ref, ref1;
          if (middleware == null) {
            middleware = index;
            index = null;
          }
          if (!_.isFunction(middleware)) {
            throw new Error('middleware or handler must be a function!');
          }
          if (isGeneratorFunction(middleware)) {
            ({
              name: oldName
            } = middleware);
            middleware = co.wrap(middleware);
            middleware._name = oldName;
          }
          middlewareName = (ref = (ref1 = middleware._name) != null ? ref1 : middleware.name) != null ? ref : '-';
          ({ERROR, DEBUG, LEVELS, SEND_TO_LOG} = Module.prototype.LogMessage);
          this.sendNotification(SEND_TO_LOG, `use ${middlewareName}`, LEVELS[DEBUG]);
          if (index != null) {
            if ((base = this.handlers)[index] == null) {
              base[index] = [];
            }
            this.handlers[index].push(middleware);
          } else {
            this.middlewares.push(middleware);
          }
          return this;
        }
      });

      Switch.public({
        callback: FuncG([], AsyncFunctionT)
      }, {
        default: function() {
          var fn, handleRequest, onFinished, self;
          fn = this.constructor.compose(this.middlewares, this.handlers);
          self = this;
          onFinished = require('on-finished');
          handleRequest = co.wrap(function*(req, res) {
            var DEBUG, ERROR, LEVELS, SEND_TO_LOG, err, reqLength, resLength, t1, time, voContext;
            t1 = Date.now();
            ({ERROR, DEBUG, LEVELS, SEND_TO_LOG} = Module.prototype.LogMessage);
            self.sendNotification(SEND_TO_LOG, '>>>>>> START REQUEST HANDLING', LEVELS[DEBUG]);
            res.statusCode = 404;
            voContext = Context.new(req, res, self);
            try {
              yield fn(voContext);
              self.respond(voContext);
            } catch (error1) {
              err = error1;
              voContext.onerror(err);
            }
            onFinished(res, function(err) {
              voContext.onerror(err);
            });
            self.sendNotification(SEND_TO_LOG, '>>>>>> END REQUEST HANDLING', LEVELS[DEBUG]);
            reqLength = voContext.request.length;
            resLength = voContext.response.length;
            time = Date.now() - t1;
            yield self.handleStatistics(reqLength, resLength, time, voContext);
          });
          return handleRequest;
        }
      });

      // NOTE: пустая функция, которую вызываем из callback и передаем в нее длину реквеста, длину респонза, время выполнения, и контекст, чтобы потом в отдельном миксине можно было определить тело этого метода, т.е. как реализовывать сохранение (реагировать) этой статистики.
      Switch.public(Switch.async({
        handleStatistics: FuncG([Number, Number, Number, ContextInterface])
      }, {
        default: function*(reqLength, resLength, time, aoContext) {
          var DEBUG, LEVELS, SEND_TO_LOG;
          ({DEBUG, LEVELS, SEND_TO_LOG} = Module.prototype.LogMessage);
          this.sendNotification(SEND_TO_LOG, `REQUEST LENGTH ${reqLength} byte RESPONSE LENGTH ${resLength} byte HANDLED BY ${time} ms`, LEVELS[DEBUG]);
        }
      }));

      // Default error handler
      Switch.public({
        onerror: FuncG(Error)
      }, {
        default: function(err) {
          var DEBUG, ERROR, LEVELS, SEND_TO_LOG, assert, msg, ref;
          assert = require('assert');
          assert(_.isError(err), `non-error thrown: ${err}`);
          if (404 === err.status || err.expose) {
            return;
          }
          if (this.configs.silent) {
            return;
          }
          msg = (ref = err.stack) != null ? ref : String(err);
          ({ERROR, DEBUG, LEVELS, SEND_TO_LOG} = Module.prototype.LogMessage);
          this.sendNotification(SEND_TO_LOG, msg.replace(/^/gm, '  '), LEVELS[ERROR]);
        }
      });

      Switch.public({
        respond: FuncG(ContextInterface)
      }, {
        default: function(ctx) {
          var body, code, ref;
          if (ctx.respond === false) {
            return;
          }
          if (!ctx.writable) {
            return;
          }
          body = ctx.body;
          code = ctx.status;
          if (statuses.empty[code]) {
            ctx.body = null;
            ctx.res.end();
            return;
          }
          if ('HEAD' === ctx.method) {
            if (!ctx.res.headersSent && _.isObjectLike(body)) {
              ctx.length = Buffer.byteLength(JSON.stringify(body));
            }
            ctx.res.end();
            return;
          }
          if (body == null) {
            body = (ref = ctx.message) != null ? ref : String(code);
            if (!ctx.res.headersSent) {
              ctx.type = 'text';
              ctx.length = Buffer.byteLength(body);
            }
            ctx.res.end(body);
            return;
          }
          if (_.isBuffer(body) || _.isString(body)) {
            ctx.res.end(body);
            return;
          }
          if (body instanceof require('stream')) {
            body.pipe(ctx.res);
            return;
          }
          body = JSON.stringify(body != null ? body : null);
          if (!ctx.res.headersSent) {
            ctx.length = Buffer.byteLength(body);
          }
          ctx.res.end(body);
        }
      });

      Switch.public({
        rendererFor: FuncG(String, RendererInterface)
      }, {
        default: function(asFormat) {
          var base;
          if (this[ipoRenderers] == null) {
            this[ipoRenderers] = {};
          }
          if ((base = this[ipoRenderers])[asFormat] == null) {
            base[asFormat] = ((asFormat) => {
              var voRenderer;
              voRenderer = this[`${asFormat}RendererName`] != null ? this.facade.retrieveProxy(this[`${asFormat}RendererName`]) : void 0;
              if (voRenderer == null) {
                voRenderer = Renderer.new();
              }
              return voRenderer;
            })(asFormat);
          }
          return this[ipoRenderers][asFormat];
        }
      });

      Switch.public(Switch.async({
        sendHttpResponse: FuncG([
          ContextInterface,
          MaybeG(AnyT),
          ResourceInterface,
          InterfaceG({
            method: String,
            path: String,
            resource: String,
            action: String,
            tag: String,
            template: String,
            keyName: MaybeG(String),
            entityName: String,
            recordName: MaybeG(String)
          })
        ])
      }, {
        default: function*(ctx, aoData, resource, opts) {
          var ref, voRendered, voRenderer, vsFormat;
          if (opts.action === 'create') {
            ctx.status = 201;
          }
          // unless ctx.headers?.accept?
          //   yield return
          // switch (vsFormat = ctx.accepts @responseFormats)
          //   when no
          //   else
          //     if @["#{vsFormat}RendererName"]?
          //       voRenderer = @rendererFor vsFormat
          //       voRendered = yield voRenderer
          //         .render ctx, aoData, resource, opts
          //       ctx.body = voRendered
          // yield return
          if (((ref = ctx.headers) != null ? ref.accept : void 0) != null) {
            switch ((vsFormat = ctx.accepts(this.responseFormats))) {
              case false:
                break;
              default:
                if (this[`${vsFormat}RendererName`] != null) {
                  voRenderer = this.rendererFor(vsFormat);
                }
            }
          } else {
            if (this[`${this.defaultRenderer}RendererName`] != null) {
              voRenderer = this.rendererFor(this.defaultRenderer);
            }
          }
          if (voRenderer != null) {
            voRendered = (yield voRenderer.render(ctx, aoData, resource, opts));
            ctx.body = voRendered;
          }
        }
      }));

      Switch.public({
        defineRoutes: Function
      }, {
        default: function() {
          var ref, voRouter;
          voRouter = this.facade.retrieveProxy((ref = this.routerName) != null ? ref : APPLICATION_ROUTER);
          voRouter.routes.forEach((aoRoute) => {
            return this.createNativeRoute(aoRoute);
          });
        }
      });

      Switch.public({
        sender: FuncG([
          String,
          StructG({
            context: ContextInterface,
            reverse: String
          }),
          InterfaceG({
            method: String,
            path: String,
            resource: String,
            action: String,
            tag: String,
            template: String,
            keyName: MaybeG(String),
            entityName: String,
            recordName: MaybeG(String)
          })
        ])
      }, {
        default: function(resourceName, aoMessage, {method, path, resource, action}) {
          this.sendNotification(resourceName, aoMessage, action);
        }
      });

      // @public defineSwaggerEndpoint: Function,
      //   default: (aoSwaggerEndpoint, resourceName, action)->
      //     voGateway = @facade.retrieveProxy "#{resourceName}Gateway"
      //     {
      //       tags
      //       headers
      //       pathParams
      //       queryParams
      //       payload
      //       responses
      //       errors
      //       title
      //       synopsis
      //       isDeprecated
      //     } = voGateway.swaggerDefinitionFor action
      //     tags?.forEach (tag)->
      //       aoSwaggerEndpoint.tag tag
      //     headers?.forEach ({name, schema, description})->
      //       aoSwaggerEndpoint.header name, schema, description
      //     pathParams?.forEach ({name, schema, description})->
      //       aoSwaggerEndpoint.pathParam name, schema, description
      //     queryParams?.forEach ({name, schema, description})->
      //       aoSwaggerEndpoint.queryParam name, schema, description
      //     if payload?
      //       aoSwaggerEndpoint.body payload.schema, payload.mimes, payload.description
      //     responses?.forEach ({status, schema, mimes, description})->
      //       aoSwaggerEndpoint.response status, schema, mimes, description
      //     errors?.forEach ({status, description})->
      //       aoSwaggerEndpoint.error status, description
      //     aoSwaggerEndpoint.summary title            if title?
      //     aoSwaggerEndpoint.description synopsis     if synopsis?
      //     aoSwaggerEndpoint.deprecated isDeprecated  if isDeprecated?
      //     return
      Switch.public({
        createNativeRoute: FuncG([
          InterfaceG({
            method: String,
            path: String,
            resource: String,
            action: String,
            tag: String,
            template: String,
            keyName: MaybeG(String),
            entityName: String,
            recordName: MaybeG(String)
          })
        ])
      }, {
        default: function(opts) {
          var method, path, resourceName, self;
          ({method, path} = opts);
          resourceName = inflect.camelize(inflect.underscore(`${opts.resource.replace(/[\/]/g, '_')}Resource`));
          self = this;
          if (typeof this[method] === "function") {
            this[method](path, co.wrap(function*(context) {
              yield Module.prototype.Promise.new(function(resolve, reject) {
                var err, reverse;
                try {
                  reverse = genRandomAlphaNumbers(32);
                  self.getViewComponent().once(reverse, co.wrap(function*({error, result, resource}) {
                    var err;
                    if (error != null) {
                      console.log('>>>>>> ERROR AFTER RESOURCE', error);
                      reject(error);
                      return;
                    }
                    try {
                      yield self.sendHttpResponse(context, result, resource, opts);
                      resolve();
                    } catch (error1) {
                      err = error1;
                      reject(err);
                    }
                  }));
                  self.sender(resourceName, {context, reverse}, opts);
                } catch (error1) {
                  err = error1;
                  reject(err);
                }
              });
              return true;
            }));
          }
        }
      });

      Switch.public({
        init: FuncG([MaybeG(String), MaybeG(AnyT)])
      }, {
        default: function(...args) {
          this.super(...args);
          this[ipoRenderers] = {};
          this.middlewares = [];
          this.handlers = [];
        }
      });

      Switch.initialize();

      return Switch;

    }).call(this);
  };

}).call(this);
