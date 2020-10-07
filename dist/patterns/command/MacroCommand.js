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
    var CommandInterface, FuncG, ListG, MacroCommand, NotificationInterface, Notifier, SubsetG;
    ({ListG, FuncG, SubsetG, CommandInterface, NotificationInterface, Notifier} = Module.prototype);
    return MacroCommand = (function() {
      var iplSubCommands;

      class MacroCommand extends Notifier {};

      MacroCommand.inheritProtected();

      MacroCommand.implements(CommandInterface);

      MacroCommand.module(Module);

      iplSubCommands = MacroCommand.private({
        subCommands: ListG(SubsetG(CommandInterface))
      });

      MacroCommand.public({
        execute: FuncG(NotificationInterface)
      }, {
        default: function(aoNotification) {
          var i, len, vCommand, vlSubCommands;
          vlSubCommands = this[iplSubCommands].slice(0);
          for (i = 0, len = vlSubCommands.length; i < len; i++) {
            vCommand = vlSubCommands[i];
            ((vCommand) => {
              var voCommand;
              voCommand = vCommand.new();
              voCommand.initializeNotifier(this[Symbol.for('~multitonKey')]);
              return voCommand.execute(aoNotification);
            })(vCommand);
          }
          this[iplSubCommands].slice(0);
        }
      });

      MacroCommand.public({
        initializeMacroCommand: Function
      }, {
        default: function() {}
      });

      MacroCommand.public({
        addSubCommand: FuncG([SubsetG(CommandInterface)])
      }, {
        default: function(aClass) {
          this[iplSubCommands].push(aClass);
        }
      });

      MacroCommand.public({
        init: Function
      }, {
        default: function() {
          this.super(...arguments);
          this[iplSubCommands] = [];
          this.initializeMacroCommand();
        }
      });

      MacroCommand.public(MacroCommand.static(MacroCommand.async({
        restoreObject: Function
      }, {
        default: function*() {
          throw new Error(`restoreObject method not supported for ${this.name}`);
        }
      })));

      MacroCommand.public(MacroCommand.static(MacroCommand.async({
        replicateObject: Function
      }, {
        default: function*() {
          throw new Error(`replicateObject method not supported for ${this.name}`);
        }
      })));

      MacroCommand.initialize();

      return MacroCommand;

    }).call(this);
  };

}).call(this);
