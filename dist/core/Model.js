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
    var APPLICATION_MEDIATOR, AnyT, CoreObject, DictG, Facade, FuncG, MaybeG, Model, ModelInterface, PointerT, ProxyInterface, StructG, SubsetG, _;
    ({
      APPLICATION_MEDIATOR,
      AnyT,
      PointerT,
      SubsetG,
      DictG,
      FuncG,
      StructG,
      MaybeG,
      ProxyInterface,
      ModelInterface,
      CoreObject,
      Facade,
      Utils: {_}
    } = Module.prototype);
    return Model = (function() {
      var cphInstanceMap, ipcApplicationModule, iphMetaProxyMap, iphProxyMap, ipsMultitonKey;

      class Model extends CoreObject {};

      Model.inheritProtected();

      Model.implements(ModelInterface);

      Model.module(Module);

      Model.const({
        MULTITON_MSG: "Model instance for this multiton key already constructed!"
      });

      iphProxyMap = PointerT(Model.private({
        proxyMap: DictG(String, MaybeG(ProxyInterface))
      }));

      iphMetaProxyMap = PointerT(Model.private({
        metaProxyMap: DictG(String, MaybeG(StructG({
          className: MaybeG(String),
          data: MaybeG(AnyT)
        })))
      }));

      ipsMultitonKey = PointerT(Model.protected({
        multitonKey: MaybeG(String)
      }));

      cphInstanceMap = PointerT(Model.private(Model.static({
        _instanceMap: DictG(String, MaybeG(ModelInterface))
      }, {
        default: {}
      })));

      ipcApplicationModule = PointerT(Model.protected({
        ApplicationModule: MaybeG(SubsetG(Module))
      }));

      Model.public({
        ApplicationModule: SubsetG(Module)
      }, {
        get: function() {
          var ref, ref1, ref2, ref3;
          return this[ipcApplicationModule] != null ? this[ipcApplicationModule] : this[ipcApplicationModule] = this[ipsMultitonKey] != null ? (ref = (ref1 = Facade.getInstance(this[ipsMultitonKey])) != null ? (ref2 = ref1.retrieveMediator(APPLICATION_MEDIATOR)) != null ? (ref3 = ref2.getViewComponent()) != null ? ref3.Module : void 0 : void 0 : void 0) != null ? ref : this.Module : this.Module;
        }
      });

      Model.public(Model.static({
        getInstance: FuncG(String, ModelInterface)
      }, {
        default: function(asKey) {
          if (Model[cphInstanceMap][asKey] == null) {
            Model[cphInstanceMap][asKey] = Model.new(asKey);
          }
          return Model[cphInstanceMap][asKey];
        }
      }));

      Model.public(Model.static({
        removeModel: FuncG(String)
      }, {
        default: function(asKey) {
          var asProxyName, i, len, ref, voModel;
          if ((voModel = Model[cphInstanceMap][asKey]) != null) {
            ref = Reflect.ownKeys(voModel[iphProxyMap]);
            for (i = 0, len = ref.length; i < len; i++) {
              asProxyName = ref[i];
              voModel.removeProxy(asProxyName);
            }
            Model[cphInstanceMap][asKey] = void 0;
            delete Model[cphInstanceMap][asKey];
          }
        }
      }));

      Model.public({
        registerProxy: FuncG(ProxyInterface)
      }, {
        default: function(aoProxy) {
          aoProxy.initializeNotifier(this[ipsMultitonKey]);
          this[iphProxyMap][aoProxy.getProxyName()] = aoProxy;
          aoProxy.onRegister();
        }
      });

      Model.public({
        addProxy: FuncG(ProxyInterface)
      }, {
        default: function(...args) {
          return this.registerProxy(...args);
        }
      });

      Model.public({
        removeProxy: FuncG(String, MaybeG(ProxyInterface))
      }, {
        default: function(asProxyName) {
          var voProxy;
          voProxy = this[iphProxyMap][asProxyName];
          if (voProxy) {
            this[iphProxyMap][asProxyName] = void 0;
            this[iphMetaProxyMap][asProxyName] = void 0;
            delete this[iphProxyMap][asProxyName];
            delete this[iphMetaProxyMap][asProxyName];
            voProxy.onRemove();
          }
          return voProxy;
        }
      });

      Model.public({
        retrieveProxy: FuncG(String, MaybeG(ProxyInterface))
      }, {
        default: function(asProxyName) {
          var Class, className, data, ref, ref1, ref2;
          if (this[iphProxyMap][asProxyName] == null) {
            ({className, data = {}} = (ref = this[iphMetaProxyMap][asProxyName]) != null ? ref : {});
            if (!_.isEmpty(className)) {
              Class = ((ref1 = this.ApplicationModule.NS) != null ? ref1 : this.ApplicationModule.prototype)[className];
              this.registerProxy(Class.new(asProxyName, data));
            }
          }
          return (ref2 = this[iphProxyMap][asProxyName]) != null ? ref2 : null;
        }
      });

      Model.public({
        getProxy: FuncG(String, MaybeG(ProxyInterface))
      }, {
        default: function(...args) {
          return this.retrieveProxy(...args);
        }
      });

      Model.public({
        hasProxy: FuncG(String, Boolean)
      }, {
        default: function(asProxyName) {
          return (this[iphProxyMap][asProxyName] != null) || (this[iphMetaProxyMap][asProxyName] != null);
        }
      });

      Model.public({
        lazyRegisterProxy: FuncG([String, MaybeG(String), MaybeG(AnyT)])
      }, {
        default: function(asProxyName, asProxyClassName, ahData) {
          this[iphMetaProxyMap][asProxyName] = {
            className: asProxyClassName,
            data: ahData
          };
        }
      });

      Model.public({
        initializeModel: Function
      }, {
        default: function() {}
      });

      Model.public({
        init: FuncG(String)
      }, {
        default: function(asKey) {
          this.super(...arguments);
          if (Model[cphInstanceMap][asKey]) {
            throw new Error(Model.prototype.MULTITON_MSG);
          }
          Model[cphInstanceMap][asKey] = this;
          this[ipsMultitonKey] = asKey;
          this[iphProxyMap] = {};
          this[iphMetaProxyMap] = {};
          this.initializeModel();
        }
      });

      Model.initialize();

      return Model;

    }).call(this);
  };

}).call(this);
