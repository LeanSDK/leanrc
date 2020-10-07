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
    var AnyT, CommandInterface, FacadeInterface, FuncG, MaybeG, MediatorInterface, NotificationInterface, NotifierInterface, ProxyInterface, SubsetG;
    ({AnyT, FuncG, SubsetG, MaybeG, CommandInterface, ProxyInterface, MediatorInterface, NotificationInterface, NotifierInterface} = Module.prototype);
    return FacadeInterface = (function() {
      class FacadeInterface extends NotifierInterface {};

      FacadeInterface.inheritProtected();

      FacadeInterface.module(Module);

      FacadeInterface.virtual({
        remove: FuncG([])
      });

      FacadeInterface.virtual({
        registerCommand: FuncG([String, SubsetG(CommandInterface)])
      });

      FacadeInterface.virtual({
        removeCommand: FuncG(String)
      });

      FacadeInterface.virtual({
        hasCommand: FuncG(String, Boolean)
      });

      FacadeInterface.virtual({
        registerProxy: FuncG(ProxyInterface)
      });

      FacadeInterface.virtual({
        retrieveProxy: FuncG(String, MaybeG(ProxyInterface))
      });

      FacadeInterface.virtual({
        removeProxy: FuncG(String, MaybeG(ProxyInterface))
      });

      FacadeInterface.virtual({
        hasProxy: FuncG(String, Boolean)
      });

      FacadeInterface.virtual({
        registerMediator: FuncG(MediatorInterface)
      });

      FacadeInterface.virtual({
        retrieveMediator: FuncG(String, MaybeG(MediatorInterface))
      });

      FacadeInterface.virtual({
        removeMediator: FuncG(String, MaybeG(MediatorInterface))
      });

      FacadeInterface.virtual({
        hasMediator: FuncG(String, Boolean)
      });

      FacadeInterface.virtual({
        notifyObservers: FuncG(NotificationInterface)
      });

      FacadeInterface.virtual({
        sendNotification: FuncG([String, MaybeG(AnyT), MaybeG(String)])
      });

      FacadeInterface.initialize();

      return FacadeInterface;

    }).call(this);
  };

}).call(this);
