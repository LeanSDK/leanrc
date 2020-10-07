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
    var AnyT, ConfigurableMixin, FuncG, JOB_RESULT, MaybeG, NotificationInterface, Script, ScriptInterface, SimpleCommand, co;
    ({
      JOB_RESULT,
      AnyT,
      FuncG,
      MaybeG,
      ScriptInterface,
      NotificationInterface,
      ConfigurableMixin,
      SimpleCommand,
      Utils: {co}
    } = Module.prototype);
    return Script = (function() {
      class Script extends SimpleCommand {};

      Script.inheritProtected();

      Script.include(ConfigurableMixin);

      Script.implements(ScriptInterface);

      Script.module(Module);

      Script.public(Script.async({
        body: FuncG([MaybeG(AnyT)], MaybeG(AnyT))
      }, {
        default: function*() {}
      }));

      Script.public(Script.static({
        do: FuncG(Function)
      }, {
        default: function(lambda) {
          this.public(this.async({
            body: FuncG([MaybeG(AnyT)], MaybeG(AnyT))
          }, {
            default: lambda
          }));
        }
      }));

      Script.public(Script.async({
        execute: FuncG(NotificationInterface)
      }, {
        default: function*(aoNotification) {
          var err, res, reverse, voBody, voResult;
          //принимаем из нотификации данные, запускаем @body(), ждем пока отработает, посылаем сигнал о том, что обработка закончилась
          // в конце надо послать сигнал либо с пустым телом, либо с ошибкой.
          voBody = aoNotification.getBody();
          reverse = aoNotification.getType();
          try {
            res = (yield this.body(voBody));
            voResult = {
              result: res
            };
          } catch (error) {
            err = error;
            console.log('ERROR in Script::execute', err);
            voResult = {
              error: err
            };
          }
          this.sendNotification(JOB_RESULT, voResult, reverse);
        }
      }));

      Script.initialize();

      return Script;

    }).call(this);
  };

}).call(this);
