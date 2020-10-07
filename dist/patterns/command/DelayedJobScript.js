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

  // написать пример использования в приложении
  module.exports = function(Module) {
    var ASYNC, Class, DelayedJobScript, Script;
    ({ASYNC, Script, Class} = Module.prototype);
    return DelayedJobScript = (function() {
      class DelayedJobScript extends Script {};

      DelayedJobScript.inheritProtected();

      DelayedJobScript.module(Module);

      DelayedJobScript.do(function*(aoData) {
        var args, config, methodName, moduleName, name, name1, name2, name3, ref, replica, replicated, vcInstanceClass;
        ({moduleName, replica, methodName, args} = aoData);
        replica.multitonKey = this[Symbol.for('~multitonKey')];
        if (moduleName !== this.ApplicationModule.name) {
          throw new Error(`Job was defined with moduleName = \`${moduleName}\`, but its Module = \`${this.ApplicationModule.name}\``);
          return;
        }
        switch (replica.type) {
          case 'class':
            replicated = (yield Class.restoreObject(this.ApplicationModule, replica));
            if ((config = replicated.classMethods[methodName]).async === ASYNC) {
              yield (typeof replicated[name = config.pointer] === "function" ? replicated[name](...args) : void 0);
            } else {
              if (typeof replicated[name1 = config.pointer] === "function") {
                replicated[name1](...args);
              }
            }
            break;
          case 'instance':
            vcInstanceClass = ((ref = this.ApplicationModule.NS) != null ? ref : this.ApplicationModule.prototype)[replica.class];
            replicated = (yield vcInstanceClass.restoreObject(this.ApplicationModule, replica));
            if ((config = vcInstanceClass.instanceMethods[methodName]).async === ASYNC) {
              yield (typeof replicated[name2 = config.pointer] === "function" ? replicated[name2](...args) : void 0);
            } else {
              if (typeof replicated[name3 = config.pointer] === "function") {
                replicated[name3](...args);
              }
            }
            break;
          default:
            throw new Error('Replica type must be `instance` or `class`');
        }
      });

      DelayedJobScript.initialize();

      return DelayedJobScript;

    }).call(this);
  };

}).call(this);
