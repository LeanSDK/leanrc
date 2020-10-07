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

  // net         = require 'net' # will be used only 'isIP' function
  // contentType = require 'content-type'
  // stringify   = require('url').format
  // parse       = require 'parseurl'
  // qs          = require 'querystring'
  // typeis      = require 'type-is'
  // fresh       = require 'fresh'
  /*
  Идеи взяты из https://github.com/koajs/koa/blob/master/lib/request.js
  */
  module.exports = function(Module) {
    var AnyT, ContextInterface, CoreObject, FuncG, MaybeG, NilT, Request, RequestInterface, SwitchInterface, UnionG, _;
    ({
      AnyT,
      NilT,
      FuncG,
      UnionG,
      MaybeG,
      RequestInterface,
      SwitchInterface,
      ContextInterface,
      CoreObject,
      Utils: {_}
    } = Module.prototype);
    return Request = (function() {
      class Request extends CoreObject {};

      Request.inheritProtected();

      Request.implements(RequestInterface);

      Request.module(Module);

      Request.public({
        req: Object // native request object
      }, {
        get: function() {
          return this.ctx.req;
        }
      });

      Request.public({
        switch: SwitchInterface
      }, {
        get: function() {
          return this.ctx.switch;
        }
      });

      Request.public({
        ctx: ContextInterface
      });

      // @public baseUrl: String # под вопросом?
      // @public database: String # возможно это тоже надо получать из метода из отдельного модуля
      // @public pathname: String
      // @public pathParams: Object # вынести в отдельный модуль, который будет подключаться как миксин, а в чейнинге будет вызваться метод, который будет распарсивать парамсы
      // @public cookie: Function,
      //   default: (name, options)->
      Request.public({
        body: MaybeG(AnyT) // тело должен предоставлять миксин из отдельного модуля
      });

      Request.public({
        header: Object
      }, {
        get: function() {
          return this.headers;
        }
      });

      Request.public({
        headers: Object
      }, {
        get: function() {
          return this.req.headers;
        }
      });

      Request.public({
        originalUrl: String
      }, {
        get: function() {
          return this.ctx.originalUrl;
        }
      });

      Request.public({
        url: String
      }, {
        get: function() {
          return this.req.url;
        },
        set: function(url) {
          return this.req.url = url;
        }
      });

      Request.public({
        origin: String
      }, {
        get: function() {
          return `${this.protocol}://${this.host}`;
        }
      });

      Request.public({
        href: String
      }, {
        get: function() {
          if (/^https?:\/\//i.test(this.originalUrl)) {
            return this.originalUrl;
          }
          return this.origin + this.originalUrl;
        }
      });

      Request.public({
        method: String
      }, {
        get: function() {
          return this.req.method;
        },
        set: function(method) {
          return this.req.method = method;
        }
      });

      Request.public({
        path: String
      }, {
        get: function() {
          var parse;
          parse = require('parseurl');
          return parse(this.req).pathname;
        },
        set: function(path) {
          var parse, stringify, url;
          parse = require('parseurl');
          url = parse(this.req);
          if (url.pathname === path) {
            return;
          }
          url.pathname = path;
          url.path = null;
          stringify = require('url').format;
          return this.url = stringify(url);
        }
      });

      Request.public({
        query: Object
      }, {
        get: function() {
          var qs;
          qs = require('querystring');
          return qs.parse(this.querystring);
        },
        set: function(obj) {
          var qs;
          qs = require('querystring');
          this.querystring = qs.stringify(obj);
          return obj;
        }
      });

      Request.public({
        querystring: String
      }, {
        get: function() {
          var parse, ref;
          if (this.req == null) {
            return '';
          }
          parse = require('parseurl');
          return (ref = parse(this.req).query) != null ? ref : '';
        },
        set: function(str) {
          var parse, stringify, url;
          parse = require('parseurl');
          url = parse(this.req);
          if (url.search === `?${str}`) {
            return;
          }
          url.search = str;
          url.path = null;
          stringify = require('url').format;
          return this.url = stringify(url);
        }
      });

      Request.public({
        search: String
      }, {
        get: function() {
          if (!this.querystring) {
            return '';
          }
          return `?${this.querystring}`;
        },
        set: function(str) {
          return this.querystring = str;
        }
      });

      Request.public({
        host: String
      }, {
        get: function() {
          var host, trustProxy;
          ({trustProxy} = this.ctx.switch.configs);
          host = trustProxy && this.get('X-Forwarded-Host');
          host = host || this.get('Host');
          if (!host) {
            return '';
          }
          return host.split(/\s*,\s*/)[0];
        }
      });

      // port отсутствует в интерфейсе koa - возможно лучше его и здесь не делать, чтобы не ломать интерфейс koa
      // @public port: Number,
      //   get: ->
      //     host = @host
      //     port = if host
      //       host.split(':')[1]
      //     unless port
      //       port = if @protocol is 'https'
      //         443
      //       else
      //         80
      //     Number port
      Request.public({
        hostname: String
      }, {
        get: function() {
          var host;
          host = this.host;
          if (!host) {
            return '';
          }
          return host.split(':')[0];
        }
      });

      Request.public({
        fresh: Boolean
      }, {
        get: function() {
          var fresh, method, s;
          method = this.method;
          s = this.ctx.status;
          // GET or HEAD for weak freshness validation only
          if ('GET' !== method && 'HEAD' !== method) {
            return false;
          }
          // 2xx or 304 as per rfc2616 14.26
          if ((s >= 200 && s < 300) || 304 === s) {
            fresh = require('fresh');
            return fresh(this.headers, this.ctx.response.headers);
          }
          return false;
        }
      });

      Request.public({
        stale: Boolean
      }, {
        get: function() {
          return !this.fresh;
        }
      });

      Request.public({
        idempotent: Boolean
      }, {
        get: function() {
          var methods;
          methods = ['GET', 'HEAD', 'PUT', 'DELETE', 'OPTIONS', 'TRACE'];
          return _.includes(methods, this.method);
        }
      });

      Request.public({
        socket: MaybeG(Object)
      }, {
        get: function() {
          return this.req.socket;
        }
      });

      Request.public({
        charset: String
      }, {
        get: function() {
          var contentType, err, ref, type;
          type = this.get('Content-Type');
          if (type == null) {
            return '';
          }
          try {
            contentType = require('content-type');
            type = contentType.parse(type);
          } catch (error) {
            err = error;
            return '';
          }
          return (ref = type.parameters.charset) != null ? ref : '';
        }
      });

      Request.public({
        length: Number
      }, {
        get: function() {
          var contentLength;
          if ((contentLength = this.get('Content-Length')) != null) {
            if (contentLength === '') {
              return 0;
            }
            return ~~Number(contentLength);
          } else {
            return 0;
          }
        }
      });

      Request.public({
        protocol: String
      }, {
        get: function() {
          var proto, ref, trustProxy;
          ({trustProxy} = this.ctx.switch.configs);
          if ((ref = this.socket) != null ? ref.encrypted : void 0) {
            return 'https';
          }
          if (this.req.secure) {
            return 'https';
          }
          if (!trustProxy) {
            return 'http';
          }
          proto = this.get('X-Forwarded-Proto');
          if (!proto) {
            proto = 'http';
          }
          return proto.split(/\s*,\s*/)[0];
        }
      });

      // xhr отсутствует в интерфейсе koa - возможно лучше его и здесь не делать, чтобы не ломать интерфейс koa
      // @public xhr: Boolean,
      //   get: ->
      //     'xmlhttprequest' is String(@headers['X-Requested-With']).toLowerCase()
      Request.public({
        secure: Boolean
      }, {
        get: function() {
          return this.protocol === 'https';
        }
      });

      Request.public({
        ip: String
      });

      Request.public({
        ips: Array
      }, {
        get: function() {
          var trustProxy, value;
          ({trustProxy} = this.ctx.switch.configs);
          value = this.get('X-Forwarded-For');
          if (trustProxy && value) {
            return value.split(/\s*,\s*/);
          } else {
            return [];
          }
        }
      });

      Request.public({
        subdomains: Array
      }, {
        get: function() {
          var hostname, net, offset;
          ({
            subdomainOffset: offset
          } = this.ctx.switch.configs);
          hostname = this.hostname;
          net = require('net');
          if (net.isIP(hostname) !== 0) {
            return [];
          }
          return hostname.split('.').reverse().slice(offset != null ? offset : 0);
        }
      });

      Request.public({
        accepts: FuncG([MaybeG(UnionG(String, Array))], UnionG(String, Array, Boolean))
      }, {
        default: function(...args) {
          return this.ctx.accept.types(...args);
        }
      });

      Request.public({
        acceptsCharsets: FuncG([MaybeG(UnionG(String, Array))], UnionG(String, Array))
      }, {
        default: function(...args) {
          return this.ctx.accept.charsets(...args);
        }
      });

      Request.public({
        acceptsEncodings: FuncG([MaybeG(UnionG(String, Array))], UnionG(String, Array))
      }, {
        default: function(...args) {
          return this.ctx.accept.encodings(...args);
        }
      });

      Request.public({
        acceptsLanguages: FuncG([MaybeG(UnionG(String, Array))], UnionG(String, Array))
      }, {
        default: function(...args) {
          return this.ctx.accept.languages(...args);
        }
      });

      Request.public({
        'is': FuncG([UnionG(String, Array)], UnionG(String, Boolean, NilT))
      }, {
        default: function(...args) {
          var typeis, types;
          [types] = args;
          typeis = require('type-is');
          if (!types) {
            return typeis(this.req);
          }
          if (!_.isArray(types)) {
            types = args;
          }
          return typeis(this.req, types);
        }
      });

      Request.public({
        type: String
      }, {
        get: function() {
          var type;
          type = this.get('Content-Type');
          if (type == null) {
            return '';
          }
          return type.split(';')[0];
        }
      });

      Request.public({
        get: FuncG(String, String)
      }, {
        default: function(field) { //@headers[name]
          var ref, ref1, ref2, req;
          req = this.req;
          switch (field = field.toLowerCase()) {
            case 'referer':
            case 'referrer':
              return (ref = (ref1 = req.headers.referrer) != null ? ref1 : req.headers.referer) != null ? ref : '';
            default:
              return (ref2 = req.headers[field]) != null ? ref2 : '';
          }
        }
      });

      // @public inspect: FuncG([], Object),
      //   default: ->
      //     return unless @req
      //     @toJSON()

      // @public toJSON: FuncG([], Object),
      //   default: -> _.pick @, ['method', 'url', 'header']
      Request.public(Request.static(Request.async({
        restoreObject: Function
      }, {
        default: function*() {
          throw new Error(`restoreObject method not supported for ${this.name}`);
        }
      })));

      Request.public(Request.static(Request.async({
        replicateObject: Function
      }, {
        default: function*() {
          throw new Error(`replicateObject method not supported for ${this.name}`);
        }
      })));

      Request.public({
        init: FuncG(ContextInterface)
      }, {
        default: function(context) {
          var ref, ref1, ref2, ref3;
          this.super();
          this.ctx = context;
          this.ip = (ref = (ref1 = (ref2 = this.ips[0]) != null ? ref2 : (ref3 = this.req.socket) != null ? ref3.remoteAddress : void 0) != null ? ref1 : this.req.remoteAddress) != null ? ref : '';
        }
      });

      Request.initialize();

      return Request;

    }).call(this);
  };

}).call(this);
