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
    var FuncG, Interface, MaybeG, NilT, RequestInterface, SwitchInterface, UnionG;
    ({NilT, FuncG, UnionG, MaybeG, SwitchInterface, Interface} = Module.prototype);
    return RequestInterface = (function() {
      class RequestInterface extends Interface {};

      RequestInterface.inheritProtected();

      RequestInterface.module(Module);

      RequestInterface.virtual({
        req: Object
      });

      RequestInterface.virtual({
        switch: SwitchInterface
      });

      // @virtual header: Object
      // @virtual headers: Object
      // @virtual method: String
      // @virtual url: String
      // @virtual originalUrl: String
      // @virtual origin: String
      // @virtual href: String
      // @virtual path: String
      // @virtual query: Object
      // @virtual querystring: String
      // @virtual host: String
      // @virtual hostname: String
      // @virtual fresh: Boolean
      // @virtual stale: Boolean
      // @virtual idempotent: Boolean
      // @virtual socket: MaybeG Object
      // @virtual charset: String
      // @virtual length: Number
      // @virtual protocol: String
      // @virtual secure: Boolean
      // @virtual ip: String
      // @virtual ips: Array
      // @virtual subdomains: Array
      RequestInterface.virtual({
        is: FuncG([UnionG(String, Array)], UnionG(String, Boolean, NilT))
      });

      RequestInterface.virtual({
        accepts: FuncG([MaybeG(UnionG(String, Array))], UnionG(String, Array, Boolean))
      });

      RequestInterface.virtual({
        acceptsEncodings: FuncG([MaybeG(UnionG(String, Array))], UnionG(String, Array))
      });

      RequestInterface.virtual({
        acceptsCharsets: FuncG([MaybeG(UnionG(String, Array))], UnionG(String, Array))
      });

      RequestInterface.virtual({
        acceptsLanguages: FuncG([MaybeG(UnionG(String, Array))], UnionG(String, Array))
      });

      // @virtual type: String
      RequestInterface.virtual({
        get: FuncG(String, String)
      });

      // # @virtual toJSON: FuncG [], Object
      // # @virtual inspect: FuncG [], Object
      RequestInterface.initialize();

      return RequestInterface;

    }).call(this);
  };

}).call(this);
