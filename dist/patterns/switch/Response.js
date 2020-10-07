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

  // contentDisposition  = require 'content-disposition'
  // ensureErrorHandler  = require 'error-inject'
  // getType             = require('mime-types').contentType
  // onFinish            = require 'on-finished'
  // escape              = require 'escape-html'
  // typeis              = require('type-is').is
  // destroy             = require 'destroy'
  // assert              = require 'assert'
  // extname             = require('path').extname
  // vary                = require 'vary'
  // Stream              = require 'stream'
  /*
  Идеи взяты из https://github.com/koajs/koa/blob/master/lib/response.js
  */
  var Stream,
    hasProp = {}.hasOwnProperty;

  Stream = require('stream');

  module.exports = function(Module) {
    var AnyT, ContextInterface, CoreObject, FuncG, MaybeG, NilT, Response, ResponseInterface, SwitchInterface, UnionG, _, statuses;
    ({
      AnyT,
      NilT,
      FuncG,
      UnionG,
      MaybeG,
      ResponseInterface,
      SwitchInterface,
      ContextInterface,
      CoreObject,
      Utils: {_, statuses}
    } = Module.prototype);
    return Response = (function() {
      class Response extends CoreObject {};

      Response.inheritProtected();

      Response.implements(ResponseInterface);

      Response.module(Module);

      Response.public({
        res: Object // native response object
      }, {
        get: function() {
          return this.ctx.res;
        }
      });

      Response.public({
        switch: SwitchInterface
      }, {
        get: function() {
          return this.ctx.switch;
        }
      });

      Response.public({
        ctx: ContextInterface
      });

      Response.public({
        socket: MaybeG(Object)
      }, {
        get: function() {
          return this.ctx.req.socket;
        }
      });

      Response.public({
        header: Object
      }, {
        get: function() {
          return this.headers;
        }
      });

      Response.public({
        headers: Object
      }, {
        get: function() {
          var ref;
          if (_.isFunction(this.res.getHeaders)) {
            return this.res.getHeaders();
          } else {
            return (ref = this.res._headers) != null ? ref : {};
          }
        }
      });

      Response.public({
        status: MaybeG(Number)
      }, {
        get: function() {
          return this.res.statusCode;
        },
        set: function(code) {
          var assert;
          assert = require('assert');
          assert(_.isNumber(code), 'status code must be a number');
          assert(statuses[code], `invalid status code: ${code}`);
          assert(!this.res.headersSent, 'headers have already been sent');
          this._explicitStatus = true;
          this.res.statusCode = code;
          this.res.statusMessage = statuses[code];
          if (Boolean(this.body && statuses.empty[code])) {
            this.body = null;
          }
          return code;
        }
      });

      Response.public({
        message: String
      }, {
        get: function() {
          var ref;
          return (ref = this.res.statusMessage) != null ? ref : statuses[this.status];
        },
        set: function(msg) {
          this.res.statusMessage = msg;
          return msg;
        }
      });

      Response.public({
        body: MaybeG(UnionG(String, Buffer, Object, Array, Number, Boolean, Stream))
      }, {
        get: function() {
          return this._body;
        },
        set: function(val) {
          var destroy, ensureErrorHandler, onFinish, original, setType;
          original = this._body;
          this._body = val;
          if (this.res.headersSent) {
            return;
          }
          if (val == null) {
            if (!statuses.empty[this.status]) {
              this.status = 204;
            }
            this.remove('Content-Type');
            this.remove('Content-Length');
            this.remove('Transfer-Encoding');
            return;
          }
          if (!this._explicitStatus) {
            this.status = 200;
          }
          setType = !this.headers['content-type'];
          if (_.isString(val)) {
            if (setType) {
              this.type = /^\s*</.test(val) ? 'html' : 'text';
            }
            this.length = Buffer.byteLength(val);
            return;
          }
          if (_.isBuffer(val)) {
            if (setType) {
              this.type = 'bin';
            }
            this.length = val.length;
            return;
          }
          if (_.isFunction(val.pipe)) {
            onFinish = require('on-finished');
            destroy = require('destroy');
            onFinish(this.res, destroy.bind(null, val));
            ensureErrorHandler = require('error-inject');
            ensureErrorHandler(val, (err) => {
              return this.ctx.onerror(err);
            });
            if ((original != null) && original !== val) {
              this.remove('Content-Length');
            }
            if (setType) {
              this.type = 'bin';
            }
            return;
          }
          this.remove('Content-Length');
          this.type = 'json';
          return val;
        }
      });

      // @public body: [String, Buffer]
      // @public locals: Object
      // @public headers: Object
      // @public statusCode: Number

      // @public cookie: Function,
      //   default: (name, value, options = null)->

      // @public download: Function,
      //   default: (path, filename)->

      // @public json: Function,
      //   default: (data)->

      // @public removeHeader: Function,
      //   default: (name)->

      // @public send: Function,
      //   args: [[Buffer, String, Object, Array, Number, Boolean]]
      //   default: (data)->

      // @public sendFile: Function,
      //   default: (path, options = null)->

      // @public sendStatus: Function,
      //   default: (status)->

      // @public throw: Function,
      //   return: NILL
      //   default: (status, reason, options = null)->

      // @public write: Function,
      //   args: [[String, Buffer]]
      //   default: (data)->
      Response.public({
        length: Number
      }, {
        get: function() {
          var len;
          len = this.headers['content-length'];
          if (len == null) {
            if (!this.body) {
              return 0;
            }
            if (_.isString(this.body)) {
              return Buffer.byteLength(this.body);
            }
            if (_.isBuffer(this.body)) {
              return this.body.length;
            }
            if (_.isObjectLike(this.body)) {
              return Buffer.byteLength(JSON.stringify(this.body));
            }
            return 0;
          }
          return ~~Number(len);
        },
        set: function(n) {
          this.set('Content-Length', n);
          return n;
        }
      });

      Response.public({
        headerSent: MaybeG(Boolean)
      }, {
        get: function() {
          return this.res.headersSent;
        }
      });

      Response.public({
        vary: FuncG(String)
      }, {
        default: function(field) {
          var vary;
          vary = require('vary');
          vary(this.res, field);
        }
      });

      Response.public({
        redirect: FuncG([String, MaybeG(String)])
      }, {
        default: function(url, alt) {
          var escape;
          if ('back' === url) {
            url = this.ctx.get('Referrer') || alt || '/';
          }
          this.set('Location', url);
          if (!statuses.redirect[this.status]) {
            this.status = 302;
          }
          if (this.ctx.accepts('html')) {
            escape = require('escape-html');
            url = escape(url);
            this.type = 'text/html; charset=utf-8';
            this.body = `Redirecting to <a href=\"${url}\">${url}</a>.`;
            return;
          }
          this.type = 'text/plain; charset=utf-8';
          this.body = `Redirecting to ${url}`;
        }
      });

      Response.public({
        attachment: FuncG(String)
      }, {
        default: function(filename) {
          var contentDisposition, extname;
          if (filename) {
            extname = require('path').extname;
            this.type = extname(filename);
          }
          contentDisposition = require('content-disposition');
          this.set('Content-Disposition', contentDisposition(filename));
        }
      });

      Response.public({
        lastModified: MaybeG(Date)
      }, {
        get: function() {
          var date;
          date = this.get('last-modified');
          if (date) {
            return new Date(date);
          }
        },
        set: function(val) {
          if (_.isString(val)) {
            val = new Date(val);
          }
          this.set('Last-Modified', val.toUTCString());
          return val;
        }
      });

      Response.public({
        etag: String
      }, {
        get: function() {
          return this.get('ETag');
        },
        set: function(val) {
          if (!/^(W\/)?"/.test(val)) {
            val = `\"${val}\"`;
          }
          this.set('ETag', val);
          return val;
        }
      });

      Response.public({
        type: MaybeG(String)
      }, {
        get: function() {
          var type;
          type = this.get('Content-Type');
          if (!type) {
            return '';
          }
          return type.split(';')[0];
        },
        set: function(_type) {
          var getType, type;
          getType = require('mime-types').contentType;
          type = getType(_type);
          if (type) {
            this.set('Content-Type', type);
          } else {
            this.remove('Content-Type');
          }
          return _type;
        }
      });

      Response.public({
        'is': FuncG([UnionG(String, Array)], UnionG(String, Boolean, NilT))
      }, {
        default: function(...args) {
          var typeis, types;
          [types] = args;
          if (!types) {
            return this.type || false;
          }
          if (!_.isArray(types)) {
            types = args;
          }
          typeis = require('type-is').is;
          return typeis(this.type, types);
        }
      });

      Response.public({
        get: FuncG(String, UnionG(String, Array))
      }, {
        default: function(field) {
          var ref;
          return (ref = this.headers[field.toLowerCase()]) != null ? ref : '';
        }
      });

      Response.public({
        set: FuncG([UnionG(String, Object), MaybeG(AnyT)])
      }, {
        default: function(...args) {
          var field, key, val, value;
          [field, val] = args;
          if (2 === args.length) {
            if (_.isArray(val)) {
              val = val.map(String);
            } else {
              val = String(val);
            }
            this.res.setHeader(field, val);
          } else {
            for (key in field) {
              if (!hasProp.call(field, key)) continue;
              value = field[key];
              this.set(key, value);
            }
          }
        }
      });

      Response.public({
        append: FuncG([String, UnionG(String, Array)])
      }, {
        default: function(field, val) {
          var prev;
          prev = this.get(field);
          if (prev) {
            if (_.isArray(prev)) {
              val = prev.concat(val);
            } else {
              val = [prev].concat(val);
            }
          }
          this.set(field, val);
        }
      });

      Response.public({
        remove: FuncG(String)
      }, {
        default: function(field) {
          this.res.removeHeader(field);
        }
      });

      Response.public({
        writable: Boolean
      }, {
        get: function() {
          var socket;
          if (this.res.finished) {
            return false;
          }
          socket = this.res.socket;
          if (!socket) {
            return true;
          }
          return socket.writable;
        }
      });

      Response.public({
        flushHeaders: Function
      }, {
        default: function() {
          var header, headerNames, i, len1;
          if (_.isFunction(this.res.flushHeaders)) {
            this.res.flushHeaders();
          } else {
            headerNames = _.isFunction(this.res.getHeaderNames) ? this.res.getHeaderNames() : Object.keys(this.res._headers);
            for (i = 0, len1 = headerNames.length; i < len1; i++) {
              header = headerNames[i];
              this.res.removeHeader(header);
            }
          }
        }
      });

      // @public inspect: FuncG([], Object),
      //   default: ->
      //     return unless @res
      //     o = @toJSON()
      //     o.body = @body
      //     o

      // @public toJSON: FuncG([], Object),
      //   default: -> _.pick @, ['status', 'message', 'header']
      Response.public(Response.static(Response.async({
        restoreObject: Function
      }, {
        default: function*() {
          throw new Error(`restoreObject method not supported for ${this.name}`);
        }
      })));

      Response.public(Response.static(Response.async({
        replicateObject: Function
      }, {
        default: function*() {
          throw new Error(`replicateObject method not supported for ${this.name}`);
        }
      })));

      Response.public({
        init: FuncG(ContextInterface)
      }, {
        default: function(context) {
          this.super();
          this.ctx = context;
        }
      });

      Response.initialize();

      return Response;

    }).call(this);
  };

}).call(this);
