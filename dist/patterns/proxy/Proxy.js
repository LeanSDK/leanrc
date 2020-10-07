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
    var AnyT, FuncG, MaybeG, Notifier, PointerT, Proxy, ProxyInterface, SubsetG;
    ({AnyT, PointerT, FuncG, SubsetG, MaybeG, ProxyInterface, Notifier} = Module.prototype);
    return Proxy = (function() {
      var ipoData, ipsProxyName;

      class Proxy extends Notifier {};

      Proxy.inheritProtected();

      Proxy.implements(ProxyInterface);

      Proxy.module(Module);

      ipsProxyName = PointerT(Proxy.private({
        proxyName: String
      }));

      ipoData = PointerT(Proxy.private({
        data: MaybeG(AnyT)
      }));

      Proxy.public({
        getProxyName: FuncG([], String)
      }, {
        default: function() {
          return this[ipsProxyName];
        }
      });

      Proxy.public({
        getName: FuncG([], String)
      }, {
        default: function() {
          return this[ipsProxyName];
        }
      });

      Proxy.public({
        setData: FuncG(AnyT)
      }, {
        default: function(ahData) {
          this[ipoData] = ahData;
        }
      });

      Proxy.public({
        getData: FuncG([], MaybeG(AnyT))
      }, {
        default: function() {
          return this[ipoData];
        }
      });

      Proxy.public({
        onRegister: Function
      }, {
        default: function() {}
      });

      Proxy.public({
        onRemove: Function
      }, {
        default: function() {}
      });

      // need test it
      Proxy.public(Proxy.static(Proxy.async({
        restoreObject: FuncG([SubsetG(Module), Object], ProxyInterface)
      }, {
        default: function*(Module, replica) {
          var facade, proxy;
          if ((replica != null ? replica.class : void 0) === this.name && (replica != null ? replica.type : void 0) === 'instance') {
            facade = Module.prototype.ApplicationFacade.getInstance(replica.multitonKey);
            proxy = facade.retrieveProxy(replica.proxyName);
            return proxy;
          } else {
            return (yield this.super(Module, replica));
          }
        }
      })));

      // need test it
      Proxy.public(Proxy.static(Proxy.async({
        replicateObject: FuncG(ProxyInterface, Object)
      }, {
        default: function*(instance) {
          var ipsMultitonKey, replica;
          replica = (yield this.super(instance));
          ipsMultitonKey = Symbol.for('~multitonKey');
          replica.multitonKey = instance[ipsMultitonKey];
          replica.proxyName = instance.getProxyName();
          return replica;
        }
      })));

      Proxy.public({
        init: FuncG([MaybeG(String), MaybeG(AnyT)])
      }, {
        default: function(asProxyName, ahData) {
          this.super(...arguments);
          this[ipsProxyName] = asProxyName != null ? asProxyName : this.constructor.name;
          if (ahData != null) {
            this.setData(ahData);
          }
        }
      });

      Proxy.initialize();

      return Proxy;

    }).call(this);
  };

}).call(this);
