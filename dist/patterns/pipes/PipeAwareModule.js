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
    var ACCEPT_INPUT_PIPE, ACCEPT_OUTPUT_PIPE, CoreObject, FacadeInterface, FuncG, MaybeG, PipeAwareInterface, PipeAwareModule, PipeFittingInterface;
    ({FuncG, MaybeG, PipeAwareInterface, PipeFittingInterface, FacadeInterface, CoreObject} = Module.prototype);
    ({ACCEPT_INPUT_PIPE, ACCEPT_OUTPUT_PIPE} = Module.prototype.JunctionMediator);
    return PipeAwareModule = (function() {
      class PipeAwareModule extends CoreObject {};

      PipeAwareModule.inheritProtected();

      PipeAwareModule.implements(PipeAwareInterface);

      PipeAwareModule.module(Module);

      PipeAwareModule.public(PipeAwareModule.static({
        STDOUT: String
      }, {
        default: 'standardOutput'
      }));

      PipeAwareModule.public(PipeAwareModule.static({
        STDIN: String
      }, {
        default: 'standardInput'
      }));

      PipeAwareModule.public(PipeAwareModule.static({
        STDLOG: String
      }, {
        default: 'standardLog'
      }));

      PipeAwareModule.public(PipeAwareModule.static({
        STDSHELL: String
      }, {
        default: 'standardShell'
      }));

      PipeAwareModule.public({
        facade: FacadeInterface
      });

      PipeAwareModule.public({
        acceptInputPipe: FuncG([String, PipeFittingInterface])
      }, {
        default: function(asName, aoPipe) {
          this.facade.sendNotification(ACCEPT_INPUT_PIPE, aoPipe, asName);
        }
      });

      PipeAwareModule.public({
        acceptOutputPipe: FuncG([String, PipeFittingInterface])
      }, {
        default: function(asName, aoPipe) {
          this.facade.sendNotification(ACCEPT_OUTPUT_PIPE, aoPipe, asName);
        }
      });

      PipeAwareModule.public(PipeAwareModule.static(PipeAwareModule.async({
        restoreObject: Function
      }, {
        default: function*() {
          throw new Error(`restoreObject method not supported for ${this.name}`);
        }
      })));

      PipeAwareModule.public(PipeAwareModule.static(PipeAwareModule.async({
        replicateObject: Function
      }, {
        default: function*() {
          throw new Error(`replicateObject method not supported for ${this.name}`);
        }
      })));

      PipeAwareModule.public({
        init: FuncG(MaybeG(FacadeInterface))
      }, {
        default: function(aoFacade) {
          this.super(...arguments);
          if (aoFacade != null) {
            this.facade = aoFacade;
          }
        }
      });

      PipeAwareModule.initialize();

      return PipeAwareModule;

    }).call(this);
  };

}).call(this);
