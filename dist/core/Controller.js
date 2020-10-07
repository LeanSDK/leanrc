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
    var APPLICATION_MEDIATOR, CommandInterface, Controller, ControllerInterface, CoreObject, DictG, Facade, FuncG, MaybeG, NotificationInterface, PointerT, SubsetG, ViewInterface, _;
    ({
      APPLICATION_MEDIATOR,
      PointerT,
      FuncG,
      SubsetG,
      DictG,
      MaybeG,
      ControllerInterface,
      ViewInterface,
      CommandInterface,
      NotificationInterface,
      CoreObject,
      Facade,
      Utils: {_}
    } = Module.prototype);
    return Controller = (function() {
      var cphInstanceMap, ipcApplicationModule, iphClassNames, iphCommandMap, ipoView, ipsMultitonKey;

      class Controller extends CoreObject {};

      Controller.inheritProtected();

      Controller.implements(ControllerInterface);

      Controller.module(Module);

      Controller.const({
        MULTITON_MSG: "Controller instance for this multiton key already constructed!"
      });

      ipoView = PointerT(Controller.private({
        view: ViewInterface
      }));

      iphCommandMap = PointerT(Controller.private({
        commandMap: DictG(String, MaybeG(SubsetG(CommandInterface)))
      }));

      iphClassNames = PointerT(Controller.private({
        classNames: DictG(String, MaybeG(String))
      }));

      ipsMultitonKey = PointerT(Controller.protected({
        multitonKey: MaybeG(String)
      }));

      cphInstanceMap = PointerT(Controller.private(Controller.static({
        _instanceMap: DictG(String, MaybeG(ControllerInterface))
      }, {
        default: {}
      })));

      ipcApplicationModule = PointerT(Controller.protected({
        ApplicationModule: MaybeG(SubsetG(Module))
      }));

      Controller.public({
        ApplicationModule: SubsetG(Module)
      }, {
        get: function() {
          var ref, ref1, ref2, ref3;
          return this[ipcApplicationModule] != null ? this[ipcApplicationModule] : this[ipcApplicationModule] = this[ipsMultitonKey] != null ? (ref = (ref1 = Facade.getInstance(this[ipsMultitonKey])) != null ? (ref2 = ref1.retrieveMediator(APPLICATION_MEDIATOR)) != null ? (ref3 = ref2.getViewComponent()) != null ? ref3.Module : void 0 : void 0 : void 0) != null ? ref : this.Module : this.Module;
        }
      });

      Controller.public(Controller.static({
        getInstance: FuncG(String, ControllerInterface)
      }, {
        default: function(asKey) {
          if (Controller[cphInstanceMap][asKey] == null) {
            Controller[cphInstanceMap][asKey] = Controller.new(asKey);
          }
          return Controller[cphInstanceMap][asKey];
        }
      }));

      Controller.public(Controller.static({
        removeController: FuncG(String)
      }, {
        default: function(asKey) {
          var asNotificationName, i, len, ref, voController;
          if ((voController = Controller[cphInstanceMap][asKey]) != null) {
            ref = Reflect.ownKeys(voController[iphCommandMap]);
            for (i = 0, len = ref.length; i < len; i++) {
              asNotificationName = ref[i];
              voController.removeCommand(asNotificationName);
            }
            Controller[cphInstanceMap][asKey] = void 0;
            delete Controller[cphInstanceMap][asKey];
          }
        }
      }));

      Controller.public({
        executeCommand: FuncG(NotificationInterface)
      }, {
        default: function(aoNotification) {
          var ref, vCommand, voCommand, vsClassName, vsName;
          vsName = aoNotification.getName();
          vCommand = this[iphCommandMap][vsName];
          if (vCommand == null) {
            if (!_.isEmpty(vsClassName = this[iphClassNames][vsName])) {
              vCommand = this[iphCommandMap][vsName] = ((ref = this.ApplicationModule.NS) != null ? ref : this.ApplicationModule.prototype)[vsClassName];
            }
          }
          if (vCommand != null) {
            voCommand = vCommand.new();
            voCommand.initializeNotifier(this[ipsMultitonKey]);
            voCommand.execute(aoNotification);
          }
        }
      });

      Controller.public({
        registerCommand: FuncG([String, SubsetG(CommandInterface)])
      }, {
        default: function(asNotificationName, aCommand) {
          if (!this[iphCommandMap][asNotificationName]) {
            this[ipoView].registerObserver(asNotificationName, Module.prototype.Observer.new(this.executeCommand, this));
            this[iphCommandMap][asNotificationName] = aCommand;
          }
        }
      });

      Controller.public({
        addCommand: FuncG([String, SubsetG(CommandInterface)])
      }, {
        default: function(...args) {
          return this.registerCommand(...args);
        }
      });

      Controller.public({
        lazyRegisterCommand: FuncG([String, MaybeG(String)])
      }, {
        default: function(asNotificationName, asClassName) {
          if (asClassName == null) {
            asClassName = asNotificationName;
          }
          if (!this[iphCommandMap][asNotificationName]) {
            this[ipoView].registerObserver(asNotificationName, Module.prototype.Observer.new(this.executeCommand, this));
            this[iphClassNames][asNotificationName] = asClassName;
          }
        }
      });

      Controller.public({
        hasCommand: FuncG(String, Boolean)
      }, {
        default: function(asNotificationName) {
          return (this[iphCommandMap][asNotificationName] != null) || (this[iphClassNames][asNotificationName] != null);
        }
      });

      Controller.public({
        removeCommand: FuncG(String)
      }, {
        default: function(asNotificationName) {
          if (this.hasCommand(asNotificationName)) {
            this[ipoView].removeObserver(asNotificationName, this);
            this[iphCommandMap][asNotificationName] = void 0;
            this[iphClassNames][asNotificationName] = void 0;
            delete this[iphCommandMap][asNotificationName];
            delete this[iphClassNames][asNotificationName];
          }
        }
      });

      Controller.public({
        initializeController: Function
      }, {
        default: function() {
          this[ipoView] = Module.prototype.View.getInstance(this[ipsMultitonKey]);
        }
      });

      Controller.public({
        init: FuncG(String)
      }, {
        default: function(asKey) {
          this.super(...arguments);
          if (Controller[cphInstanceMap][asKey]) {
            throw new Error(Controller.prototype.MULTITON_MSG);
          }
          Controller[cphInstanceMap][asKey] = this;
          this[ipsMultitonKey] = asKey;
          this[iphCommandMap] = {};
          this[iphClassNames] = {};
          this.initializeController();
        }
      });

      Controller.initialize();

      return Controller;

    }).call(this);
  };

}).call(this);
