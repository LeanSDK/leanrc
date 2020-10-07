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
    var AnyT, FuncG, Interface, MaybeG, PipeMessageInterface;
    ({AnyT, FuncG, MaybeG, Interface} = Module.prototype);
    return PipeMessageInterface = (function() {
      class PipeMessageInterface extends Interface {};

      PipeMessageInterface.inheritProtected();

      PipeMessageInterface.module(Module);

      PipeMessageInterface.virtual({
        getType: FuncG([], String)
      });

      PipeMessageInterface.virtual({
        setType: FuncG(String)
      });

      PipeMessageInterface.virtual({
        getPriority: FuncG([], Number)
      });

      PipeMessageInterface.virtual({
        setPriority: FuncG(Number)
      });

      PipeMessageInterface.virtual({
        getHeader: FuncG([], MaybeG(Object))
      });

      PipeMessageInterface.virtual({
        setHeader: FuncG(Object)
      });

      PipeMessageInterface.virtual({
        getBody: FuncG([], MaybeG(AnyT))
      });

      PipeMessageInterface.virtual({
        setBody: FuncG([MaybeG(AnyT)])
      });

      PipeMessageInterface.initialize();

      return PipeMessageInterface;

    }).call(this);
  };

}).call(this);
