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
    var AnyT, FuncG, Interface, MaybeG, NotifierInterface;
    ({AnyT, FuncG, MaybeG, Interface} = Module.prototype);
    return NotifierInterface = (function() {
      class NotifierInterface extends Interface {};

      NotifierInterface.inheritProtected();

      NotifierInterface.module(Module);

      NotifierInterface.virtual({
        sendNotification: FuncG([String, MaybeG(AnyT), MaybeG(String)])
      });

      NotifierInterface.virtual({
        initializeNotifier: FuncG(String)
      });

      NotifierInterface.initialize();

      return NotifierInterface;

    }).call(this);
  };

}).call(this);
