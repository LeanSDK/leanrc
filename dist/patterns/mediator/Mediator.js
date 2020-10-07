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
    var AnyT, FuncG, MaybeG, Mediator, MediatorInterface, NotificationInterface, Notifier, PointerT, ProxyInterface, SubsetG;
    ({AnyT, PointerT, FuncG, SubsetG, MaybeG, MediatorInterface, NotificationInterface, ProxyInterface, Notifier} = Module.prototype);
    return Mediator = (function() {
      var ipoViewComponent, ipsMediatorName;

      class Mediator extends Notifier {};

      Mediator.inheritProtected();

      Mediator.implements(MediatorInterface);

      Mediator.module(Module);

      ipsMediatorName = PointerT(Mediator.private({
        mediatorName: String
      }));

      ipoViewComponent = PointerT(Mediator.private({
        viewComponent: MaybeG(AnyT)
      }));

      Mediator.public({
        getMediatorName: FuncG([], String)
      }, {
        default: function() {
          return this[ipsMediatorName];
        }
      });

      Mediator.public({
        getName: FuncG([], String)
      }, {
        default: function() {
          return this[ipsMediatorName];
        }
      });

      Mediator.public({
        getViewComponent: FuncG([], MaybeG(AnyT))
      }, {
        default: function() {
          return this[ipoViewComponent];
        }
      });

      Mediator.public({
        setViewComponent: FuncG(AnyT)
      }, {
        default: function(aoViewComponent) {
          this[ipoViewComponent] = aoViewComponent;
        }
      });

      Mediator.public({
        view: MaybeG(AnyT)
      }, {
        get: function() {
          return this.getViewComponent();
        },
        set: function(aoViewComponent) {
          return this.setViewComponent(aoViewComponent);
        }
      });

      Mediator.public({
        getProxy: FuncG(String, MaybeG(ProxyInterface))
      }, {
        default: function(...args) {
          return this.facade.retrieveProxy(...args);
        }
      });

      Mediator.public({
        addProxy: FuncG(ProxyInterface)
      }, {
        default: function(...args) {
          return this.facade.registerProxy(...args);
        }
      });

      Mediator.public({
        listNotificationInterests: FuncG([], Array)
      }, {
        default: function() {
          return [];
        }
      });

      Mediator.public({
        handleNotification: FuncG(NotificationInterface)
      }, {
        default: function() {}
      });

      Mediator.public({
        onRegister: Function
      }, {
        default: function() {}
      });

      Mediator.public({
        onRemove: Function
      }, {
        default: function() {}
      });

      // need test it
      Mediator.public(Mediator.static(Mediator.async({
        restoreObject: FuncG([SubsetG(Module), Object], MediatorInterface)
      }, {
        default: function*(Module, replica) {
          var facade, mediator;
          if ((replica != null ? replica.class : void 0) === this.name && (replica != null ? replica.type : void 0) === 'instance') {
            facade = Module.prototype.ApplicationFacade.getInstance(replica.multitonKey);
            mediator = facade.retrieveMediator(replica.mediatorName);
            return mediator;
          } else {
            return (yield this.super(Module, replica));
          }
        }
      })));

      // need test it
      Mediator.public(Mediator.static(Mediator.async({
        replicateObject: FuncG(MediatorInterface, Object)
      }, {
        default: function*(instance) {
          var ipsMultitonKey, replica;
          replica = (yield this.super(instance));
          ipsMultitonKey = Symbol.for('~multitonKey');
          replica.multitonKey = instance[ipsMultitonKey];
          replica.mediatorName = instance.getMediatorName();
          return replica;
        }
      })));

      Mediator.public({
        init: FuncG([MaybeG(String), MaybeG(AnyT)])
      }, {
        default: function(asMediatorName, aoViewComponent) {
          this.super(...arguments);
          this[ipsMediatorName] = asMediatorName != null ? asMediatorName : this.constructor.name;
          if (aoViewComponent != null) {
            this[ipoViewComponent] = aoViewComponent;
          }
        }
      });

      Mediator.initialize();

      return Mediator;

    }).call(this);
  };

}).call(this);
