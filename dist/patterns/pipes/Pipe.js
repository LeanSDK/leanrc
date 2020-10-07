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
    var CoreObject, FuncG, MaybeG, Pipe, PipeFittingInterface, PipeMessageInterface, PointerT;
    ({PointerT, FuncG, MaybeG, PipeFittingInterface, PipeMessageInterface, CoreObject} = Module.prototype);
    return Pipe = (function() {
      var ipoOutput;

      class Pipe extends CoreObject {};

      Pipe.inheritProtected();

      Pipe.implements(PipeFittingInterface);

      Pipe.module(Module);

      ipoOutput = PointerT(Pipe.protected({
        output: MaybeG(PipeFittingInterface)
      }));

      Pipe.public({
        connect: FuncG(PipeFittingInterface, Boolean)
      }, {
        default: function(aoOutput) {
          var vbSuccess;
          vbSuccess = false;
          if (this[ipoOutput] == null) {
            this[ipoOutput] = aoOutput;
            vbSuccess = true;
          }
          return vbSuccess;
        }
      });

      Pipe.public({
        disconnect: FuncG([], MaybeG(PipeFittingInterface))
      }, {
        default: function() {
          var disconnectedFitting;
          disconnectedFitting = this[ipoOutput];
          this[ipoOutput] = null;
          return disconnectedFitting;
        }
      });

      Pipe.public({
        write: FuncG(PipeMessageInterface, Boolean)
      }, {
        default: function(aoMessage) {
          var ref, ref1;
          return (ref = (ref1 = this[ipoOutput]) != null ? ref1.write(aoMessage) : void 0) != null ? ref : true;
        }
      });

      Pipe.public(Pipe.static(Pipe.async({
        restoreObject: Function
      }, {
        default: function*() {
          throw new Error(`restoreObject method not supported for ${this.name}`);
        }
      })));

      Pipe.public(Pipe.static(Pipe.async({
        replicateObject: Function
      }, {
        default: function*() {
          throw new Error(`replicateObject method not supported for ${this.name}`);
        }
      })));

      Pipe.public({
        init: FuncG([MaybeG(PipeFittingInterface)])
      }, {
        default: function(aoOutput) {
          this.super(...arguments);
          if (aoOutput != null) {
            this.connect(aoOutput);
          }
        }
      });

      Pipe.initialize();

      return Pipe;

    }).call(this);
  };

}).call(this);
