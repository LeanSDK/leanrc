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
    var FuncG, MaybeG, Pipe, PipeFittingInterface, TeeMerge;
    ({FuncG, MaybeG, PipeFittingInterface, Pipe} = Module.prototype);
    return TeeMerge = (function() {
      class TeeMerge extends Pipe {};

      TeeMerge.inheritProtected();

      TeeMerge.module(Module);

      TeeMerge.public({
        connectInput: FuncG(PipeFittingInterface, Boolean)
      }, {
        default: function(aoInput) {
          return aoInput.connect(this);
        }
      });

      TeeMerge.public({
        init: FuncG([MaybeG(PipeFittingInterface), MaybeG(PipeFittingInterface)])
      }, {
        default: function(input1 = null, input2 = null) {
          this.super(...arguments);
          if (input1 != null) {
            this.connectInput(input1);
          }
          if (input2 != null) {
            this.connectInput(input2);
          }
        }
      });

      TeeMerge.initialize();

      return TeeMerge;

    }).call(this);
  };

}).call(this);
