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
    var CoreObject, FuncG, LambdaT, MaybeG, PipeFittingInterface, PipeListener, PipeMessageInterface, PointerT;
    ({LambdaT, PointerT, FuncG, MaybeG, PipeFittingInterface, PipeMessageInterface, CoreObject} = Module.prototype);
    return PipeListener = (function() {
      var ipmListener, ipoContext;

      class PipeListener extends CoreObject {};

      PipeListener.inheritProtected();

      PipeListener.implements(PipeFittingInterface);

      PipeListener.module(Module);

      ipoContext = PointerT(PipeListener.private({
        context: Object
      }));

      ipmListener = PointerT(PipeListener.private({
        listener: LambdaT
      }));

      PipeListener.public({
        connect: FuncG(PipeFittingInterface, Boolean)
      }, {
        default: function() {
          return false;
        }
      });

      PipeListener.public({
        disconnect: FuncG([], MaybeG(PipeFittingInterface))
      }, {
        default: function() {
          return null;
        }
      });

      PipeListener.public({
        write: FuncG(PipeMessageInterface, Boolean)
      }, {
        default: function(aoMessage) {
          this[ipmListener].call(this[ipoContext], aoMessage);
          return true;
        }
      });

      PipeListener.public(PipeListener.static(PipeListener.async({
        restoreObject: Function
      }, {
        default: function*() {
          throw new Error(`restoreObject method not supported for ${this.name}`);
        }
      })));

      PipeListener.public(PipeListener.static(PipeListener.async({
        replicateObject: Function
      }, {
        default: function*() {
          throw new Error(`replicateObject method not supported for ${this.name}`);
        }
      })));

      PipeListener.public({
        init: FuncG([Object, Function])
      }, {
        default: function(aoContext, amListener) {
          this.super(...arguments);
          this[ipoContext] = aoContext;
          this[ipmListener] = amListener;
        }
      });

      PipeListener.initialize();

      return PipeListener;

    }).call(this);
  };

}).call(this);
