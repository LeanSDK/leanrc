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
  var Stream;

  Stream = require('stream');

  module.exports = function(Module) {
    var AnyT, FuncG, Interface, MaybeG, NilT, ResponseInterface, SwitchInterface, UnionG;
    ({AnyT, NilT, FuncG, UnionG, MaybeG, SwitchInterface, Interface} = Module.prototype);
    return ResponseInterface = (function() {
      class ResponseInterface extends Interface {};

      ResponseInterface.inheritProtected();

      ResponseInterface.module(Module);

      ResponseInterface.virtual({
        res: Object
      });

      ResponseInterface.virtual({
        switch: SwitchInterface
      });

      // @virtual socket: Object
      // @virtual header: Object
      // @virtual headers: Object

      // @virtual status: MaybeG Number
      // @virtual message: String
      // @virtual body: MaybeG UnionG String, Buffer, Object, Array, Number, Boolean, Stream
      // @virtual length: Number
      // @virtual headerSent: MaybeG Boolean
      ResponseInterface.virtual({
        vary: FuncG(String)
      });

      ResponseInterface.virtual({
        redirect: FuncG([String, MaybeG(String)])
      });

      ResponseInterface.virtual({
        attachment: FuncG(String)
      });

      // @virtual lastModified: MaybeG Date
      // @virtual etag: String
      // @virtual type: MaybeG String
      ResponseInterface.virtual({
        is: FuncG([UnionG(String, Array)], UnionG(String, Boolean, NilT))
      });

      ResponseInterface.virtual({
        get: FuncG(String, UnionG(String, Array))
      });

      ResponseInterface.virtual({
        set: FuncG([UnionG(String, Object), MaybeG(AnyT)])
      });

      ResponseInterface.virtual({
        append: FuncG([String, UnionG(String, Array)])
      });

      ResponseInterface.virtual({
        remove: FuncG(String)
      });

      // @virtual writable: Boolean

      // @virtual toJSON: FuncG [], Object

      // @virtual inspect: FuncG [], Object
      ResponseInterface.initialize();

      return ResponseInterface;

    }).call(this);
  };

}).call(this);
