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
    var APPLICATION_MEDIATOR, AnyT, Application, ApplicationInterface, ConfigurableMixin, ContextInterface, FuncG, LIGHTWEIGHT, MaybeG, PipeAwareModule, Pipes, ResourceInterface, StructG, UnionG, uuid;
    ({
      LIGHTWEIGHT,
      APPLICATION_MEDIATOR,
      AnyT,
      FuncG,
      MaybeG,
      StructG,
      UnionG,
      ApplicationInterface,
      ContextInterface,
      ResourceInterface,
      Pipes,
      ConfigurableMixin,
      Utils: {uuid}
    } = Module.prototype);
    ({PipeAwareModule} = Pipes.prototype);
    return Application = (function() {
      class Application extends PipeAwareModule {};

      Application.inheritProtected();

      Application.include(ConfigurableMixin);

      Application.implements(ApplicationInterface);

      Application.module(Module);

      Application.const({
        LOGGER_PROXY: 'LoggerProxy'
      });

      Application.const({
        CONNECT_MODULE_TO_LOGGER: 'connectModuleToLogger'
      });

      Application.const({
        CONNECT_SHELL_TO_LOGGER: 'connectShellToLogger'
      });

      Application.const({
        CONNECT_MODULE_TO_SHELL: 'connectModuleToShell'
      });

      Application.public({
        isLightweight: Boolean
      });

      Application.public({
        context: MaybeG(ContextInterface)
      });

      Application.public(Application.static({
        NAME: String
      }, {
        get: function() {
          return this.Module.name;
        }
      }));

      Application.public({
        start: Function
      }, {
        default: function() {
          this.facade.startup(this);
        }
      });

      Application.public({
        finish: Function
      }, {
        default: function() {
          this.facade.remove();
        }
      });

      // @facade = undefined
      Application.public(Application.async({
        migrate: FuncG([
          MaybeG(StructG({
            until: MaybeG(String)
          }))
        ])
      }, {
        default: function*(opts) {
          var appMediator;
          appMediator = this.facade.retrieveMediator(APPLICATION_MEDIATOR);
          return (yield appMediator.migrate(opts));
        }
      }));

      Application.public(Application.async({
        rollback: FuncG([
          MaybeG(StructG({
            steps: MaybeG(Number),
            until: MaybeG(String)
          }))
        ])
      }, {
        default: function*(opts) {
          var appMediator;
          appMediator = this.facade.retrieveMediator(APPLICATION_MEDIATOR);
          return (yield appMediator.rollback(opts));
        }
      }));

      Application.public(Application.async({
        run: FuncG([String, MaybeG(AnyT)], MaybeG(AnyT))
      }, {
        default: function*(scriptName, data) {
          var appMediator;
          appMediator = this.facade.retrieveMediator(APPLICATION_MEDIATOR);
          return (yield appMediator.run(scriptName, data));
        }
      }));

      Application.public(Application.async({
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
      }, {
        default: function*(resourceName, {context, reverse}, action) {
          var appMediator;
          this.context = context;
          appMediator = this.facade.retrieveMediator(APPLICATION_MEDIATOR);
          return (yield appMediator.execute(resourceName, {context, reverse}, action));
        }
      }));

      Application.public({
        init: FuncG([MaybeG(UnionG(Symbol, Object)), MaybeG(Object)])
      }, {
        default: function(symbol, data) {
          var ApplicationFacade, NAME, isLightweight, name, ref;
          ({ApplicationFacade} = (ref = this.constructor.Module.NS) != null ? ref : this.constructor.Module.prototype);
          isLightweight = symbol === LIGHTWEIGHT;
          ({NAME, name} = this.constructor);
          if (isLightweight) {
            this.super(ApplicationFacade.getInstance(`${NAME != null ? NAME : name}|>${uuid.v4()}`));
          } else {
            this.super(ApplicationFacade.getInstance(NAME != null ? NAME : name));
          }
          this.isLightweight = isLightweight;
        }
      });

      Application.initialize();

      return Application;

    }).call(this);
  };

}).call(this);
