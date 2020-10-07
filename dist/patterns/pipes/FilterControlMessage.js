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
    var FilterControlMessage, FuncG, LambdaT, MaybeG, PipeMessage, PointerT;
    ({PointerT, LambdaT, FuncG, MaybeG, PipeMessage} = Module.prototype);
    return FilterControlMessage = (function() {
      var ipmFilter, ipoParams, ipsName;

      class FilterControlMessage extends PipeMessage {};

      FilterControlMessage.inheritProtected();

      FilterControlMessage.module(Module);

      FilterControlMessage.public(FilterControlMessage.static({
        BASE: String
      }, {
        get: function() {
          return `${PipeMessage.BASE}filter-control/`;
        }
      }));

      FilterControlMessage.public(FilterControlMessage.static({
        SET_PARAMS: String
      }, {
        get: function() {
          return `${this.BASE}setparams`;
        }
      }));

      FilterControlMessage.public(FilterControlMessage.static({
        SET_FILTER: String
      }, {
        get: function() {
          return `${this.BASE}setfilter`;
        }
      }));

      FilterControlMessage.public(FilterControlMessage.static({
        BYPASS: String
      }, {
        get: function() {
          return `${this.BASE}bypass`;
        }
      }));

      FilterControlMessage.public(FilterControlMessage.static({
        FILTER: String
      }, {
        get: function() {
          return `${this.BASE}filter`;
        }
      }));

      ipsName = PointerT(FilterControlMessage.protected({
        name: String
      }));

      ipmFilter = PointerT(FilterControlMessage.protected({
        filter: LambdaT
      }));

      ipoParams = PointerT(FilterControlMessage.protected({
        params: Object
      }));

      FilterControlMessage.public({
        setName: FuncG(String)
      }, {
        default: function(asName) {
          this[ipsName] = asName;
        }
      });

      FilterControlMessage.public({
        getName: FuncG([], String)
      }, {
        default: function() {
          return this[ipsName];
        }
      });

      FilterControlMessage.public({
        setFilter: FuncG(Function)
      }, {
        default: function(amFilter) {
          this[ipmFilter] = amFilter;
        }
      });

      FilterControlMessage.public({
        getFilter: FuncG([], Function)
      }, {
        default: function() {
          return this[ipmFilter];
        }
      });

      FilterControlMessage.public({
        setParams: FuncG(Object)
      }, {
        default: function(aoParams) {
          this[ipoParams] = aoParams;
        }
      });

      FilterControlMessage.public({
        getParams: FuncG([], Object)
      }, {
        default: function() {
          return this[ipoParams];
        }
      });

      FilterControlMessage.public({
        init: FuncG([String, String, MaybeG(Function), MaybeG(Object)])
      }, {
        default: function(asType, asName, amFilter = null, aoParams = null) {
          this.super(asType);
          this.setName(asName);
          if (amFilter != null) {
            this.setFilter(amFilter);
          }
          if (aoParams != null) {
            this.setParams(aoParams);
          }
        }
      });

      FilterControlMessage.initialize();

      return FilterControlMessage;

    }).call(this);
  };

}).call(this);
