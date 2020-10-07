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
    var ControllerInterface, CoreObject, DictG, FuncG, ListG, MaybeG, MediatorInterface, NotificationInterface, ObserverInterface, PointerT, UnionG, View, ViewInterface;
    ({PointerT, FuncG, DictG, UnionG, MaybeG, ListG, ViewInterface, ObserverInterface, NotificationInterface, MediatorInterface, ControllerInterface, CoreObject} = Module.prototype);
    return View = (function() {
      var cphInstanceMap, iphMediatorMap, iphObserverMap, ipsMultitonKey;

      class View extends CoreObject {};

      View.inheritProtected();

      View.implements(ViewInterface);

      View.module(Module);

      View.const({
        MULTITON_MSG: "View instance for this multiton key already constructed!"
      });

      iphMediatorMap = PointerT(View.protected({
        mediatorMap: DictG(String, MaybeG(MediatorInterface))
      }));

      iphObserverMap = PointerT(View.protected({
        observerMap: DictG(String, MaybeG(ListG(ObserverInterface)))
      }));

      ipsMultitonKey = PointerT(View.protected({
        multitonKey: MaybeG(String)
      }));

      cphInstanceMap = PointerT(View.private(View.static({
        _instanceMap: DictG(String, MaybeG(ViewInterface))
      }, {
        default: {}
      })));

      View.public(View.static({
        getInstance: FuncG(String, ViewInterface)
      }, {
        default: function(asKey) {
          if (View[cphInstanceMap][asKey] == null) {
            View[cphInstanceMap][asKey] = View.new(asKey);
          }
          return View[cphInstanceMap][asKey];
        }
      }));

      View.public(View.static({
        removeView: FuncG(String)
      }, {
        default: function(asKey) {
          var asMediatorName, j, len, ref, voView;
          if ((voView = View[cphInstanceMap][asKey]) != null) {
            ref = Reflect.ownKeys(voView[iphMediatorMap]);
            for (j = 0, len = ref.length; j < len; j++) {
              asMediatorName = ref[j];
              voView.removeMediator(asMediatorName);
            }
            View[cphInstanceMap][asKey] = void 0;
            delete View[cphInstanceMap][asKey];
          }
        }
      }));

      View.public({
        registerObserver: FuncG([String, ObserverInterface])
      }, {
        default: function(asNotificationName, aoObserver) {
          var vlObservers;
          vlObservers = this[iphObserverMap][asNotificationName];
          if (vlObservers != null) {
            vlObservers.push(aoObserver);
          } else {
            this[iphObserverMap][asNotificationName] = [aoObserver];
          }
        }
      });

      View.public({
        removeObserver: FuncG([String, UnionG(ControllerInterface, MediatorInterface)])
      }, {
        default: function(asNotificationName, aoNotifyContext) {
          var i, j, len, ref, vlObservers, voObserver;
          vlObservers = (ref = this[iphObserverMap][asNotificationName]) != null ? ref : [];
          for (i = j = 0, len = vlObservers.length; j < len; i = ++j) {
            voObserver = vlObservers[i];
            if ((function(voObserver) {
              var ref1;
              if (voObserver.compareNotifyContext(aoNotifyContext)) {
                splice.apply(vlObservers, [i, i - i + 1].concat(ref1 = [])), ref1;
                return true;
              }
              return false;
            })(voObserver)) {
              break;
            }
          }
          if (vlObservers.length === 0) {
            delete this[iphObserverMap][asNotificationName];
          }
        }
      });

      View.public({
        notifyObservers: FuncG(NotificationInterface)
      }, {
        default: function(aoNotification) {
          var j, len, vlNewObservers, vlObservers, voObserver, vsNotificationName;
          vsNotificationName = aoNotification.getName();
          vlObservers = this[iphObserverMap][vsNotificationName];
          if (vlObservers != null) {
            vlNewObservers = vlObservers.slice(0);
            for (j = 0, len = vlNewObservers.length; j < len; j++) {
              voObserver = vlNewObservers[j];
              (function(voObserver) {
                return voObserver.notifyObserver(aoNotification);
              })(voObserver);
            }
          }
        }
      });

      View.public({
        registerMediator: FuncG(MediatorInterface)
      }, {
        default: function(aoMediator) {
          var j, len, ref, vlInterests, voObserver, vsInterest, vsName;
          vsName = aoMediator.getMediatorName();
          // Do not allow re-registration (you must removeMediator first).
          if (this[iphMediatorMap][vsName] != null) {
            return;
          }
          aoMediator.initializeNotifier(this[ipsMultitonKey]);
          // Register the Mediator for retrieval by name.
          this[iphMediatorMap][vsName] = aoMediator;
          // Get Notification interests, if any.
          vlInterests = (ref = aoMediator.listNotificationInterests()) != null ? ref : [];
          if (vlInterests.length > 0) {
            voObserver = Module.prototype.Observer.new(aoMediator.handleNotification, aoMediator);
            for (j = 0, len = vlInterests.length; j < len; j++) {
              vsInterest = vlInterests[j];
              ((vsInterest) => {
                return this.registerObserver(vsInterest, voObserver);
              })(vsInterest);
            }
          }
          // Alert the mediator that it has been registered.
          aoMediator.onRegister();
        }
      });

      View.public({
        addMediator: FuncG(MediatorInterface)
      }, {
        default: function(...args) {
          return this.registerMediator(...args);
        }
      });

      View.public({
        retrieveMediator: FuncG(String, MaybeG(MediatorInterface))
      }, {
        default: function(asMediatorName) {
          var ref;
          return (ref = this[iphMediatorMap][asMediatorName]) != null ? ref : null;
        }
      });

      View.public({
        getMediator: FuncG(String, MaybeG(MediatorInterface))
      }, {
        default: function(...args) {
          return this.retrieveMediator(...args);
        }
      });

      View.public({
        removeMediator: FuncG(String, MaybeG(MediatorInterface))
      }, {
        default: function(asMediatorName) {
          var j, len, vlInterests, voMediator, vsInterest;
          voMediator = this[iphMediatorMap][asMediatorName];
          if (voMediator == null) {
            return null;
          }
          // Get Notification interests, if any.
          vlInterests = voMediator.listNotificationInterests();
// For every notification this mediator is interested in...
          for (j = 0, len = vlInterests.length; j < len; j++) {
            vsInterest = vlInterests[j];
            ((vsInterest) => {
              return this.removeObserver(vsInterest, voMediator);
            })(vsInterest);
          }
          // remove the mediator from the map
          this[iphMediatorMap][asMediatorName] = void 0;
          delete this[iphMediatorMap][asMediatorName];
          // Alert the mediator that it has been removed
          voMediator.onRemove();
          return voMediator;
        }
      });

      View.public({
        hasMediator: FuncG(String, Boolean)
      }, {
        default: function(asMediatorName) {
          return this[iphMediatorMap][asMediatorName] != null;
        }
      });

      View.public({
        initializeView: Function
      }, {
        default: function() {}
      });

      View.public({
        init: FuncG(String)
      }, {
        default: function(asKey) {
          this.super(...arguments);
          if (View[cphInstanceMap][asKey]) {
            throw Error(View.prototype.MULTITON_MSG);
          }
          View[cphInstanceMap][asKey] = this;
          this[ipsMultitonKey] = asKey;
          this[iphMediatorMap] = {};
          this[iphObserverMap] = {};
          this.initializeView();
        }
      });

      View.initialize();

      return View;

    }).call(this);
  };

}).call(this);
