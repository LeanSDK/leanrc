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
  var splice = [].splice;

  module.exports = function(Module) {
    var CoreObject, FuncG, ListG, MaybeG, PipeFittingInterface, PipeMessageInterface, PointerT, TeeSplit;
    ({PointerT, FuncG, ListG, MaybeG, PipeFittingInterface, PipeMessageInterface, CoreObject} = Module.prototype);
    return TeeSplit = (function() {
      var iplOutputs;

      class TeeSplit extends CoreObject {};

      TeeSplit.inheritProtected();

      TeeSplit.implements(PipeFittingInterface);

      TeeSplit.module(Module);

      iplOutputs = PointerT(TeeSplit.protected({
        outputs: MaybeG(ListG(PipeFittingInterface))
      }));

      TeeSplit.public({
        connect: FuncG(PipeFittingInterface, Boolean)
      }, {
        default: function(aoOutput) {
          if (this[iplOutputs] == null) {
            this[iplOutputs] = [];
          }
          this[iplOutputs].push(aoOutput);
          return true;
        }
      });

      TeeSplit.public({
        disconnect: FuncG([], MaybeG(PipeFittingInterface))
      }, {
        default: function() {
          if (this[iplOutputs] == null) {
            this[iplOutputs] = [];
          }
          return this[iplOutputs].pop();
        }
      });

      TeeSplit.public({
        disconnectFitting: FuncG(PipeFittingInterface, PipeFittingInterface)
      }, {
        default: function(aoTarget) {
          var aoOutput, i, j, len, ref, ref1, voRemoved;
          voRemoved = null;
          if (this[iplOutputs] == null) {
            this[iplOutputs] = [];
          }
          ref = this[iplOutputs];
          for (i = j = 0, len = ref.length; j < len; i = ++j) {
            aoOutput = ref[i];
            if (aoOutput === aoTarget) {
              splice.apply(this[iplOutputs], [i, i - i + 1].concat(ref1 = [])), ref1;
              voRemoved = aoOutput;
              break;
            }
          }
          return voRemoved;
        }
      });

      TeeSplit.public({
        write: FuncG(PipeMessageInterface, Boolean)
      }, {
        default: function(aoMessage) {
          var vbSuccess;
          vbSuccess = true;
          this[iplOutputs].forEach(function(aoOutput) {
            if (!aoOutput.write(aoMessage)) {
              return vbSuccess = false;
            }
          });
          return vbSuccess;
        }
      });

      TeeSplit.public(TeeSplit.static(TeeSplit.async({
        restoreObject: Function
      }, {
        default: function*() {
          throw new Error(`restoreObject method not supported for ${this.name}`);
        }
      })));

      TeeSplit.public(TeeSplit.static(TeeSplit.async({
        replicateObject: Function
      }, {
        default: function*() {
          throw new Error(`replicateObject method not supported for ${this.name}`);
        }
      })));

      TeeSplit.public({
        init: FuncG([MaybeG(PipeFittingInterface), MaybeG(PipeFittingInterface)])
      }, {
        default: function(output1 = null, output2 = null) {
          this.super(...arguments);
          if (output1 != null) {
            this.connect(output1);
          }
          if (output2 != null) {
            this.connect(output2);
          }
        }
      });

      TeeSplit.initialize();

      return TeeSplit;

    }).call(this);
  };

}).call(this);
