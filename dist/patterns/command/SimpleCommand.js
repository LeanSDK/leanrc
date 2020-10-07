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
    var CommandInterface, FuncG, NotificationInterface, Notifier, SimpleCommand;
    ({FuncG, NotificationInterface, CommandInterface, Notifier} = Module.prototype);
    return SimpleCommand = (function() {
      class SimpleCommand extends Notifier {};

      SimpleCommand.inheritProtected();

      SimpleCommand.implements(CommandInterface);

      SimpleCommand.module(Module);

      SimpleCommand.public({
        execute: FuncG(NotificationInterface)
      }, {
        default: function() {}
      });

      SimpleCommand.public(SimpleCommand.static(SimpleCommand.async({
        restoreObject: Function
      }, {
        default: function*() {
          throw new Error(`restoreObject method not supported for ${this.name}`);
        }
      })));

      SimpleCommand.public(SimpleCommand.static(SimpleCommand.async({
        replicateObject: Function
      }, {
        default: function*() {
          throw new Error(`replicateObject method not supported for ${this.name}`);
        }
      })));

      SimpleCommand.initialize();

      return SimpleCommand;

    }).call(this);
  };

}).call(this);
