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
    var AnyT, CoreObject, FuncG, LambdaT, MaybeG, NotificationInterface, Observer, ObserverInterface, PointerT;
    ({AnyT, PointerT, LambdaT, FuncG, MaybeG, ObserverInterface, NotificationInterface, CoreObject} = Module.prototype);
    return Observer = (function() {
      var ipoContext, ipoNotify;

      class Observer extends CoreObject {};

      Observer.inheritProtected();

      Observer.implements(ObserverInterface);

      Observer.module(Module);

      ipoNotify = PointerT(Observer.private({
        notify: MaybeG(Function)
      }));

      ipoContext = PointerT(Observer.private({
        context: MaybeG(AnyT)
      }));

      Observer.public({
        setNotifyMethod: FuncG(Function)
      }, {
        default: function(amNotifyMethod) {
          this[ipoNotify] = amNotifyMethod;
        }
      });

      Observer.public({
        setNotifyContext: FuncG(AnyT)
      }, {
        default: function(aoNotifyContext) {
          this[ipoContext] = aoNotifyContext;
        }
      });

      Observer.public({
        getNotifyMethod: FuncG([], MaybeG(Function))
      }, {
        default: function() {
          return this[ipoNotify];
        }
      });

      Observer.public({
        getNotifyContext: FuncG([], MaybeG(AnyT))
      }, {
        default: function() {
          return this[ipoContext];
        }
      });

      Observer.public({
        compareNotifyContext: FuncG(AnyT, Boolean)
      }, {
        default: function(object) {
          return object === this[ipoContext];
        }
      });

      Observer.public({
        notifyObserver: FuncG(NotificationInterface)
      }, {
        default: function(notification) {
          this.getNotifyMethod().call(this.getNotifyContext(), notification);
        }
      });

      Observer.public(Observer.static(Observer.async({
        restoreObject: Function
      }, {
        default: function*() {
          throw new Error(`restoreObject method not supported for ${this.name}`);
        }
      })));

      Observer.public(Observer.static(Observer.async({
        replicateObject: Function
      }, {
        default: function*() {
          throw new Error(`replicateObject method not supported for ${this.name}`);
        }
      })));

      Observer.public({
        init: FuncG([MaybeG(Function), MaybeG(AnyT)])
      }, {
        default: function(amNotifyMethod, aoNotifyContext) {
          this.super(...arguments);
          if (amNotifyMethod) {
            this.setNotifyMethod(amNotifyMethod);
          }
          if (aoNotifyContext) {
            this.setNotifyContext(aoNotifyContext);
          }
        }
      });

      Observer.initialize();

      return Observer;

    }).call(this);
  };

}).call(this);
