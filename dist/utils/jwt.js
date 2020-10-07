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

  // Algorithms supported
  // HS256 |-> HMAC using SHA-256 hash algorithm
  // HS384 |-> HMAC using SHA-384 hash algorithm
  // HS512 |-> HMAC using SHA-512 hash algorithm
  // RS256 |-> RSASSA using SHA-256 hash algorithm
  // RS384 |-> RSASSA using SHA-384 hash algorithm
  // RS512 |-> RSASSA using SHA-512 hash algorithm
  // ES256 |-> ECDSA using P-256 curve and SHA-256 hash algorithm
  // ES384 |-> ECDSA using P-384 curve and SHA-384 hash algorithm
  // ES512 |-> ECDSA using P-521 curve and SHA-512 hash algorithm
  module.exports = function(Module) {
    var AnyT, AsyncFuncG, MaybeG, co;
    ({
      AnyT,
      AsyncFuncG,
      MaybeG,
      Utils: {co}
    } = Module.prototype);
    Module.util({
      jwtDecode: AsyncFuncG([String, String, MaybeG(Boolean)], AnyT)(co.wrap(function*(asKey, asToken, abNoVerify = false) {
        var hasNativePromise, isArangoDB;
        ({isArangoDB, hasNativePromise} = Module.prototype.Utils);
        return (yield Module.prototype.Promise.new(function(resolve, reject) {
          var crypto, decoded, e, jwt;
          if (isArangoDB() || !hasNativePromise()) {
            try {
              // Is ArangoDB !!!
              crypto = require('@arangodb/crypto');
              decoded = crypto.jwtDecode(asKey, asToken, abNoVerify);
            } catch (error) {
              e = error;
              return reject(e);
            }
            resolve(decoded);
          } else {
            try {
              // Is Node.js !!!
              jwt = require('jsonwebtoken');
              decoded = abNoVerify ? jwt.decode(asToken) : jwt.verify(asToken, asKey);
            } catch (error) {
              e = error;
              return reject(e);
            }
            resolve(decoded);
          }
        }));
      }))
    });
    return Module.util({
      jwtEncode: AsyncFuncG([String, AnyT, String], String)(co.wrap(function*(asKey, asMessage, asAlgorithm) {
        var hasNativePromise, isArangoDB;
        ({isArangoDB, hasNativePromise} = Module.prototype.Utils);
        return (yield Module.prototype.Promise.new(function(resolve, reject) {
          var crypto, e, encoded, jwt;
          if (isArangoDB() || !hasNativePromise()) {
            try {
              // Is ArangoDB !!!
              crypto = require('@arangodb/crypto');
              encoded = crypto.jwtEncode(asKey, asMessage, asAlgorithm);
            } catch (error) {
              e = error;
              return reject(e);
            }
            resolve(encoded);
          } else {
            try {
              // Is Node.js !!!
              jwt = require('jsonwebtoken');
              encoded = jwt.sign(asMessage, asKey, {
                algorithm: asAlgorithm
              });
            } catch (error) {
              e = error;
              return reject(e);
            }
            resolve(encoded);
          }
        }));
      }))
    });
  };

}).call(this);
