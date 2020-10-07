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

  // миксин может подмешиваться в наследники классa JunctionMediator
  module.exports = function(Module) {
    var CHANGE, DEBUG, ERROR, FATAL, FilterControlMessage, FuncG, INFO, JunctionMediator, LEVELS, LogFilterMessage, LogMessage, Mixin, NotificationInterface, PipeAwareModule, Pipes, PointerT, SEND_TO_LOG, SET_PARAMS, STDLOG, WARN;
    ({LogMessage, LogFilterMessage, Pipes, Mixin, PointerT, FuncG, NotificationInterface} = Module.prototype);
    ({JunctionMediator, PipeAwareModule, FilterControlMessage} = Pipes.prototype);
    ({SET_PARAMS} = FilterControlMessage);
    ({STDLOG} = PipeAwareModule);
    ({SEND_TO_LOG, LEVELS, DEBUG, ERROR, FATAL, INFO, WARN, CHANGE} = LogMessage);
    return Module.defineMixin(Mixin('LoggingJunctionMixin', function(BaseClass = JunctionMediator) {
      return (function() {
        var _Class, ipoJunction, ipoMultitonKey;

        _Class = class extends BaseClass {};

        _Class.inheritProtected();

        ipoMultitonKey = PointerT(Symbol.for('~multitonKey'));

        ipoJunction = PointerT(Symbol.for('~junction'));

        _Class.public({
          listNotificationInterests: FuncG([], Array)
        }, {
          default: function(...args) {
            var interests;
            interests = this.super(...args);
            interests.push(SEND_TO_LOG);
            interests.push(LogFilterMessage.SET_LOG_LEVEL);
            return interests;
          }
        });

        _Class.public({
          handleNotification: FuncG(NotificationInterface)
        }, {
          default: function(note) {
            var changedLevelMessage, level, logLevel, logMessage, setLogLevelMessage;
            switch (note.getName()) {
              case SEND_TO_LOG:
                switch (note.getType()) {
                  case LEVELS[DEBUG]:
                    level = DEBUG;
                    break;
                  case LEVELS[ERROR]:
                    level = ERROR;
                    break;
                  case LEVELS[FATAL]:
                    level = FATAL;
                    break;
                  case LEVELS[INFO]:
                    level = INFO;
                    break;
                  case LEVELS[WARN]:
                    level = WARN;
                    break;
                  default:
                    level = DEBUG;
                    break;
                }
                logMessage = LogMessage.new(level, this[ipoMultitonKey], note.getBody());
                this[ipoJunction].sendMessage(STDLOG, logMessage);
                break;
              case LogFilterMessage.SET_LOG_LEVEL:
                logLevel = note.getBody();
                setLogLevelMessage = LogFilterMessage.new(SET_PARAMS, logLevel);
                this[ipoJunction].sendMessage(STDLOG, setLogLevelMessage);
                changedLevelMessage = LogMessage.new(CHANGE, this[ipoMultitonKey], `Changed Log Level to: ${LogMessage.LEVELS[logLevel]}`);
                this[ipoJunction].sendMessage(STDLOG, changedLevelMessage);
                break;
              default:
                this.super(note);
            }
          }
        });

        _Class.initializeMixin();

        return _Class;

      }).call(this);
    }));
  };

}).call(this);
