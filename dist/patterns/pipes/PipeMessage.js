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
    var AnyT, CoreObject, FuncG, MaybeG, PipeMessage, PipeMessageInterface, PointerT;
    ({AnyT, PointerT, FuncG, MaybeG, PipeMessageInterface, CoreObject} = Module.prototype);
    return PipeMessage = (function() {
      var ipnPriority, ipoBody, ipoHeader, ipsType;

      class PipeMessage extends CoreObject {};

      PipeMessage.inheritProtected();

      PipeMessage.implements(PipeMessageInterface);

      PipeMessage.module(Module);

      PipeMessage.public(PipeMessage.static({
        PRIORITY_HIGH: Number
      }, {
        default: 1
      }));

      PipeMessage.public(PipeMessage.static({
        PRIORITY_MED: Number
      }, {
        default: 5
      }));

      PipeMessage.public(PipeMessage.static({
        PRIORITY_LOW: Number
      }, {
        default: 10
      }));

      PipeMessage.public(PipeMessage.static({
        BASE: String
      }, {
        default: 'namespaces/pipes/messages/'
      }));

      PipeMessage.public(PipeMessage.static({
        NORMAL: String
      }, {
        get: function() {
          return `${this.BASE}normal`;
        }
      }));

      ipsType = PointerT(PipeMessage.protected({
        type: String
      }));

      ipnPriority = PointerT(PipeMessage.protected({
        priority: Number
      }));

      ipoHeader = PointerT(PipeMessage.protected({
        header: MaybeG(Object)
      }));

      ipoBody = PointerT(PipeMessage.protected({
        body: MaybeG(AnyT)
      }));

      PipeMessage.public({
        getType: FuncG([], String)
      }, {
        default: function() {
          return this[ipsType];
        }
      });

      PipeMessage.public({
        setType: FuncG(String)
      }, {
        default: function(asType) {
          this[ipsType] = asType;
        }
      });

      PipeMessage.public({
        getPriority: FuncG([], Number)
      }, {
        default: function() {
          return this[ipnPriority];
        }
      });

      PipeMessage.public({
        setPriority: FuncG(Number)
      }, {
        default: function(anPriority) {
          this[ipnPriority] = anPriority;
        }
      });

      PipeMessage.public({
        getHeader: FuncG([], MaybeG(Object))
      }, {
        default: function() {
          return this[ipoHeader];
        }
      });

      PipeMessage.public({
        setHeader: FuncG(Object)
      }, {
        default: function(aoHeader) {
          this[ipoHeader] = aoHeader;
        }
      });

      PipeMessage.public({
        getBody: FuncG([], MaybeG(AnyT))
      }, {
        default: function() {
          return this[ipoBody];
        }
      });

      PipeMessage.public({
        setBody: FuncG([MaybeG(AnyT)])
      }, {
        default: function(aoBody) {
          this[ipoBody] = aoBody;
        }
      });

      PipeMessage.public(PipeMessage.static(PipeMessage.async({
        restoreObject: Function
      }, {
        default: function*() {
          throw new Error(`restoreObject method not supported for ${this.name}`);
        }
      })));

      PipeMessage.public(PipeMessage.static(PipeMessage.async({
        replicateObject: Function
      }, {
        default: function*() {
          throw new Error(`replicateObject method not supported for ${this.name}`);
        }
      })));

      PipeMessage.public({
        init: FuncG([String, MaybeG(Object), MaybeG(Object), MaybeG(Number)])
      }, {
        default: function(asType, aoHeader = null, aoBody = null, anPriority = 5) {
          this.super(...arguments);
          this.setType(asType);
          if (aoHeader != null) {
            this.setHeader(aoHeader);
          }
          if (aoBody != null) {
            this.setBody(aoBody);
          }
          this.setPriority(anPriority);
        }
      });

      PipeMessage.initialize();

      return PipeMessage;

    }).call(this);
  };

}).call(this);
