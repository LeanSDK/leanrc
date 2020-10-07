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
    var AnyT, ContextInterface, FuncG, InterfaceG, ListG, MaybeG, MediatorInterface, RendererInterface, ResourceInterface, StructG, SwitchInterface, SwitchInterfaceDef, UnionG;
    ({
      AnyT,
      FuncG,
      ListG,
      MaybeG,
      InterfaceG,
      StructG,
      UnionG,
      ContextInterface,
      MediatorInterface,
      RendererInterface,
      ResourceInterface,
      SwitchInterface: SwitchInterfaceDef
    } = Module.prototype);
    return SwitchInterface = (function() {
      class SwitchInterface extends MediatorInterface {};

      SwitchInterface.inheritProtected();

      SwitchInterface.module(Module);

      SwitchInterface.virtual({
        routerName: String
      });

      SwitchInterface.virtual({
        responseFormats: ListG(String)
      });

      SwitchInterface.virtual({
        use: FuncG([UnionG(Number, Function), MaybeG(Function)], SwitchInterfaceDef)
      });

      SwitchInterface.virtual(SwitchInterface.async({
        handleStatistics: FuncG([Number, Number, Number, ContextInterface])
      }));

      SwitchInterface.virtual({
        rendererFor: FuncG(String, RendererInterface)
      });

      SwitchInterface.virtual(SwitchInterface.async({
        sendHttpResponse: FuncG([
          ContextInterface,
          MaybeG(AnyT),
          ResourceInterface,
          InterfaceG({
            method: String,
            path: String,
            resource: String,
            action: String,
            tag: String,
            template: String,
            keyName: MaybeG(String),
            entityName: String,
            recordName: MaybeG(String)
          })
        ])
      }));

      SwitchInterface.virtual({
        defineRoutes: Function
      });

      SwitchInterface.virtual({
        sender: FuncG([
          String,
          StructG({
            context: ContextInterface,
            reverse: String
          }),
          InterfaceG({
            method: String,
            path: String,
            resource: String,
            action: String,
            tag: String,
            template: String,
            keyName: MaybeG(String),
            entityName: String,
            recordName: MaybeG(String)
          })
        ])
      });

      SwitchInterface.virtual({
        createNativeRoute: FuncG([
          InterfaceG({
            method: String,
            path: String,
            resource: String,
            action: String,
            tag: String,
            template: String,
            keyName: MaybeG(String),
            entityName: String,
            recordName: MaybeG(String)
          })
        ])
      });

      SwitchInterface.initialize();

      return SwitchInterface;

    }).call(this);
  };

}).call(this);
