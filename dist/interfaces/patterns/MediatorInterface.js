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
    var AnyT, FuncG, MaybeG, MediatorInterface, NotificationInterface, NotifierInterface;
    ({AnyT, FuncG, MaybeG, NotificationInterface, NotifierInterface} = Module.prototype);
    return MediatorInterface = (function() {
      class MediatorInterface extends NotifierInterface {};

      MediatorInterface.inheritProtected();

      MediatorInterface.module(Module);

      MediatorInterface.virtual({
        getMediatorName: FuncG([], String)
      });

      MediatorInterface.virtual({
        getViewComponent: FuncG([], MaybeG(AnyT))
      });

      MediatorInterface.virtual({
        setViewComponent: FuncG(AnyT)
      });

      MediatorInterface.virtual({
        listNotificationInterests: FuncG([], Array)
      });

      MediatorInterface.virtual({
        handleNotification: FuncG(NotificationInterface)
      });

      MediatorInterface.virtual({
        onRegister: Function
      });

      MediatorInterface.virtual({
        onRemove: Function
      });

      MediatorInterface.initialize();

      return MediatorInterface;

    }).call(this);
  };

}).call(this);
