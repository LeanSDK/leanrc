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
    var AnyT, ApplicationInterface, ContextInterface, FuncG, Interface, MaybeG, ResourceInterface, StructG;
    ({AnyT, FuncG, StructG, MaybeG, ContextInterface, ResourceInterface, Interface} = Module.prototype);
    return ApplicationInterface = (function() {
      class ApplicationInterface extends Interface {};

      ApplicationInterface.inheritProtected();

      ApplicationInterface.module(Module);

      ApplicationInterface.virtual(ApplicationInterface.static({
        NAME: String
      }));

      ApplicationInterface.virtual({
        isLightweight: Boolean
      });

      ApplicationInterface.virtual({
        context: MaybeG(ContextInterface)
      });

      ApplicationInterface.virtual({
        start: Function
      });

      ApplicationInterface.virtual({
        finish: Function
      });

      ApplicationInterface.virtual(ApplicationInterface.async({
        migrate: FuncG([
          MaybeG(StructG({
            until: MaybeG(String)
          }))
        ])
      }));

      ApplicationInterface.virtual(ApplicationInterface.async({
        rollback: FuncG([
          MaybeG(StructG({
            steps: MaybeG(Number),
            until: MaybeG(String)
          }))
        ])
      }));

      ApplicationInterface.virtual(ApplicationInterface.async({
        run: FuncG([String, MaybeG(AnyT)], MaybeG(AnyT))
      }));

      ApplicationInterface.virtual(ApplicationInterface.async({
        execute: FuncG([
          String,
          StructG({
            context: ContextInterface,
            reverse: String
          }),
          String
        ], StructG({
          result: MaybeG(AnyT),
          resource: ResourceInterface
        }))
      }));

      ApplicationInterface.initialize();

      return ApplicationInterface;

    }).call(this);
  };

}).call(this);
