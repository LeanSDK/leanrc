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
    var FilterControlMessage, FuncG, LogFilterMessage, MaybeG, PipeMessageInterface;
    ({FuncG, MaybeG} = Module.prototype);
    ({PipeMessageInterface, FilterControlMessage} = Module.prototype.Pipes.prototype);
    return LogFilterMessage = (function() {
      class LogFilterMessage extends FilterControlMessage {};

      LogFilterMessage.inheritProtected();

      LogFilterMessage.module(Module);

      LogFilterMessage.public(LogFilterMessage.static({
        BASE: String
      }, {
        get: function() {
          return `${FilterControlMessage.BASE}LoggerModule/`;
        }
      }));

      LogFilterMessage.public(LogFilterMessage.static({
        LOG_FILTER_NAME: String
      }, {
        get: function() {
          return `${this.BASE}logFilter/`;
        }
      }));

      LogFilterMessage.public(LogFilterMessage.static({
        SET_LOG_LEVEL: String
      }, {
        get: function() {
          return `${this.BASE}setLogLevel/`;
        }
      }));

      LogFilterMessage.public({
        logLevel: Number
      });

      LogFilterMessage.public(LogFilterMessage.static({
        filterLogByLevel: FuncG([PipeMessageInterface, MaybeG(Object)])
      }, {
        default: function(message, params = {}) {
          var logLevel;
          ({logLevel} = params);
          if (logLevel == null) {
            logLevel = 0;
          }
          if (message.getHeader().logLevel > params.logLevel) {
            throw new Error();
          }
        }
      }));

      LogFilterMessage.public({
        init: FuncG(String, MaybeG(Number))
      }, {
        default: function(action, logLevel = 0) {
          this.super(action, this.constructor.LOG_FILTER_NAME, null, {logLevel});
          this.logLevel = logLevel;
        }
      });

      LogFilterMessage.initialize();

      return LogFilterMessage;

    }).call(this);
  };

}).call(this);
