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
    var BYPASS, FILTER, Filter, FilterControlMessage, FuncG, LambdaT, MaybeG, NORMAL, Pipe, PipeFittingInterface, PipeMessageInterface, PointerT, SET_FILTER, SET_PARAMS;
    ({
      PointerT,
      LambdaT,
      FuncG,
      MaybeG,
      PipeMessageInterface,
      PipeFittingInterface,
      FilterControlMessage,
      PipeMessage: {NORMAL},
      Pipe
    } = Module.prototype);
    ({FILTER, SET_PARAMS, SET_FILTER, BYPASS} = FilterControlMessage);
    return Filter = (function() {
      var ipmApplyFilter, ipmFilter, ipmIsTarget, ipoOutput, ipoParams, ipsMode, ipsName;

      class Filter extends Pipe {};

      Filter.inheritProtected();

      Filter.module(Module);

      ipoOutput = PointerT(Symbol.for('~output'));

      ipsMode = PointerT(Filter.protected({
        mode: String
      }, {
        default: FILTER
      }));

      ipmFilter = PointerT(Filter.protected({
        filter: LambdaT
      }, {
        default: function(aoMessage, aoParams) {}
      }));

      ipoParams = PointerT(Filter.protected({
        params: MaybeG(Object)
      }));

      ipsName = PointerT(Filter.protected({
        name: String
      }));

      ipmIsTarget = PointerT(Filter.protected({
        isTarget: FuncG(PipeMessageInterface, Boolean)
      }, {
        default: function(aoMessage) { // must be instance of FilterControlMessage
          return aoMessage instanceof FilterControlMessage && (aoMessage != null ? aoMessage.getName() : void 0) === this[ipsName];
        }
      }));

      ipmApplyFilter = PointerT(Filter.protected({
        applyFilter: FuncG(PipeMessageInterface, PipeMessageInterface)
      }, {
        default: function(aoMessage) {
          this[ipmFilter].apply(this, [aoMessage, this[ipoParams]]);
          return aoMessage;
        }
      }));

      Filter.public({
        setParams: FuncG(Object)
      }, {
        default: function(aoParams) {
          this[ipoParams] = aoParams;
        }
      });

      Filter.public({
        setFilter: FuncG(Function)
      }, {
        default: function(amFilter) {
          // @[ipmFilter] = amFilter
          Reflect.defineProperty(this, ipmFilter, {
            value: amFilter
          });
        }
      });

      Filter.public({
        write: FuncG(PipeMessageInterface, Boolean)
      }, {
        default: function(aoMessage) {
          var err, vbSuccess, voOutputMessage;
          vbSuccess = true;
          voOutputMessage = null;
          switch (aoMessage.getType()) {
            case NORMAL:
              try {
                if (this[ipsMode] === FILTER) {
                  voOutputMessage = this[ipmApplyFilter](aoMessage);
                } else {
                  voOutputMessage = aoMessage;
                }
                vbSuccess = this[ipoOutput].write(voOutputMessage);
              } catch (error) {
                err = error;
                console.log('>>>>>>>>>>>>>>> err', err);
                vbSuccess = false;
              }
              break;
            case SET_PARAMS:
              if (this[ipmIsTarget](aoMessage)) {
                this.setParams(aoMessage.getParams());
              } else {
                vbSuccess = this[ipoOutput].write(voOutputMessage);
              }
              break;
            case SET_FILTER:
              if (this[ipmIsTarget](aoMessage)) {
                this.setFilter(aoMessage.getFilter());
              } else {
                vbSuccess = this[ipoOutput].write(voOutputMessage);
              }
              break;
            case BYPASS:
            case FILTER:
              if (this[ipmIsTarget](aoMessage)) {
                this[ipsMode] = aoMessage.getType();
              } else {
                vbSuccess = this[ipoOutput].write(voOutputMessage);
              }
              break;
            default:
              vbSuccess = this[ipoOutput].write(outputMessage);
          }
          return vbSuccess;
        }
      });

      Filter.public({
        init: FuncG([String, MaybeG(PipeFittingInterface), MaybeG(Function), MaybeG(Object)])
      }, {
        default: function(asName, aoOutput = null, amFilter = null, aoParams = null) {
          this.super(aoOutput);
          this[ipsName] = asName;
          if (amFilter != null) {
            this.setFilter(amFilter);
          }
          if (aoParams != null) {
            this.setParams(aoParams);
          }
        }
      });

      Filter.initialize();

      return Filter;

    }).call(this);
  };

}).call(this);
