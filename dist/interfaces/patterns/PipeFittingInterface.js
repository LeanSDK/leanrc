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
    var FuncG, Interface, MaybeG, PipeFittingInterface, PipeFittingInterfaceDef, PipeMessageInterface;
    ({
      FuncG,
      MaybeG,
      PipeMessageInterface,
      PipeFittingInterface: PipeFittingInterfaceDef,
      Interface
    } = Module.prototype);
    return PipeFittingInterface = (function() {
      class PipeFittingInterface extends Interface {};

      PipeFittingInterface.inheritProtected();

      PipeFittingInterface.module(Module);

      PipeFittingInterface.virtual({
        connect: FuncG(PipeFittingInterfaceDef, Boolean)
      });

      PipeFittingInterface.virtual({
        disconnect: FuncG([], MaybeG(PipeFittingInterfaceDef))
      });

      PipeFittingInterface.virtual({
        write: FuncG(PipeMessageInterface, Boolean)
      });

      PipeFittingInterface.initialize();

      return PipeFittingInterface;

    }).call(this);
  };

}).call(this);
