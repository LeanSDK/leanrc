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
    var FuncG, Interface, MaybeG, ModelInterface, ProxyInterface;
    ({FuncG, MaybeG, ProxyInterface, Interface} = Module.prototype);
    return ModelInterface = (function() {
      class ModelInterface extends Interface {};

      ModelInterface.inheritProtected();

      ModelInterface.module(Module);

      ModelInterface.virtual({
        registerProxy: FuncG(ProxyInterface)
      });

      ModelInterface.virtual({
        removeProxy: FuncG(String, MaybeG(ProxyInterface))
      });

      ModelInterface.virtual({
        retrieveProxy: FuncG(String, MaybeG(ProxyInterface))
      });

      ModelInterface.virtual({
        hasProxy: FuncG(String, Boolean)
      });

      ModelInterface.initialize();

      return ModelInterface;

    }).call(this);
  };

}).call(this);
