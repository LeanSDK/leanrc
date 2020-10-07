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
  module.exports = function(Module) {
    var AnyT, Cookies, CookiesInterface, CoreObject, FuncG, MaybeG, PointerT, StructG, isArangoDB;
    ({
      AnyT,
      PointerT,
      FuncG,
      MaybeG,
      StructG,
      CookiesInterface,
      CoreObject,
      Utils: {isArangoDB}
    } = Module.prototype);
    return Cookies = (function() {
      var ipoCookies;

      class Cookies extends CoreObject {};

      Cookies.inheritProtected();

      Cookies.implements(CookiesInterface);

      Cookies.module(Module);

      ipoCookies = PointerT(Cookies.protected({
        cookies: Object
      }));

      Cookies.public({
        request: Object
      });

      Cookies.public({
        response: Object
      });

      Cookies.public({
        key: String
      });

      Cookies.public({
        get: FuncG([String, MaybeG(Object)], MaybeG(String))
      }, {
        default: function(name, opts) {
          if (isArangoDB()) {
            if ((opts != null) && opts.signed) {
              return this.request.cookie(name, {
                secret: this.key,
                algorithm: 'sha256'
              });
            } else {
              return this.request.cookie(name);
            }
          } else {
            return this[ipoCookies].get(name, opts);
          }
        }
      });

      Cookies.public({
        set: FuncG([String, AnyT, MaybeG(Object)], CookiesInterface)
      }, {
        default: function(name, value, opts) {
          var _opts;
          if (isArangoDB()) {
            if (opts != null) {
              _opts = {};
              if (opts.maxAge != null) {
                _opts.ttl = opts.maxAge / 1000;
              }
              if (opts.path != null) {
                _opts.path = opts.path;
              }
              if (opts.domain != null) {
                _opts.domain = opts.domain;
              }
              if (opts.secure != null) {
                _opts.secure = opts.secure;
              }
              if (opts.httpOnly != null) {
                _opts.httpOnly = opts.httpOnly;
              }
              if (opts.signed) {
                _opts.secret = this.key;
                _opts.algorithm = 'sha256';
              }
              this.response.cookie(name, value, _opts);
            } else {
              this.response.cookie(name, value);
            }
          } else {
            this[ipoCookies].set(name, value, opts);
          }
          return this;
        }
      });

      Cookies.public(Cookies.static(Cookies.async({
        restoreObject: Function
      }, {
        default: function*() {
          throw new Error(`restoreObject method not supported for ${this.name}`);
        }
      })));

      Cookies.public(Cookies.static(Cookies.async({
        replicateObject: Function
      }, {
        default: function*() {
          throw new Error(`replicateObject method not supported for ${this.name}`);
        }
      })));

      Cookies.public({
        init: FuncG([
          Object,
          Object,
          MaybeG(StructG({
            key: MaybeG(String),
            secure: MaybeG(Boolean)
          }))
        ])
      }, {
        default: function(request, response, {key, secure} = {}) {
          var Keygrip, NodeCookies, keys;
          this.super();
          this.request = request;
          this.response = response;
          if (key == null) {
            key = 'secret';
          }
          if (secure == null) {
            secure = false;
          }
          this.key = key;
          if (!isArangoDB()) {
            Keygrip = require('keygrip');
            NodeCookies = require('cookies');
            keys = new Keygrip([key], 'sha256', 'hex');
            this[ipoCookies] = new NodeCookies(request, response, {keys, secure});
          }
        }
      });

      Cookies.initialize();

      return Cookies;

    }).call(this);
  };

}).call(this);
