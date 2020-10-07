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
    var APPLICATION_MEDIATOR, AnyT, CommandInterface, ControllerInterface, CoreObject, DictG, Facade, FacadeInterface, FuncG, MaybeG, MediatorInterface, ModelInterface, NotificationInterface, PointerT, ProxyInterface, SubsetG, ViewInterface;
    ({APPLICATION_MEDIATOR, AnyT, PointerT, FuncG, SubsetG, DictG, MaybeG, FacadeInterface, ModelInterface, ViewInterface, ControllerInterface, CommandInterface, ProxyInterface, MediatorInterface, NotificationInterface, CoreObject} = Module.prototype);
    return Facade = (function() {
      var cphInstanceMap, ipmInitializeController, ipmInitializeFacade, ipmInitializeModel, ipmInitializeView, ipoController, ipoModel, ipoView, ipsMultitonKey;

      class Facade extends CoreObject {};

      Facade.inheritProtected();

      Facade.implements(FacadeInterface);

      Facade.module(Module);

      Facade.const({
        MULTITON_MSG: "Facade instance for this multiton key already constructed!"
      });

      ipoModel = PointerT(Facade.protected({
        model: MaybeG(ModelInterface)
      }));

      ipoView = PointerT(Facade.protected({
        view: MaybeG(ViewInterface)
      }));

      ipoController = PointerT(Facade.protected({
        controller: MaybeG(ControllerInterface)
      }));

      ipsMultitonKey = PointerT(Facade.protected({
        multitonKey: MaybeG(String)
      }));

      cphInstanceMap = PointerT(Facade.protected(Facade.static({
        instanceMap: DictG(String, MaybeG(FacadeInterface))
      }, {
        default: {}
      })));

      ipmInitializeModel = PointerT(Facade.protected({
        initializeModel: Function
      }, {
        default: function() {
          if (this[ipoModel] == null) {
            this[ipoModel] = Module.prototype.Model.getInstance(this[ipsMultitonKey]);
          }
        }
      }));

      ipmInitializeController = PointerT(Facade.protected({
        initializeController: Function
      }, {
        default: function() {
          if (this[ipoController] == null) {
            this[ipoController] = Module.prototype.Controller.getInstance(this[ipsMultitonKey]);
          }
        }
      }));

      ipmInitializeView = PointerT(Facade.protected({
        initializeView: Function
      }, {
        default: function() {
          if (this[ipoView] == null) {
            this[ipoView] = Module.prototype.View.getInstance(this[ipsMultitonKey]);
          }
        }
      }));

      ipmInitializeFacade = PointerT(Facade.protected({
        initializeFacade: Function
      }, {
        default: function() {
          this[ipmInitializeModel]();
          this[ipmInitializeController]();
          this[ipmInitializeView]();
        }
      }));

      Facade.public(Facade.static({
        getInstance: FuncG(String, FacadeInterface)
      }, {
        default: function(asKey) {
          if (Facade[cphInstanceMap][asKey] == null) {
            Facade[cphInstanceMap][asKey] = Facade.new(asKey);
          }
          return Facade[cphInstanceMap][asKey];
        }
      }));

      Facade.public({
        remove: FuncG([])
      }, {
        default: function() {
          Module.prototype.Model.removeModel(this[ipsMultitonKey]);
          Module.prototype.Controller.removeController(this[ipsMultitonKey]);
          Module.prototype.View.removeView(this[ipsMultitonKey]);
          this[ipoModel] = void 0;
          this[ipoView] = void 0;
          this[ipoController] = void 0;
          Module.prototype.Facade[cphInstanceMap][this[ipsMultitonKey]] = void 0;
          delete Module.prototype.Facade[cphInstanceMap][this[ipsMultitonKey]];
        }
      });

      Facade.public({
        registerCommand: FuncG([String, SubsetG(CommandInterface)])
      }, {
        default: function(asNotificationName, aCommand) {
          this[ipoController].registerCommand(asNotificationName, aCommand);
        }
      });

      Facade.public({
        addCommand: FuncG([String, SubsetG(CommandInterface)])
      }, {
        default: function(...args) {
          return this.registerCommand(...args);
        }
      });

      Facade.public({
        lazyRegisterCommand: FuncG([String, MaybeG(String)])
      }, {
        default: function(asNotificationName, asClassName) {
          this[ipoController].lazyRegisterCommand(asNotificationName, asClassName);
        }
      });

      Facade.public({
        removeCommand: FuncG(String)
      }, {
        default: function(asNotificationName) {
          this[ipoController].removeCommand(asNotificationName);
        }
      });

      Facade.public({
        hasCommand: FuncG(String, Boolean)
      }, {
        default: function(asNotificationName) {
          return this[ipoController].hasCommand(asNotificationName);
        }
      });

      Facade.public({
        registerProxy: FuncG(ProxyInterface)
      }, {
        default: function(aoProxy) {
          this[ipoModel].registerProxy(aoProxy);
        }
      });

      Facade.public({
        addProxy: FuncG(ProxyInterface)
      }, {
        default: function(...args) {
          return this.registerProxy(...args);
        }
      });

      Facade.public({
        lazyRegisterProxy: FuncG([String, MaybeG(String), MaybeG(AnyT)])
      }, {
        default: function(asProxyName, asProxyClassName, ahData) {
          this[ipoModel].lazyRegisterProxy(asProxyName, asProxyClassName, ahData);
        }
      });

      Facade.public({
        retrieveProxy: FuncG(String, MaybeG(ProxyInterface))
      }, {
        default: function(asProxyName) {
          return this[ipoModel].retrieveProxy(asProxyName);
        }
      });

      Facade.public({
        getProxy: FuncG(String, MaybeG(ProxyInterface))
      }, {
        default: function(...args) {
          return this.retrieveProxy(...args);
        }
      });

      Facade.public({
        removeProxy: FuncG(String, MaybeG(ProxyInterface))
      }, {
        default: function(asProxyName) {
          return this[ipoModel].removeProxy(asProxyName);
        }
      });

      Facade.public({
        hasProxy: FuncG(String, Boolean)
      }, {
        default: function(asProxyName) {
          return this[ipoModel].hasProxy(asProxyName);
        }
      });

      Facade.public({
        registerMediator: FuncG(MediatorInterface)
      }, {
        default: function(aoMediator) {
          if (this[ipoView]) {
            this[ipoView].registerMediator(aoMediator);
          }
        }
      });

      Facade.public({
        addMediator: FuncG(MediatorInterface)
      }, {
        default: function(...args) {
          return this.registerMediator(...args);
        }
      });

      Facade.public({
        retrieveMediator: FuncG(String, MaybeG(MediatorInterface))
      }, {
        default: function(asMediatorName) {
          if (this[ipoView]) {
            return this[ipoView].retrieveMediator(asMediatorName);
          }
        }
      });

      Facade.public({
        getMediator: FuncG(String, MaybeG(MediatorInterface))
      }, {
        default: function(...args) {
          return this.retrieveMediator(...args);
        }
      });

      Facade.public({
        removeMediator: FuncG(String, MaybeG(MediatorInterface))
      }, {
        default: function(asMediatorName) {
          if (this[ipoView]) {
            return this[ipoView].removeMediator(asMediatorName);
          }
        }
      });

      Facade.public({
        hasMediator: FuncG(String, Boolean)
      }, {
        default: function(asMediatorName) {
          if (this[ipoView]) {
            return this[ipoView].hasMediator(asMediatorName);
          }
        }
      });

      Facade.public({
        notifyObservers: FuncG(NotificationInterface)
      }, {
        default: function(aoNotification) {
          if (this[ipoView]) {
            this[ipoView].notifyObservers(aoNotification);
          }
        }
      });

      Facade.public({
        sendNotification: FuncG([String, MaybeG(AnyT), MaybeG(String)])
      }, {
        default: function(asName, aoBody, asType) {
          this.notifyObservers(Module.prototype.Notification.new(asName, aoBody, asType));
        }
      });

      Facade.public({
        send: FuncG([String, MaybeG(AnyT), MaybeG(String)])
      }, {
        default: function(...args) {
          return this.sendNotification(...args);
        }
      });

      Facade.public({
        initializeNotifier: FuncG(String)
      }, {
        default: function(asKey) {
          this[ipsMultitonKey] = asKey;
        }
      });

      // need test it
      Facade.public(Facade.static(Facade.async({
        restoreObject: FuncG([SubsetG(Module), Object], FacadeInterface)
      }, {
        default: function*(Module, replica) {
          var facade;
          if ((replica != null ? replica.class : void 0) === this.name && (replica != null ? replica.type : void 0) === 'instance') {
            if (Facade[cphInstanceMap][replica.multitonKey] == null) {
              Module.prototype[replica.application].new();
            }
            facade = Module.prototype.ApplicationFacade.getInstance(replica.multitonKey);
            return facade;
          } else {
            return (yield this.super(Module, replica));
          }
        }
      })));

      // need test it
      Facade.public(Facade.static(Facade.async({
        replicateObject: FuncG(FacadeInterface, Object)
      }, {
        default: function*(instance) {
          var application, applicationMediator, replica;
          replica = (yield this.super(instance));
          replica.multitonKey = instance[ipsMultitonKey];
          applicationMediator = instance.retrieveMediator(APPLICATION_MEDIATOR);
          application = applicationMediator.getViewComponent().constructor.name;
          replica.application = application;
          return replica;
        }
      })));

      Facade.public({
        init: FuncG(String)
      }, {
        default: function(asKey) {
          this.super(...arguments);
          if (Facade[cphInstanceMap][asKey] != null) {
            throw new Error(Facade.prototype.MULTITON_MSG);
          }
          this.initializeNotifier(asKey);
          Facade[cphInstanceMap][asKey] = this;
          this[ipmInitializeFacade]();
        }
      });

      Facade.initialize();

      return Facade;

    }).call(this);
  };

}).call(this);
