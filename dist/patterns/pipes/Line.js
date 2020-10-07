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
    var FIFO, FLUSH, FuncG, Line, ListG, MaybeG, Pipe, PipeFittingInterface, PipeMessageInterface, PointerT, SORT;
    ({
      PointerT,
      FuncG,
      ListG,
      MaybeG,
      PipeFittingInterface,
      PipeMessageInterface,
      LineControlMessage: {SORT, FLUSH, FIFO},
      Pipe
    } = Module.prototype);
    return Line = (function() {
      var iplMessages, ipmFlush, ipmSort, ipmStore, ipoOutput, ipsMode;

      class Line extends Pipe {};

      Line.inheritProtected();

      Line.module(Module);

      ipoOutput = PointerT(Symbol.for('~output'));

      ipsMode = PointerT(Line.protected({
        mode: String
      }, {
        default: SORT
      }));

      iplMessages = PointerT(Line.protected({
        messages: MaybeG(ListG(PipeMessageInterface))
      }));

      ipmSort = PointerT(Line.protected({
        sortMessagesByPriority: FuncG([PipeMessageInterface, PipeMessageInterface], Number)
      }, {
        default: function(msgA, msgB) {
          var vnNum;
          vnNum = 0;
          if (msgA.getPriority() < msgB.getPriority()) {
            vnNum = -1;
          }
          if (msgA.getPriority() > msgB.getPriority()) {
            vnNum = 1;
          }
          return vnNum;
        }
      }));

      ipmStore = PointerT(Line.protected({
        store: FuncG(PipeMessageInterface)
      }, {
        default: function(aoMessage) {
          if (this[iplMessages] == null) {
            this[iplMessages] = [];
          }
          this[iplMessages].push(aoMessage);
          if (this[ipsMode] === SORT) {
            this[iplMessages].sort(this[ipmSort].bind(this));
          }
        }
      }));

      ipmFlush = PointerT(Line.protected({
        flush: FuncG([], Boolean)
      }, {
        default: function() {
          var ok, vbSuccess, voMessage;
          vbSuccess = true;
          if (this[iplMessages] == null) {
            this[iplMessages] = [];
          }
          while ((voMessage = this[iplMessages].shift()) != null) {
            ok = this[ipoOutput].write(voMessage);
            if (!ok) {
              vbSuccess = false;
            }
          }
          return vbSuccess;
        }
      }));

      Line.public({
        write: FuncG(PipeMessageInterface, Boolean)
      }, {
        default: function(aoMessage) {
          var vbSuccess, voOutputMessage;
          vbSuccess = true;
          voOutputMessage = null;
          switch (aoMessage.getType()) {
            case Module.prototype.PipeMessage.NORMAL:
              this[ipmStore](aoMessage);
              break;
            case FLUSH:
              vbSuccess = this[ipmFlush]();
              break;
            case SORT:
            case FIFO:
              this[ipsMode] = aoMessage.getType();
          }
          return vbSuccess;
        }
      });

      Line.public({
        init: FuncG([MaybeG(PipeFittingInterface)])
      }, {
        default: function(aoOutput = null) {
          this.super(aoOutput);
        }
      });

      Line.initialize();

      return Line;

    }).call(this);
  };

}).call(this);
