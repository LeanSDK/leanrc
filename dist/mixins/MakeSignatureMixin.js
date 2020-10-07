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
    var AnyT, CoreObject, FuncG, Mixin, SubsetG, isArangoDB, jsonStringify;
    ({
      AnyT,
      FuncG,
      SubsetG,
      Mixin,
      CoreObject,
      Utils: {isArangoDB, jsonStringify}
    } = Module.prototype);
    return Module.defineMixin(Mixin('MakeSignatureMixin', FuncG(SubsetG(CoreObject))(function(BaseClass) {
      return (function() {
        var _Class;

        _Class = class extends BaseClass {};

        _Class.inheritProtected();

        _Class.public(_Class.async({
          makeSignature: FuncG([String, String, AnyT], String)
        }, {
          default: function*(algorithm, secret, attributes) {
            var crypto, str;
            str = jsonStringify(attributes);
            if (isArangoDB()) {
              crypto = require('@arangodb/crypto');
              return crypto.hmac(secret, str, algorithm);
            } else {
              crypto = require('crypto');
              return crypto.createHmac(algorithm, secret).update(str).digest('hex');
            }
          }
        }));

        _Class.public(_Class.async({
          makeHash: FuncG([String, AnyT], String)
        }, {
          default: function*(algorithm, data) {
            var crypto, str;
            str = jsonStringify(data);
            if (isArangoDB()) {
              crypto = require('@arangodb/crypto');
              return crypto[algorithm.toLowerCase()](str);
            } else {
              crypto = require('crypto');
              return crypto.createHash(algorithm).update(str).digest('hex');
            }
          }
        }));

        _Class.initializeMixin();

        return _Class;

      }).call(this);
    })));
  };

}).call(this);
