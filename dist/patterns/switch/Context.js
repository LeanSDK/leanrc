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

  // accepts       = require 'accepts'
  // createError   = require 'http-errors'
  var Stream, assert;

  assert = require('assert');

  Stream = require('stream');

  /*
  Идеи взяты из https://github.com/koajs/koa/blob/master/lib/context.js
  */
  module.exports = function(Module) {
    var AnyT, Context, ContextInterface, Cookies, CookiesInterface, CoreObject, DEVELOPMENT, FuncG, MaybeG, NilT, Request, RequestInterface, Response, ResponseInterface, SwitchInterface, UnionG, _, statuses;
    ({
      DEVELOPMENT,
      AnyT,
      NilT,
      FuncG,
      UnionG,
      MaybeG,
      RequestInterface,
      ResponseInterface,
      SwitchInterface,
      CookiesInterface,
      ContextInterface,
      CoreObject,
      Request,
      Response,
      Cookies,
      Utils: {_, statuses}
    } = Module.prototype);
    return Context = (function() {
      class Context extends CoreObject {};

      Context.inheritProtected();

      Context.implements(ContextInterface);

      Context.module(Module);

      Context.public({
        req: Object // native request object
      });

      Context.public({
        res: Object // native response object
      });

      Context.public({
        request: MaybeG(RequestInterface)
      });

      Context.public({
        response: MaybeG(ResponseInterface)
      });

      Context.public({
        cookies: MaybeG(CookiesInterface)
      });

      Context.public({
        accept: Object
      });

      Context.public({
        state: MaybeG(Object)
      });

      Context.public({
        switch: SwitchInterface
      });

      Context.public({
        respond: MaybeG(Boolean)
      });

      Context.public({
        routePath: MaybeG(String)
      });

      Context.public({
        pathParams: MaybeG(Object)
      });

      Context.public({
        transaction: MaybeG(Object)
      });

      Context.public({
        session: MaybeG(Object)
      });

      // @public database: String # возможно это тоже надо получать из метода из отдельного модуля
      Context.public({
        throw: FuncG([UnionG(String, Number), MaybeG(String), MaybeG(Object)])
      }, {
        default: function(...args) {
          var createError;
          createError = require('http-errors');
          throw createError(...args);
        }
      });

      Context.public({
        assert: FuncG([AnyT, MaybeG(UnionG(String, Number)), MaybeG(String), MaybeG(Object)])
      }, {
        default: assert
      });

      Context.public({
        onerror: FuncG([MaybeG(AnyT)])
      }, {
        default: function(err) {
          var code, headerSent, message, msg, ref, ref1, ref2, ref3, res, vlHeaderNames;
          if (err == null) {
            return;
          }
          if (!_.isError(err)) {
            err = new Error(`non-error thrown: ${err}`);
          }
          headerSent = false;
          if (this.headerSent || !this.writable) {
            headerSent = err.headerSent = true;
          }
          this.switch.getViewComponent().emit('error', err, this);
          if (headerSent) {
            return;
          }
          ({res} = this);
          if (_.isFunction(res.getHeaderNames)) {
            res.getHeaderNames().forEach(function(name) {
              return res.removeHeader(name);
            });
          }
          if ((vlHeaderNames = Object.keys((ref = res.headers) != null ? ref : {})).length > 0) {
            vlHeaderNames.forEach(function(name) {
              return res.removeHeader(name);
            });
          }
          this.set((ref1 = err.headers) != null ? ref1 : {});
          this.type = 'text';
          if ('ENOENT' === err.code) {
            err.status = 404;
          }
          if (!_.isNumber(err.status) || !statuses[err.status]) {
            err.status = 500;
          }
          code = statuses[err.status];
          msg = err.expose ? err.message : code;
          message = {
            error: true,
            errorNum: err.status,
            errorMessage: msg,
            code: (ref2 = err.code) != null ? ref2 : code
          };
          if (this.switch.configs.environment === DEVELOPMENT) {
            message.exception = `${(ref3 = err.name) != null ? ref3 : 'Error'}: ${msg}`;
            message.stacktrace = err.stack.split('\n');
          }
          this.status = err.status;
          message = JSON.stringify(message);
          this.length = Buffer.byteLength(message);
          this.res.end(message);
        }
      });

      // Request aliases
      Context.public({
        header: Object
      }, {
        get: function() {
          return this.request.header;
        }
      });

      Context.public({
        headers: Object
      }, {
        get: function() {
          return this.request.headers;
        }
      });

      Context.public({
        method: String
      }, {
        get: function() {
          return this.request.method;
        },
        set: function(method) {
          return this.request.method = method;
        }
      });

      Context.public({
        url: String
      }, {
        get: function() {
          return this.request.url;
        },
        set: function(url) {
          return this.request.url = url;
        }
      });

      Context.public({
        originalUrl: String
      });

      Context.public({
        origin: String
      }, {
        get: function() {
          return this.request.origin;
        }
      });

      Context.public({
        href: String
      }, {
        get: function() {
          return this.request.href;
        }
      });

      Context.public({
        path: String
      }, {
        get: function() {
          return this.request.path;
        },
        set: function(path) {
          return this.request.path = path;
        }
      });

      Context.public({
        query: Object
      }, {
        get: function() {
          return this.request.query;
        },
        set: function(query) {
          return this.request.query = query;
        }
      });

      Context.public({
        querystring: String
      }, {
        get: function() {
          return this.request.querystring;
        },
        set: function(querystring) {
          return this.request.querystring = querystring;
        }
      });

      Context.public({
        host: String
      }, {
        get: function() {
          return this.request.host;
        }
      });

      Context.public({
        hostname: String
      }, {
        get: function() {
          return this.request.hostname;
        }
      });

      Context.public({
        fresh: Boolean
      }, {
        get: function() {
          return this.request.fresh;
        }
      });

      Context.public({
        stale: Boolean
      }, {
        get: function() {
          return this.request.stale;
        }
      });

      Context.public({
        socket: Object
      }, {
        get: function() {
          return this.request.socket;
        }
      });

      Context.public({
        protocol: String
      }, {
        get: function() {
          return this.request.protocol;
        }
      });

      Context.public({
        secure: Boolean
      }, {
        get: function() {
          return this.request.secure;
        }
      });

      Context.public({
        ip: String
      }, {
        get: function() {
          return this.request.ip;
        }
      });

      Context.public({
        ips: Array
      }, {
        get: function() {
          return this.request.ips;
        }
      });

      Context.public({
        subdomains: Array
      }, {
        get: function() {
          return this.request.subdomains;
        }
      });

      Context.public({
        'is': FuncG([UnionG(String, Array)], UnionG(String, Boolean, NilT))
      }, {
        default: function(...args) {
          return this.request.is(...args);
        }
      });

      Context.public({
        accepts: FuncG([MaybeG(UnionG(String, Array))], UnionG(String, Array, Boolean))
      }, {
        default: function(...args) {
          return this.request.accepts(...args);
        }
      });

      Context.public({
        acceptsEncodings: FuncG([MaybeG(UnionG(String, Array))], UnionG(String, Array))
      }, {
        default: function(...args) {
          return this.request.acceptsEncodings(...args);
        }
      });

      Context.public({
        acceptsCharsets: FuncG([MaybeG(UnionG(String, Array))], UnionG(String, Array))
      }, {
        default: function(...args) {
          return this.request.acceptsCharsets(...args);
        }
      });

      Context.public({
        acceptsLanguages: FuncG([MaybeG(UnionG(String, Array))], UnionG(String, Array))
      }, {
        default: function(...args) {
          return this.request.acceptsLanguages(...args);
        }
      });

      Context.public({
        get: FuncG(String, String)
      }, {
        default: function(...args) {
          return this.request.get(...args);
        }
      });

      // Response aliases
      Context.public({
        body: MaybeG(UnionG(String, Buffer, Object, Array, Number, Boolean, Stream))
      }, {
        get: function() {
          return this.response.body;
        },
        set: function(body) {
          return this.response.body = body;
        }
      });

      Context.public({
        status: MaybeG(Number)
      }, {
        get: function() {
          return this.response.status;
        },
        set: function(status) {
          return this.response.status = status;
        }
      });

      Context.public({
        message: String
      }, {
        get: function() {
          return this.response.message;
        },
        set: function(message) {
          return this.response.message = message;
        }
      });

      Context.public({
        length: Number
      }, {
        get: function() {
          return this.response.length;
        },
        set: function(length) {
          return this.response.length = length;
        }
      });

      Context.public({
        writable: Boolean
      }, {
        get: function() {
          return this.response.writable;
        }
      });

      Context.public({
        type: MaybeG(String)
      }, {
        get: function() {
          return this.response.type;
        },
        set: function(type) {
          return this.response.type = type;
        }
      });

      Context.public({
        headerSent: MaybeG(Boolean)
      }, {
        get: function() {
          return this.response.headerSent;
        }
      });

      Context.public({
        redirect: FuncG([String, MaybeG(String)])
      }, {
        default: function(...args) {
          return this.response.redirect(...args);
        }
      });

      Context.public({
        attachment: FuncG(String)
      }, {
        default: function(...args) {
          return this.response.attachment(...args);
        }
      });

      Context.public({
        set: FuncG([UnionG(String, Object), MaybeG(AnyT)])
      }, {
        default: function(...args) {
          return this.response.set(...args);
        }
      });

      Context.public({
        append: FuncG([String, UnionG(String, Array)])
      }, {
        default: function(...args) {
          return this.response.append(...args);
        }
      });

      Context.public({
        vary: FuncG(String)
      }, {
        default: function(...args) {
          return this.response.vary(...args);
        }
      });

      Context.public({
        flushHeaders: Function
      }, {
        default: function(...args) {
          return this.response.flushHeaders(...args);
        }
      });

      Context.public({
        remove: FuncG(String)
      }, {
        default: function(...args) {
          return this.response.remove(...args);
        }
      });

      Context.public({
        lastModified: MaybeG(Date)
      }, {
        set: function(date) {
          return this.response.lastModified = date;
        }
      });

      Context.public({
        etag: String
      }, {
        set: function(etag) {
          return this.response.etag = etag;
        }
      });

      // @public toJSON: Function,
      //   default: ->
      //     # request: @request.toJSON()
      //     # response: @response.toJSON()
      //     # app: @switch.constructor.NAME
      //     originalUrl: @originalUrl
      //     req: '<original req>'
      //     res: '<original res>'
      //     socket: '<original node socket or undefined>'

      // @public inspect: Function,
      //   default: -> @toJSON()
      Context.public(Context.static(Context.async({
        restoreObject: Function
      }, {
        default: function*() {
          throw new Error(`restoreObject method not supported for ${this.name}`);
        }
      })));

      Context.public(Context.static(Context.async({
        replicateObject: Function
      }, {
        default: function*() {
          throw new Error(`replicateObject method not supported for ${this.name}`);
        }
      })));

      Context.public({
        init: FuncG([Object, Object, SwitchInterface])
      }, {
        default: function(req, res, switchInstanse) {
          var accepts, key, secure;
          this.super();
          accepts = require('accepts');
          this.req = req;
          this.res = res;
          this.switch = switchInstanse;
          this.originalUrl = req.url;
          this.accept = accepts(req);
          this.request = Request.new(this);
          this.response = Response.new(this);
          key = this.switch.configs.cookieKey;
          secure = req.secure;
          this.cookies = Cookies.new(req, res, {key, secure});
          this.state = {};
        }
      });

      Context.initialize();

      return Context;

    }).call(this);
  };

}).call(this);
