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
    var AnyT, FuncG, Interface, IterableInterface;
    ({AnyT, FuncG, Interface} = Module.prototype);
    return IterableInterface = (function() {
      class IterableInterface extends Interface {};

      IterableInterface.inheritProtected();

      IterableInterface.module(Module);

      IterableInterface.virtual(IterableInterface.async({
        forEach: FuncG(Function)
      }));

      IterableInterface.virtual(IterableInterface.async({
        filter: FuncG(Function, Array)
      }));

      IterableInterface.virtual(IterableInterface.async({
        map: FuncG(Function, Array)
      }));

      IterableInterface.virtual(IterableInterface.async({
        reduce: FuncG([Function, AnyT], AnyT)
      }));

      IterableInterface.initialize();

      return IterableInterface;

    }).call(this);
  };

}).call(this);
