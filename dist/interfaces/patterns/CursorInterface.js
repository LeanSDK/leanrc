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
    var AnyT, CollectionInterface, CursorInterface, CursorInterfaceDef, FuncG, Interface, MaybeG;
    ({
      AnyT,
      FuncG,
      MaybeG,
      CollectionInterface,
      CursorInterface: CursorInterfaceDef,
      Interface
    } = Module.prototype);
    return CursorInterface = (function() {
      class CursorInterface extends Interface {};

      CursorInterface.inheritProtected();

      CursorInterface.module(Module);

      CursorInterface.virtual({
        setCollection: FuncG(CollectionInterface, CursorInterfaceDef)
      });

      CursorInterface.virtual({
        setIterable: FuncG(AnyT, CursorInterfaceDef)
      });

      CursorInterface.virtual(CursorInterface.async({
        toArray: FuncG([], Array)
      }));

      CursorInterface.virtual(CursorInterface.async({
        next: FuncG([], MaybeG(AnyT))
      }));

      CursorInterface.virtual(CursorInterface.async({
        hasNext: FuncG([], Boolean)
      }));

      CursorInterface.virtual(CursorInterface.async({
        close: Function
      }));

      CursorInterface.virtual(CursorInterface.async({
        count: FuncG([], Number)
      }));

      CursorInterface.virtual(CursorInterface.async({
        forEach: FuncG(Function)
      }));

      CursorInterface.virtual(CursorInterface.async({
        map: FuncG(Function, Array)
      }));

      CursorInterface.virtual(CursorInterface.async({
        filter: FuncG(Function, Array)
      }));

      CursorInterface.virtual(CursorInterface.async({
        find: FuncG(Function, AnyT)
      }));

      CursorInterface.virtual(CursorInterface.async({
        compact: FuncG([], Array)
      }));

      CursorInterface.virtual(CursorInterface.async({
        reduce: FuncG([Function, AnyT], AnyT)
      }));

      CursorInterface.virtual(CursorInterface.async({
        first: FuncG([], MaybeG(AnyT))
      }));

      CursorInterface.initialize();

      return CursorInterface;

    }).call(this);
  };

}).call(this);
