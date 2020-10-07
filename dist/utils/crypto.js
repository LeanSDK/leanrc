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
    var FuncG, MaybeG, StructG;
    ({FuncG, MaybeG, StructG} = Module.prototype);
    Module.util({
      genRandomAlphaNumbers: FuncG(Number, String)(function(length) {
        var crypto, isArangoDB;
        ({isArangoDB} = Module.prototype.Utils);
        crypto = isArangoDB() ? require('@arangodb/crypto') : require('crypto');
        if (isArangoDB()) {
          // Is ArangoDB !!!
          return crypto.genRandomAlphaNumbers(length);
        } else {
          // Is Node.js !!!
          return crypto.randomBytes(length).toString('hex');
        }
      })
    });
    Module.util({
      hashPassword: FuncG([
        String,
        MaybeG(StructG({
          hashMethod: MaybeG(String),
          saltLength: Number
        }))
      ], StructG({
        method: String,
        salt: String,
        hash: String
      }))(function(password, opts = {}) {
        var crypto, hash, hashMethod, isArangoDB, method, salt, saltLength;
        ({isArangoDB} = Module.prototype.Utils);
        ({hashMethod, saltLength} = opts);
        if (hashMethod == null) {
          hashMethod = 'sha256';
        }
        if (saltLength == null) {
          saltLength = 16;
        }
        method = hashMethod;
        crypto = isArangoDB() ? require('@arangodb/crypto') : require('crypto');
        if (isArangoDB()) {
          // Is ArangoDB !!!
          salt = crypto.genRandomAlphaNumbers(saltLength);
          hash = crypto[method](salt + password);
          return {method, salt, hash};
        } else {
          // Is Node.js !!!
          salt = crypto.randomBytes(saltLength).toString('hex');
          hash = crypto.createHash(method).update(salt + password).digest('hex');
          return {method, salt, hash};
        }
      })
    });
    return Module.util({
      verifyPassword: FuncG([
        StructG({
          method: String,
          salt: String,
          hash: String
        },
        String)
      ], Boolean)(function(authData, password) {
        var crypto, generatedHash, isArangoDB, method, ref, ref1, ref2, salt, storedHash;
        ({isArangoDB} = Module.prototype.Utils);
        method = (ref = authData.method) != null ? ref : 'sha256';
        salt = (ref1 = authData.salt) != null ? ref1 : '';
        storedHash = (ref2 = authData.hash) != null ? ref2 : '';
        crypto = isArangoDB() ? require('@arangodb/crypto') : require('crypto');
        if (isArangoDB()) {
          // Is ArangoDB !!!
          generatedHash = crypto[method](salt + password);
          return crypto.constantEquals(storedHash, generatedHash);
        } else {
          // Is Node.js !!!
          generatedHash = crypto.createHash(method).update(salt + password).digest('hex');
          return storedHash === generatedHash;
        }
      })
    });
  };

}).call(this);
