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
    var AnyT, CoreObject, FacadeInterface, FuncG, MaybeG, Notifier, NotifierInterface, PointerT, SubsetG;
    ({AnyT, PointerT, FuncG, SubsetG, MaybeG, NotifierInterface, FacadeInterface, CoreObject} = Module.prototype);
    return Notifier = (function() {
      var ipcApplicationModule, ipsMultitonKey;

      class Notifier extends CoreObject {};

      Notifier.inheritProtected();

      Notifier.implements(NotifierInterface);

      Notifier.module(Module);

      Notifier.const({
        MULTITON_MSG: "multitonKey for this Notifier not yet initialized!"
      });

      ipsMultitonKey = PointerT(Notifier.protected({
        multitonKey: MaybeG(String)
      }));

      ipcApplicationModule = PointerT(Notifier.protected({
        ApplicationModule: MaybeG(SubsetG(Module))
      }));

      Notifier.public({
        facade: FacadeInterface
      }, {
        get: function() {
          if (this[ipsMultitonKey] == null) {
            throw new Error(Notifier.prototype.MULTITON_MSG);
          }
          return Module.prototype.Facade.getInstance(this[ipsMultitonKey]);
        }
      });

      Notifier.public({
        sendNotification: FuncG([String, MaybeG(AnyT), MaybeG(String)])
      }, {
        default: function(asName, aoBody, asType) {
          var ref;
          if ((ref = this.facade) != null) {
            ref.sendNotification(asName, aoBody, asType);
          }
        }
      });

      Notifier.public({
        send: FuncG([String, MaybeG(AnyT), MaybeG(String)])
      }, {
        default: function(...args) {
          return this.sendNotification(...args);
        }
      });

      Notifier.public({
        initializeNotifier: FuncG(String)
      }, {
        default: function(asKey) {
          this[ipsMultitonKey] = asKey;
        }
      });

      Notifier.public({
        ApplicationModule: SubsetG(Module)
      }, {
        get: function() {
          var ref, ref1, ref2, ref3;
          return this[ipcApplicationModule] != null ? this[ipcApplicationModule] : this[ipcApplicationModule] = this[ipsMultitonKey] != null ? (ref = (ref1 = Module.prototype.Facade.getInstance(this[ipsMultitonKey])) != null ? (ref2 = ref1.retrieveMediator(Module.prototype.APPLICATION_MEDIATOR)) != null ? (ref3 = ref2.getViewComponent()) != null ? ref3.Module : void 0 : void 0 : void 0) != null ? ref : this.Module : this.Module;
        }
      });

      Notifier.initialize();

      return Notifier;

    }).call(this);
  };

}).call(this);
