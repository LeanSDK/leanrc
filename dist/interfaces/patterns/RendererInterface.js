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
    var AnyT, ContextInterface, FuncG, InterfaceG, MaybeG, ProxyInterface, RendererInterface, ResourceInterface;
    ({AnyT, FuncG, MaybeG, InterfaceG, ContextInterface, ResourceInterface, ProxyInterface} = Module.prototype);
    return RendererInterface = (function() {
      class RendererInterface extends ProxyInterface {};

      RendererInterface.inheritProtected();

      RendererInterface.module(Module);

      RendererInterface.virtual(RendererInterface.async({
        render: FuncG([
          ContextInterface,
          AnyT,
          ResourceInterface,
          MaybeG(InterfaceG({
            method: String,
            path: String,
            resource: String,
            action: String,
            tag: String,
            template: String,
            keyName: MaybeG(String),
            entityName: String,
            recordName: MaybeG(String)
          }))
        ], MaybeG(AnyT))
      }));

      RendererInterface.initialize();

      return RendererInterface;

    }).call(this);
  };

}).call(this);
