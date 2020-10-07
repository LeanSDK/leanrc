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
    var FuncG, LineControlMessage, MaybeG, PipeMessage;
    ({FuncG, MaybeG, PipeMessage} = Module.prototype);
    return LineControlMessage = (function() {
      class LineControlMessage extends PipeMessage {};

      LineControlMessage.inheritProtected();

      LineControlMessage.module(Module);

      LineControlMessage.public(LineControlMessage.static({
        BASE: String
      }, {
        get: function() {
          return `${PipeMessage.BASE}queue/`;
        }
      }));

      LineControlMessage.public(LineControlMessage.static({
        FLUSH: String
      }, {
        get: function() {
          return `${this.BASE}flush`;
        }
      }));

      LineControlMessage.public(LineControlMessage.static({
        SORT: String
      }, {
        get: function() {
          return `${this.BASE}sort`;
        }
      }));

      LineControlMessage.public(LineControlMessage.static({
        FIFO: String
      }, {
        get: function() {
          return `${this.BASE}fifo`;
        }
      }));

      LineControlMessage.public({
        init: FuncG([String, MaybeG(Object), MaybeG(Object), MaybeG(Number)])
      }, {
        default: function(asType) {
          this.super(asType);
        }
      });

      LineControlMessage.initialize();

      return LineControlMessage;

    }).call(this);
  };

}).call(this);
