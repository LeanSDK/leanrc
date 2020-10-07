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
    var FuncG, INPUT, Junction, JunctionMediator, Mediator, MediatorInterface, NotificationInterface, OUTPUT, PipeMessageInterface, PointerT, SampleG, SubsetG;
    ({PointerT, FuncG, SampleG, SubsetG, NotificationInterface, PipeMessageInterface, MediatorInterface, Junction, Mediator} = Module.prototype);
    ({INPUT, OUTPUT} = Junction);
    return JunctionMediator = (function() {
      var ipoJunction;

      class JunctionMediator extends Mediator {};

      JunctionMediator.inheritProtected();

      JunctionMediator.module(Module);

      JunctionMediator.public(JunctionMediator.static({
        ACCEPT_INPUT_PIPE: String
      }, {
        default: 'acceptInputPipe'
      }));

      JunctionMediator.public(JunctionMediator.static({
        ACCEPT_OUTPUT_PIPE: String
      }, {
        default: 'acceptOutputPipe'
      }));

      JunctionMediator.public(JunctionMediator.static({
        REMOVE_PIPE: String
      }, {
        default: 'removePipe'
      }));

      ipoJunction = PointerT(JunctionMediator.protected({
        junction: SampleG(Junction)
      }, {
        get: function() {
          return this.getViewComponent();
        }
      }));

      JunctionMediator.public({
        listNotificationInterests: FuncG([], Array)
      }, {
        default: function() {
          return [JunctionMediator.ACCEPT_INPUT_PIPE, JunctionMediator.ACCEPT_OUTPUT_PIPE, JunctionMediator.REMOVE_PIPE];
        }
      });

      JunctionMediator.public({
        handleNotification: FuncG(NotificationInterface)
      }, {
        default: function(aoNotification) {
          var inputPipe, inputPipeName, outputPipe, outputPipeName;
          switch (aoNotification.getName()) {
            case JunctionMediator.ACCEPT_INPUT_PIPE:
              inputPipeName = aoNotification.getType();
              inputPipe = aoNotification.getBody();
              if (this[ipoJunction].registerPipe(inputPipeName, INPUT, inputPipe)) {
                this[ipoJunction].addPipeListener(inputPipeName, this, this.handlePipeMessage);
              }
              break;
            case JunctionMediator.ACCEPT_OUTPUT_PIPE:
              outputPipeName = aoNotification.getType();
              outputPipe = aoNotification.getBody();
              this[ipoJunction].registerPipe(outputPipeName, OUTPUT, outputPipe);
              break;
            case JunctionMediator.REMOVE_PIPE:
              outputPipeName = aoNotification.getType();
              this[ipoJunction].removePipe(outputPipeName);
          }
        }
      });

      JunctionMediator.public({
        handlePipeMessage: FuncG(PipeMessageInterface)
      }, {
        default: function(aoMessage) {
          return this.sendNotification(aoMessage.getType(), aoMessage);
        }
      });

      JunctionMediator.public(JunctionMediator.static(JunctionMediator.async({
        restoreObject: FuncG([SubsetG(Module), Object], MediatorInterface)
      }, {
        default: function*() {
          throw new Error(`restoreObject method not supported for ${this.name}`);
        }
      })));

      JunctionMediator.public(JunctionMediator.static(JunctionMediator.async({
        replicateObject: FuncG(MediatorInterface, Object)
      }, {
        default: function*() {
          throw new Error(`replicateObject method not supported for ${this.name}`);
        }
      })));

      JunctionMediator.initialize();

      return JunctionMediator;

    }).call(this);
  };

}).call(this);
